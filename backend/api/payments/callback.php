<?php

declare(strict_types=1);

require __DIR__ . '/../../lib/payment.php';
require __DIR__ . '/../../lib/BankGatewayClient.php';
require __DIR__ . '/../../lib/PaymentRepository.php';

$pdo = require __DIR__ . '/../../config/connection.php';
$gatewayConfig = require __DIR__ . '/../../config/payment-gateway.php';

$orderNumber = trim((string) ($_GET['order_number'] ?? $_GET['order'] ?? ''));
$bankOrderId = trim((string) ($_GET['id'] ?? $_GET['order_id'] ?? ''));
$frontendBaseUrl = rtrim($gatewayConfig['frontend_base_url'], '/');

$where = '';
$value = '';

if ($orderNumber !== '') {
    $where = 'o.order_number = :value';
    $value = $orderNumber;
} elseif ($bankOrderId !== '') {
    $where = 'o.bank_order_id = :value';
    $value = $bankOrderId;
}

if ($where === '') {
    header('Location: ' . $frontendBaseUrl . '/payment/failed');
    exit;
}

$statement = $pdo->prepare(payment_select_sql() . " WHERE {$where} LIMIT 1");
$statement->execute(['value' => $value]);
$payment = $statement->fetch();

if (!$payment) {
    header('Location: ' . $frontendBaseUrl . '/payment/failed');
    exit;
}

$client = new BankGatewayClient($gatewayConfig);
$updated = PaymentRepository::syncBankDetails($pdo, $client, $payment, 'callback');
$status = $updated['status'];

$target = match ($status) {
    'completed' => '/payment/success',
    'canceled' => '/payment/canceled',
    'failed' => '/payment/failed',
    default => '/payment/result',
};

header('Location: ' . $frontendBaseUrl . $target . '?order_number=' . rawurlencode($updated['order_number']));
exit;
