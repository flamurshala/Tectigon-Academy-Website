<?php

declare(strict_types=1);

require __DIR__ . '/../../../lib/cors.php';
require __DIR__ . '/../../../lib/response.php';
require __DIR__ . '/../../../lib/session.php';
require __DIR__ . '/../../../lib/admin.php';
require __DIR__ . '/../../../lib/payment.php';

apply_cors_headers();
require_method('GET');

$id = (int) ($_GET['id'] ?? 0);
if ($id <= 0) {
    send_json(['success' => false, 'error' => 'Valid payment id is required.'], 422);
}

$pdo = require __DIR__ . '/../../../config/connection.php';
require_staff_user($pdo);

$statement = $pdo->prepare(payment_select_sql() . ' WHERE p.id = :id LIMIT 1');
$statement->execute(['id' => $id]);
$payment = $statement->fetch();

if (!$payment) {
    send_json(['success' => false, 'error' => 'Payment not found.'], 404);
}

$logStatement = $pdo->prepare('SELECT * FROM payment_logs WHERE order_id = :order_id ORDER BY created_at DESC');
$logStatement->execute(['order_id' => $payment['order_id']]);

send_json([
    'success' => true,
    'payment' => payment_row_to_response($payment),
    'logs' => array_map(static fn (array $log) => [
        'id' => (int) $log['id'],
        'action' => $log['action'],
        'status_before' => $log['status_before'],
        'status_after' => $log['status_after'],
        'request_payload' => $log['request_payload'],
        'response_payload' => $log['response_payload'],
        'http_status_code' => $log['http_status_code'] === null ? null : (int) $log['http_status_code'],
        'error_message' => $log['error_message'],
        'created_at' => $log['created_at'],
    ], $logStatement->fetchAll()),
]);
