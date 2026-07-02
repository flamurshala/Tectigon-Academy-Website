<?php

declare(strict_types=1);

require __DIR__ . '/../../lib/cors.php';
require __DIR__ . '/../../lib/response.php';
require __DIR__ . '/../../lib/payment.php';
require __DIR__ . '/../../lib/BankGatewayClient.php';
require __DIR__ . '/../../lib/PaymentRepository.php';

apply_cors_headers();
require_method('POST');

$body = read_json_body();
$orderId = (int) ($body['order_id'] ?? 0);
$orderNumber = trim((string) ($body['order_number'] ?? ''));

if ($orderId <= 0 && $orderNumber === '') {
    send_json(['success' => false, 'error' => 'Order id or order number is required.'], 422);
}

$pdo = require __DIR__ . '/../../config/connection.php';
$gatewayConfig = require __DIR__ . '/../../config/payment-gateway.php';
$sql = payment_select_sql() . ($orderId > 0 ? ' WHERE o.id = :value LIMIT 1' : ' WHERE o.order_number = :value LIMIT 1');
$statement = $pdo->prepare($sql);
$statement->execute(['value' => $orderId > 0 ? $orderId : $orderNumber]);
$payment = $statement->fetch();

if (!$payment) {
    send_json(['success' => false, 'error' => 'Order not found.'], 404);
}

$client = new BankGatewayClient($gatewayConfig);
$paymentResponse = PaymentRepository::syncBankDetails($pdo, $client, $payment, 'get_order_details');

send_json([
    'success' => true,
    'message' => !empty($paymentResponse['bank_status']) && !PaymentRepository::isKnownBankStatus($paymentResponse['bank_status'])
        ? 'Payment is being verified.'
        : null,
    'payment' => $paymentResponse,
]);
