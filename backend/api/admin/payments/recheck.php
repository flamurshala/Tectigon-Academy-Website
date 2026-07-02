<?php

declare(strict_types=1);

require __DIR__ . '/../../../lib/cors.php';
require __DIR__ . '/../../../lib/response.php';
require __DIR__ . '/../../../lib/session.php';
require __DIR__ . '/../../../lib/admin.php';
require __DIR__ . '/../../../lib/payment.php';
require __DIR__ . '/../../../lib/BankGatewayClient.php';
require __DIR__ . '/../../../lib/PaymentRepository.php';

apply_cors_headers();
require_method('POST');

$body = read_json_body();
$paymentId = (int) ($body['payment_id'] ?? 0);
$orderNumber = trim((string) ($body['order_number'] ?? ''));

if ($paymentId <= 0 && $orderNumber === '') {
    send_json(['success' => false, 'error' => 'Valid payment id or order number is required.'], 422);
}

$pdo = require __DIR__ . '/../../../config/connection.php';
$gatewayConfig = require __DIR__ . '/../../../config/payment-gateway.php';
require_staff_user($pdo);

$statement = $paymentId > 0
    ? $pdo->prepare(payment_select_sql() . ' WHERE p.id = :id LIMIT 1')
    : $pdo->prepare(payment_select_sql() . ' WHERE o.order_number = :id LIMIT 1');
$statement->execute(['id' => $paymentId > 0 ? $paymentId : $orderNumber]);
$payment = $statement->fetch();

if (!$payment) {
    send_json(['success' => false, 'error' => 'Payment not found.'], 404);
}

$client = new BankGatewayClient($gatewayConfig);
$updated = PaymentRepository::syncBankDetails($pdo, $client, $payment, 'recheck');

send_json([
    'success' => true,
    'message' => 'Payment status re-check completed.',
    'payment' => $updated,
]);
