<?php

declare(strict_types=1);

require __DIR__ . '/../../../lib/cors.php';
require __DIR__ . '/../../../lib/response.php';
require __DIR__ . '/../../../lib/session.php';
require __DIR__ . '/../../../lib/admin.php';
require __DIR__ . '/../../../lib/payment.php';

apply_cors_headers();
require_method('POST');

$body = read_json_body();
$paymentId = (int) ($body['payment_id'] ?? 0);
$status = trim((string) ($body['status'] ?? ''));
$note = trim((string) ($body['note'] ?? ''));

if ($paymentId <= 0 || !is_valid_payment_status($status)) {
    send_json(['success' => false, 'error' => 'Valid payment and status are required.'], 422);
}

if ($status === 'failed' && $note === '') {
    send_json(['success' => false, 'error' => 'A note is required when marking a payment as failed.'], 422);
}

$pdo = require __DIR__ . '/../../../config/connection.php';
require_staff_user($pdo);

$statement = $pdo->prepare('SELECT order_id FROM payments WHERE id = :id LIMIT 1');
$statement->execute(['id' => $paymentId]);
$orderId = (int) $statement->fetchColumn();

if ($orderId <= 0) {
    send_json(['success' => false, 'error' => 'Payment not found.'], 404);
}

$payment = update_order_payment_status($pdo, $orderId, $status, $note === '' ? null : $note);

send_json([
    'success' => true,
    'payment' => $payment,
]);
