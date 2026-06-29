<?php

declare(strict_types=1);

require __DIR__ . '/../../../lib/cors.php';
require __DIR__ . '/../../../lib/response.php';
require __DIR__ . '/../../../lib/session.php';
require __DIR__ . '/../../../lib/admin.php';
require __DIR__ . '/../../../lib/payment.php';

apply_cors_headers();
require_method('GET');

$pdo = require __DIR__ . '/../../../config/connection.php';
require_staff_user($pdo);

$filters = build_payment_filters($_GET);
$statement = $pdo->prepare(payment_select_sql() . ' ' . $filters['where'] . ' ORDER BY o.created_at DESC');
$statement->execute($filters['params']);

header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="payments-export.csv"');

$output = fopen('php://output', 'w');
fputcsv($output, ['Order number', 'Training', 'Customer name', 'Customer email', 'Amount', 'Currency', 'Status', 'Provider', 'Created at', 'Paid at']);

foreach ($statement->fetchAll() as $row) {
    fputcsv($output, [
        $row['order_number'],
        $row['training_title'],
        $row['customer_name'],
        $row['customer_email'],
        $row['amount'],
        'EUR',
        $row['status'],
        $row['payment_provider'],
        $row['created_at'],
        $row['paid_at'],
    ]);
}

fclose($output);
exit;
