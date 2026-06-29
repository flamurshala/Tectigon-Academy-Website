<?php

declare(strict_types=1);

require __DIR__ . '/../../lib/cors.php';
require __DIR__ . '/../../lib/response.php';
require __DIR__ . '/../../lib/payment.php';

apply_cors_headers();
require_method('POST');

$body = read_json_body();
$trainingId = (int) ($body['training_id'] ?? 0);
$customerName = trim((string) ($body['customer_name'] ?? ''));
$customerEmail = trim((string) ($body['customer_email'] ?? ''));
$customerPhone = trim((string) ($body['customer_phone'] ?? ''));

if ($trainingId <= 0 || $customerName === '' || !filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
    send_json([
        'success' => false,
        'error' => 'Training, customer name, and valid email are required.',
    ], 422);
}

$pdo = require __DIR__ . '/../../config/connection.php';
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

send_json([
    'success' => true,
    'order' => [
        'id' => $orderId,
        'order_number' => $orderNumber,
        'training_id' => $trainingId,
        'training_title' => $training['title'],
        'amount' => $amount,
        'currency' => 'EUR',
        'status' => 'pending',
    ],
    'payment' => [
        'id' => $paymentId,
        'status' => 'pending',
        'payment_provider' => $provider,
    ],
    'redirect_url' => null,
]);
