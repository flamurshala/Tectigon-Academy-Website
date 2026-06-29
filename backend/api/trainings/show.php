<?php

declare(strict_types=1);

require __DIR__ . '/../../lib/cors.php';
require __DIR__ . '/../../lib/response.php';
require __DIR__ . '/../../lib/session.php';
require __DIR__ . '/../../lib/admin.php';
require __DIR__ . '/../../lib/training.php';

apply_cors_headers();
require_method('GET');

$id = (int) ($_GET['id'] ?? 0);

if ($id <= 0) {
    send_json(['success' => false, 'error' => 'Valid training id is required.'], 422);
}

$pdo = require __DIR__ . '/../../config/connection.php';
require_staff_user($pdo);

$statement = $pdo->prepare('SELECT * FROM trainings WHERE id = :id LIMIT 1');
$statement->execute(['id' => $id]);
$training = $statement->fetch();

if (!$training) {
    send_json(['success' => false, 'error' => 'Training not found.'], 404);
}

send_json([
    'success' => true,
    'training' => training_to_response($training),
]);
