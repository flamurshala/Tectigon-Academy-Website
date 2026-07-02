<?php

declare(strict_types=1);

require __DIR__ . '/../../lib/cors.php';
require __DIR__ . '/../../lib/response.php';
require __DIR__ . '/../../lib/payment.php';
require __DIR__ . '/../../lib/BankGatewayClient.php';
require __DIR__ . '/../../lib/PaymentRepository.php';
require __DIR__ . '/../../lib/Validator.php';

apply_cors_headers();
require_method('POST');

$body = read_json_body();
$trainingId = (int) ($body['training_id'] ?? 0);
$customerName = trim((string) ($body['customer_name'] ?? ''));
$customerEmail = trim((string) ($body['customer_email'] ?? ''));
$customerPhone = trim((string) ($body['customer_phone'] ?? ''));

if ($trainingId <= 0 || !Validator::nonEmpty($customerName) || !Validator::email($customerEmail)) {
    send_json([
        'success' => false,
        'error' => 'Training, customer name, and valid email are required.',
    ], 422);
}

$pdo = require __DIR__ . '/../../config/connection.php';
$gatewayConfig = require __DIR__ . '/../../config/payment-gateway.php';
$statement = $pdo->prepare('SELECT id, title, price, is_active FROM trainings WHERE id = :id LIMIT 1');
$statement->execute(['id' => $trainingId]);
$training = $statement->fetch();

if (!$training || (int) $training['is_active'] !== 1) {
    send_json(['success' => false, 'error' => 'Training is not available.'], 404);
}

$amount = (float) $training['price'];
$provider = 'local_bank';

$pdo->beginTransaction();
$temporaryOrderNumber = 'TEMP-' . bin2hex(random_bytes(8));

$orderStatement = $pdo->prepare(
    'INSERT INTO orders (
      order_number, training_id, customer_name, customer_email, customer_phone,
      amount, currency, status, payment_provider
    ) VALUES (
      :order_number, :training_id, :customer_name, :customer_email, :customer_phone,
      :amount, "EUR", "pending", :payment_provider
    )'
);
$orderStatement->execute([
    'order_number' => $temporaryOrderNumber,
    'training_id' => $trainingId,
    'customer_name' => $customerName,
    'customer_email' => $customerEmail,
    'customer_phone' => $customerPhone === '' ? null : $customerPhone,
    'amount' => $amount,
    'payment_provider' => $provider,
]);

$orderId = (int) $pdo->lastInsertId();
$orderNumber = create_order_number($pdo, $orderId);
$pdo->prepare('UPDATE orders SET order_number = :order_number WHERE id = :id')->execute([
    'order_number' => $orderNumber,
    'id' => $orderId,
]);

$paymentStatement = $pdo->prepare(
    'INSERT INTO payments (order_id, payment_provider, amount, currency, status)
     VALUES (:order_id, :payment_provider, :amount, "EUR", "pending")'
);
$paymentStatement->execute([
    'order_id' => $orderId,
    'payment_provider' => $provider,
    'amount' => $amount,
]);
$paymentId = (int) $pdo->lastInsertId();

log_payment_action($pdo, 'order_created', $orderId, $paymentId, null, 'pending', [
    'training_id' => $trainingId,
    'customer_email' => $customerEmail,
]);
$pdo->commit();

$order = [
    'id' => $orderId,
    'order_number' => $orderNumber,
    'amount' => $amount,
];
$payload = PaymentRepository::buildCreateOrderPayload($gatewayConfig, $order, $training);
$client = new BankGatewayClient($gatewayConfig);

