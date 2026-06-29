<?php

declare(strict_types=1);

require __DIR__ . '/../../lib/cors.php';
require __DIR__ . '/../../lib/response.php';
require __DIR__ . '/../../lib/session.php';
require __DIR__ . '/../../lib/admin.php';
require __DIR__ . '/../../lib/training.php';

apply_cors_headers();
require_method('POST');

$body = read_json_body();
$id = (int) ($body['id'] ?? 0);

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

$newStatus = (int) $training['is_active'] === 1 ? 0 : 1;
$statement = $pdo->prepare('UPDATE trainings SET is_active = :is_active WHERE id = :id');
$statement->execute(['is_active' => $newStatus, 'id' => $id]);

$statement = $pdo->prepare('SELECT * FROM trainings WHERE id = :id LIMIT 1');
$statement->execute(['id' => $id]);

send_json([
    'success' => true,
    'training' => training_to_response($statement->fetch()),
]);
