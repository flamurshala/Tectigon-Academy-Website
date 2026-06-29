<?php

declare(strict_types=1);

const PAYMENT_STATUSES = ['pending', 'processing', 'completed', 'failed', 'canceled', 'refunded'];

function is_valid_payment_status(string $status): bool
{
    return in_array($status, PAYMENT_STATUSES, true);
}

function payment_timestamp_column(string $status): ?string
{
    return match ($status) {
        'completed' => 'paid_at',
        'failed' => 'failed_at',
        'canceled' => 'canceled_at',
        'refunded' => 'refunded_at',
        default => null,
    };
}

function create_order_number(PDO $pdo, int $orderId): string
{
    $year = date('Y');
    $baseNumber = sprintf('TA-%s-%06d', $year, $orderId);
    $orderNumber = $baseNumber;
    $suffix = 2;

    while (order_number_exists($pdo, $orderNumber, $orderId)) {
        $orderNumber = "{$baseNumber}-{$suffix}";
        $suffix++;
    }

    return $orderNumber;
}

function order_number_exists(PDO $pdo, string $orderNumber, int $ignoreOrderId): bool
{
    $statement = $pdo->prepare('SELECT id FROM orders WHERE order_number = :order_number AND id <> :id LIMIT 1');
    $statement->execute(['order_number' => $orderNumber, 'id' => $ignoreOrderId]);
    return (bool) $statement->fetch();
}

function log_payment_action(
    PDO $pdo,
    string $action,
    ?int $orderId = null,
    ?int $paymentId = null,
    ?string $statusBefore = null,
    ?string $statusAfter = null,
    mixed $requestPayload = null,
    mixed $responsePayload = null,
    ?int $httpStatusCode = null,
    ?string $errorMessage = null
): void {
    $statement = $pdo->prepare(
        'INSERT INTO payment_logs (
            order_id, payment_id, action, status_before, status_after, request_payload,
            response_payload, http_status_code, error_message
        ) VALUES (
            :order_id, :payment_id, :action, :status_before, :status_after, :request_payload,
            :response_payload, :http_status_code, :error_message
        )'
    );
    $statement->execute([
        'order_id' => $orderId,
        'payment_id' => $paymentId,
        'action' => $action,
        'status_before' => $statusBefore,
        'status_after' => $statusAfter,
        'request_payload' => encode_payload($requestPayload),
        'response_payload' => encode_payload($responsePayload),
        'http_status_code' => $httpStatusCode,
        'error_message' => $errorMessage,
    ]);
}

function encode_payload(mixed $payload): ?string
{
    if ($payload === null || $payload === '') {
        return null;
    }

    if (is_string($payload)) {
        return $payload;
    }

    return json_encode($payload);
}

function payment_row_to_response(array $row): array
{
    return [
        'id' => (int) $row['payment_id'],
        'order_id' => (int) $row['order_id'],
        'order_number' => $row['order_number'],
        'training_id' => (int) $row['training_id'],
        'training_title' => $row['training_title'],
        'customer_name' => $row['customer_name'],
        'customer_email' => $row['customer_email'],
        'customer_phone' => $row['customer_phone'] ?? null,
        'amount' => (float) $row['amount'],
        'currency' => 'EUR',
        'status' => $row['status'],
        'payment_provider' => $row['payment_provider'],
        'provider_payment_id' => $row['provider_payment_id'] ?? null,
        'provider_transaction_id' => $row['provider_transaction_id'] ?? null,
        'approval_code' => $row['approval_code'] ?? null,
        'bank_order_id' => $row['bank_order_id'] ?? null,
        'bank_hpp_url' => $row['bank_hpp_url'] ?? null,
        'notes' => $row['notes'] ?? null,
        'raw_response' => $row['raw_response'] ?? null,
        'created_at' => $row['created_at'],
        'updated_at' => $row['updated_at'],
        'paid_at' => $row['paid_at'],
        'canceled_at' => $row['canceled_at'] ?? null,
        'failed_at' => $row['failed_at'] ?? null,
        'refunded_at' => $row['refunded_at'] ?? null,
    ];
}

