<?php

declare(strict_types=1);

require __DIR__ . '/../../lib/cors.php';
require __DIR__ . '/../../lib/response.php';
require __DIR__ . '/../../lib/session.php';
require __DIR__ . '/../../lib/admin.php';
require __DIR__ . '/../../lib/training.php';

apply_cors_headers();
require_method('GET');

$pdo = require __DIR__ . '/../../config/connection.php';
require_staff_user($pdo);

$statement = $pdo->query(
    'SELECT *
     FROM trainings
     ORDER BY sort_order ASC, created_at DESC'
);

send_json([
    'success' => true,
    'trainings' => array_map('training_to_response', $statement->fetchAll()),
]);
