<?php

declare(strict_types=1);

require __DIR__ . '/../../lib/cors.php';
require __DIR__ . '/../../lib/response.php';
require __DIR__ . '/../../lib/session.php';
require __DIR__ . '/../../lib/admin.php';

apply_cors_headers();
require_method('POST');

$body = read_json_body();
$id = (int) ($body['id'] ?? 0);

if ($id <= 0) {
    send_json(['success' => false, 'error' => 'Valid training id is required.'], 422);
}

$pdo = require __DIR__ . '/../../config/connection.php';
require_staff_user($pdo);

$statement = $pdo->prepare('SELECT image_url FROM trainings WHERE id = :id LIMIT 1');
$statement->execute(['id' => $id]);
$training = $statement->fetch();

if (!$training) {
    send_json(['success' => false, 'error' => 'Training not found.'], 404);
}

$statement = $pdo->prepare('DELETE FROM trainings WHERE id = :id');
$statement->execute(['id' => $id]);

if ($training['image_url'] && str_starts_with($training['image_url'], '/uploads/trainings/')) {
    $imagePath = dirname(__DIR__, 2) . $training['image_url'];

    if (is_file($imagePath)) {
        @unlink($imagePath);
    }
}

send_json(['success' => true]);
