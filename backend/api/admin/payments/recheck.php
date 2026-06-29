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

if ($paymentId <= 0) {
    send_json(['success' => false, 'error' => 'Valid payment id is required.'], 422);
}

$pdo = require __DIR__ . '/../../../config/connection.php';
require_staff_user($pdo);

$statement = $pdo->prepare('SELECT order_id, status FROM payments WHERE id = :id LIMIT 1');
$statement->execute(['id' => $paymentId]);
$payment = $statement->fetch();

if (!$payment) {
    send_json(['success' => false, 'error' => 'Payment not found.'], 404);
}

log_payment_action($pdo, 'provider_recheck_requested', (int) $payment['order_id'], $paymentId, $payment['status'], $payment['status'], [
    'provider' => 'local_bank',
    'implemented' => false,
]);

send_json([
    'success' => true,
    'message' => 'Re-check logged. Bank integration can be connected here.',
]);