function build_payment_filters(array $input): array
{
    $where = [];
    $params = [];

    $status = trim((string) ($input['status'] ?? ''));
    if ($status !== '' && is_valid_payment_status($status)) {
        $where[] = 'o.status = :status';
        $params['status'] = $status;
    }

    $trainingId = (int) ($input['training_id'] ?? 0);
    if ($trainingId > 0) {
        $where[] = 'o.training_id = :training_id';
        $params['training_id'] = $trainingId;
    }

    $customerEmail = trim((string) ($input['customer_email'] ?? ''));
    if ($customerEmail !== '') {
        $where[] = 'o.customer_email LIKE :customer_email';
        $params['customer_email'] = "%{$customerEmail}%";
    }

    $search = trim((string) ($input['search'] ?? ''));
    if ($search !== '') {
        $where[] = '(o.order_number LIKE :search OR o.customer_name LIKE :search OR o.customer_email LIKE :search OR t.title LIKE :search)';
        $params['search'] = "%{$search}%";
    }

    $dateFrom = trim((string) ($input['date_from'] ?? ''));
    if ($dateFrom !== '') {
        $where[] = 'DATE(o.created_at) >= :date_from';
        $params['date_from'] = $dateFrom;
    }

    $dateTo = trim((string) ($input['date_to'] ?? ''));
    if ($dateTo !== '') {
        $where[] = 'DATE(o.created_at) <= :date_to';
        $params['date_to'] = $dateTo;
    }

    return [
        'where' => $where === [] ? '' : 'WHERE ' . implode(' AND ', $where),
        'params' => $params,
    ];
}

function payment_select_sql(): string
{
    return 'SELECT
        p.id AS payment_id,
        o.id AS order_id,
        o.order_number,
        o.training_id,
        t.title AS training_title,
        o.customer_name,
        o.customer_email,
        o.customer_phone,
        o.amount,
        o.currency,
        o.status,
        o.payment_provider,
        o.bank_order_id,
        o.bank_hpp_url,
        o.notes,
        p.provider_payment_id,
        p.provider_transaction_id,
        p.approval_code,
        p.raw_response,
        o.created_at,
        o.updated_at,
        p.paid_at,
        p.canceled_at,
        p.failed_at,
        p.refunded_at
      FROM orders o
      INNER JOIN payments p ON p.order_id = o.id
      INNER JOIN trainings t ON t.id = o.training_id';
}

function update_order_payment_status(PDO $pdo, int $orderId, string $status, ?string $note = null): array
{
    if (!is_valid_payment_status($status)) {
        send_json(['success' => false, 'error' => 'Invalid payment status.'], 422);
    }

    $statement = $pdo->prepare(
        payment_select_sql() . ' WHERE o.id = :id LIMIT 1'
    );
    $statement->execute(['id' => $orderId]);
    $current = $statement->fetch();

    if (!$current) {
        send_json(['success' => false, 'error' => 'Payment not found.'], 404);
    }

    $before = $current['status'];
    $timestampColumn = payment_timestamp_column($status);

    $pdo->beginTransaction();
    $orderStatement = $pdo->prepare('UPDATE orders SET status = :status, notes = COALESCE(:notes, notes) WHERE id = :id');
    $orderStatement->execute(['status' => $status, 'notes' => $note, 'id' => $orderId]);

    $paymentSql = 'UPDATE payments SET status = :status';
    if ($timestampColumn !== null) {
        $paymentSql .= ", {$timestampColumn} = NOW()";
    }
    $paymentSql .= ' WHERE order_id = :order_id';
    $paymentStatement = $pdo->prepare($paymentSql);
    $paymentStatement->execute(['status' => $status, 'order_id' => $orderId]);

    $paymentId = (int) $current['payment_id'];
    log_payment_action($pdo, 'status_updated', $orderId, $paymentId, $before, $status, ['note' => $note]);
    $pdo->commit();

    $statement = $pdo->prepare(payment_select_sql() . ' WHERE o.id = :id LIMIT 1');
    $statement->execute(['id' => $orderId]);

    return payment_row_to_response($statement->fetch());
}