try {
    $bankResponse = $client->createOrder($payload);
    $bankOrder = PaymentRepository::extractBankOrder($bankResponse);

    if (!$bankOrder['id'] || !$bankOrder['password'] || !$bankOrder['hppUrl']) {
        throw new RuntimeException('Bank Create Order response is missing order.id, order.password, or order.hppUrl.');
    }

    $redirectUrl = $client->buildHppRedirectUrl($bankOrder['hppUrl'], (string) $bankOrder['id'], (string) $bankOrder['password']);

    $pdo->beginTransaction();
    $pdo->prepare(
        'UPDATE orders
         SET status = "processing",
             bank_order_id = :bank_order_id,
             bank_order_password = :bank_order_password,
             bank_hpp_url = :bank_hpp_url,
             bank_status = :bank_status,
             hpp_redirect_url = :hpp_redirect_url,
             raw_create_order_response = :raw_response
         WHERE id = :id'
    )->execute([
        'bank_order_id' => $bankOrder['id'],
        'bank_order_password' => $bankOrder['password'],
        'bank_hpp_url' => $bankOrder['hppUrl'],
        'bank_status' => $bankOrder['status'],
        'hpp_redirect_url' => $redirectUrl,
        'raw_response' => $bankResponse['_raw_response'],
        'id' => $orderId,
    ]);

    $pdo->prepare(
        'UPDATE payments
         SET status = "processing",
             bank_status = :bank_status,
             provider_payment_id = :provider_payment_id,
             raw_response = :raw_response
         WHERE id = :id'
    )->execute([
        'bank_status' => $bankOrder['status'],
        'provider_payment_id' => $bankOrder['id'],
        'raw_response' => $bankResponse['_raw_response'],
        'id' => $paymentId,
    ]);

    log_payment_action($pdo, 'create_order', $orderId, $paymentId, 'pending', 'processing', $payload, $bankResponse['_raw_response'], $bankResponse['_http_status']);
    $pdo->commit();

    send_json([
        'success' => true,
        'order_number' => $orderNumber,
        'status' => 'processing',
        'redirect_url' => $redirectUrl,
    ]);
} catch (Throwable $exception) {
    $bankDebugContext = $exception instanceof BankGatewayHttpException ? $exception->debugContext() : [];
    $bankErrorCode = $exception instanceof BankGatewayHttpException ? $exception->bankErrorCode() : null;
    $bankErrorDescription = $exception instanceof BankGatewayHttpException ? $exception->bankErrorDescription() : null;
    $rawResponseBody = is_string($bankDebugContext['raw_response_body'] ?? null)
        ? $bankDebugContext['raw_response_body']
        : null;
    $httpStatus = isset($bankDebugContext['http_status']) ? (int) $bankDebugContext['http_status'] : null;

    $pdo->beginTransaction();
    $pdo->prepare(
        'UPDATE orders
         SET status = "failed",
             raw_create_order_response = COALESCE(:raw_response, raw_create_order_response),
             notes = :notes
         WHERE id = :id'
    )->execute([
        'raw_response' => $rawResponseBody,
        'notes' => $exception->getMessage(),
        'id' => $orderId,
    ]);
    $pdo->prepare(
        'UPDATE payments
         SET status = "failed",
             failed_at = NOW(),
             raw_response = COALESCE(:raw_response, raw_response)
         WHERE id = :id'
    )->execute([
        'raw_response' => $rawResponseBody,
        'id' => $paymentId,
    ]);
    log_payment_action(
        $pdo,
        'create_order',
        $orderId,
        $paymentId,
        'pending',
        'failed',
        [
            'payload' => $payload,
            'bank_debug' => $bankDebugContext,
        ],
        $rawResponseBody,
        $httpStatus,
        $exception->getMessage()
    );
    $pdo->commit();

    $isOrderTypeError = $bankErrorCode === 'OrderTypeNotFound';
    $response = [
        'success' => false,
        'error' => $isOrderTypeError ? 'Bank rejected the order type.' : $exception->getMessage(),
        'order_number' => $orderNumber,
        'status' => 'failed',
    ];

    if ($bankErrorCode !== null) {
        $response['bank_error_code'] = $bankErrorCode;
    }

    if ($bankErrorDescription !== null) {
        $response['bank_error_description'] = $bankErrorDescription;
    }

    $appEnv = strtolower((string) ($gatewayConfig['app_env'] ?? 'production'));
    if (str_contains($exception->getMessage(), 'TLS verification failed') && in_array($appEnv, ['local', 'test'], true)) {
        $response['debug_hint'] = 'ca.pem may be missing, wrong, unreadable, or missing intermediate/root certificates.';
    }

    if ($exception instanceof BankGatewayHttpException && in_array($appEnv, ['local', 'test'], true)) {
        if ($isOrderTypeError) {
            $response['debug_hint'] = 'Ask the bank/Quipu for the correct typeRid configured for this MerchantID.';
        }
        $response['bank_debug'] = $bankDebugContext;
    }

    send_json($response, 502);
}
