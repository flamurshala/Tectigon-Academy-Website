<?php

declare(strict_types=1);

class PaymentRepository
{
    public static function buildCreateOrderPayload(array $config, array $order, array $training): array
    {
        $hppRedirectUrl = (string) ($config['hpp_redirect_url'] ?? '');
        if ($hppRedirectUrl === '') {
            $hppRedirectUrl = rtrim((string) $config['frontend_base_url'], '/') . '/payment/result';
        }

        $separator = str_contains($hppRedirectUrl, '?') ? '&' : '?';
        $hppRedirectUrl .= $separator . 'order_number=' . rawurlencode($order['order_number']);

        return [
            'order' => [
                'typeRid' => $config['order_type_rid'],
                'amount' => number_format((float) $order['amount'], 2, '.', ''),
                'currency' => 'EUR',
                'description' => $order['order_number'] . ' - ' . $training['title'],
                'language' => $config['language'],
                'hppRedirectUrl' => $hppRedirectUrl,
                'initiationEnvKind' => 'Browser',
                'consumerDevice' => [
                    'browser' => [
                        'javaEnabled' => false,
                        'jsEnabled' => true,
                        'acceptHeader' => $_SERVER['HTTP_ACCEPT'] ?? 'application/json,application/jose;charset=utf-8',
                        'ip' => self::clientIp(),
                        'colorDepth' => '24',
                        'screenW' => '1080',
                        'screenH' => '1920',
                        'tzOffset' => '-300',
                        'language' => $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? 'en-EN',
                        'userAgent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Mozilla/5.0',
                    ],
                ],
            ],
        ];
    }

    public static function clientIp(): string
    {
        $forwardedFor = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
        if ($forwardedFor !== '') {
            return trim(explode(',', $forwardedFor)[0]);
        }

        return $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    }

    public static function bankStatusToLocal(?string $bankStatus, string $fallback = 'processing'): string
    {
        $normalized = self::normalizeBankStatus($bankStatus);

        return match ($normalized) {
            'beingprepared', 'preparing', 'created', 'authorized', 'partiallypaid' => 'processing',
            'pending' => 'pending',
            'funded', 'fullypaid', 'paid', 'closed' => 'completed',
            'expired', 'rejected', 'refused', 'failed', 'declined' => 'failed',
            'cancelled', 'canceled' => 'canceled',
            'refunded' => 'refunded',
            default => $fallback,
        };
    }

    public static function normalizeBankStatus(?string $bankStatus): string
    {
        $status = strtolower(trim((string) $bankStatus));

        return preg_replace('/[^a-z0-9]/', '', $status) ?: '';
    }

    public static function isKnownBankStatus(?string $bankStatus): bool
    {
        $normalized = self::normalizeBankStatus($bankStatus);

        return in_array($normalized, [
            'beingprepared',
            'preparing',
            'created',
            'authorized',
            'partiallypaid',
            'pending',
            'funded',
            'fullypaid',
            'paid',
            'closed',
            'expired',
            'rejected',
            'refused',
            'failed',
            'declined',
            'cancelled',
            'canceled',
            'refunded',
        ], true);
    }

    public static function extractBankOrder(array $response): array
    {
        $order = $response['order'] ?? [];

        if (!is_array($order)) {
            $order = [];
        }

        return [
            'id' => $order['id'] ?? null,
            'password' => $order['password'] ?? null,
            'hppUrl' => $order['hppUrl'] ?? null,
            'status' => $order['status'] ?? null,
            'cvv2AuthStatus' => $order['cvv2AuthStatus'] ?? null,
        ];
    }

    public static function extractTransactionFields(array $response): array
    {
        $order = $response['order'] ?? [];
        $transactions = $order['trans'] ?? $order['transactions'] ?? [];
        $transaction = is_array($transactions) && isset($transactions[0]) && is_array($transactions[0])
            ? $transactions[0]
            : [];

        return [
            'provider_payment_id' => $order['id'] ?? null,
            'provider_transaction_id' => $transaction['id'] ?? $transaction['tranId'] ?? null,
            'approval_code' => $transaction['approvalCode'] ?? $transaction['approval_code'] ?? null,
        ];
    }

    public static function syncBankDetails(PDO $pdo, BankGatewayClient $client, array $paymentRow, string $action): array
    {
        $before = $paymentRow['status'];
        $orderId = (int) $paymentRow['order_id'];
        $paymentId = (int) $paymentRow['payment_id'];
        $bankOrderId = (string) ($paymentRow['bank_order_id'] ?? '');
        $password = (string) ($paymentRow['bank_order_password'] ?? '');

        if ($bankOrderId === '' || $password === '') {
            log_payment_action($pdo, $action, $orderId, $paymentId, $before, $before, null, null, null, 'Missing bank order credentials.');
            return payment_row_to_response($paymentRow);
        }

        try {
            $response = $client->getOrderDetails($bankOrderId, $password);
            $bankOrder = self::extractBankOrder($response);
            $bankStatus = $bankOrder['status'] ?? null;
            $localStatus = self::bankStatusToLocal($bankStatus, 'processing');
            $knownBankStatus = self::isKnownBankStatus($bankStatus);
            $transactionFields = self::extractTransactionFields($response);
            $timestampColumn = payment_timestamp_column($localStatus);

            $pdo->beginTransaction();
            $pdo->prepare(
                'UPDATE orders
                 SET status = :status,
                     bank_status = :bank_status,
                     raw_get_order_response = :raw_response
                 WHERE id = :id'
            )->execute([
                'status' => $localStatus,
                'bank_status' => $bankStatus,
                'raw_response' => $response['_raw_response'],
                'id' => $orderId,
            ]);

            $paymentSql = 'UPDATE payments
                 SET status = :status,
                     bank_status = :bank_status,
                     provider_payment_id = COALESCE(:provider_payment_id, provider_payment_id),
                     provider_transaction_id = COALESCE(:provider_transaction_id, provider_transaction_id),
                     approval_code = COALESCE(:approval_code, approval_code),
                     raw_response = :raw_response';

            if ($timestampColumn !== null) {
                $paymentSql .= ", {$timestampColumn} = COALESCE({$timestampColumn}, NOW())";
            }

            $paymentSql .= ' WHERE id = :id';

            $pdo->prepare($paymentSql)->execute([
                'status' => $localStatus,
                'bank_status' => $bankStatus,
                'provider_payment_id' => $transactionFields['provider_payment_id'],
                'provider_transaction_id' => $transactionFields['provider_transaction_id'],
                'approval_code' => $transactionFields['approval_code'],
                'raw_response' => $response['_raw_response'],
                'id' => $paymentId,
            ]);

            log_payment_action($pdo, $knownBankStatus ? $action : $action . '_unknown_bank_status', $orderId, $paymentId, $before, $localStatus, [
                'bank_order_id' => $bankOrderId,
                'bank_status' => $bankStatus,
                'known_bank_status' => $knownBankStatus,
            ], $response['_raw_response'], $response['_http_status']);
            $pdo->commit();
        } catch (Throwable $exception) {
            log_payment_action($pdo, $action, $orderId, $paymentId, $before, $before, [
                'bank_order_id' => $bankOrderId,
            ], null, null, $exception->getMessage());
        }

        $statement = $pdo->prepare(payment_select_sql() . ' WHERE p.id = :id LIMIT 1');
        $statement->execute(['id' => $paymentId]);

        return payment_row_to_response($statement->fetch());
    }
}
