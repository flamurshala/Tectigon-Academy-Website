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
$page = max(1, (int) ($_GET['page'] ?? 1));
$perPage = min(100, max(10, (int) ($_GET['per_page'] ?? 20)));
$offset = ($page - 1) * $perPage;

$countStatement = $pdo->prepare('SELECT COUNT(*) FROM orders o INNER JOIN payments p ON p.order_id = o.id INNER JOIN trainings t ON t.id = o.training_id ' . $filters['where']);
$countStatement->execute($filters['params']);
$total = (int) $countStatement->fetchColumn();

$statement = $pdo->prepare(payment_select_sql() . ' ' . $filters['where'] . ' ORDER BY o.created_at DESC LIMIT :limit OFFSET :offset');
foreach ($filters['params'] as $key => $value) {
    $statement->bindValue(":{$key}", $value);
}
$statement->bindValue(':limit', $perPage, PDO::PARAM_INT);
$statement->bindValue(':offset', $offset, PDO::PARAM_INT);
$statement->execute();

$summaryStatement = $pdo->prepare(
    'SELECT
      COALESCE(SUM(CASE WHEN o.status = "completed" THEN o.amount ELSE 0 END), 0) AS total_revenue,
      SUM(CASE WHEN o.status = "completed" THEN 1 ELSE 0 END) AS completed,
      SUM(CASE WHEN o.status = "pending" THEN 1 ELSE 0 END) AS pending,
      SUM(CASE WHEN o.status = "failed" THEN 1 ELSE 0 END) AS failed,
      SUM(CASE WHEN o.status = "canceled" THEN 1 ELSE 0 END) AS canceled
     FROM orders o
     INNER JOIN payments p ON p.order_id = o.id
     INNER JOIN trainings t ON t.id = o.training_id ' . $filters['where']
);
$summaryStatement->execute($filters['params']);
$summary = $summaryStatement->fetch();

send_json([
    'success' => true,
    'payments' => array_map('payment_row_to_response', $statement->fetchAll()),
    'pagination' => [
        'page' => $page,
        'per_page' => $perPage,
        'total' => $total,
    ],
    'summary' => [
        'total_revenue' => (float) $summary['total_revenue'],
        'completed' => (int) $summary['completed'],
        'pending' => (int) $summary['pending'],
        'failed' => (int) $summary['failed'],
        'canceled' => (int) $summary['canceled'],
    ],
]);
