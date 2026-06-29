<?php

declare(strict_types=1);

require __DIR__ . '/../../lib/cors.php';
require __DIR__ . '/../../lib/response.php';
require __DIR__ . '/../../lib/session.php';
require __DIR__ . '/../../lib/admin.php';
require __DIR__ . '/../../lib/training.php';

apply_cors_headers();
require_method('POST');

$pdo = require __DIR__ . '/../../config/connection.php';
require_staff_user($pdo);

$data = validate_training_payload($_POST);
$data['slug'] = generate_unique_training_slug($pdo, $data['title']);
$data['image_url'] = handle_training_image_upload();

try {
    $statement = $pdo->prepare(
        'INSERT INTO trainings (
            title, slug, short_description, full_description, level_label,
            training_hours, students_count, rating, price, old_price, currency,
            image_url, button_text, is_active, sort_order
        ) VALUES (
            :title, :slug, :short_description, :full_description, :level_label,
            :training_hours, :students_count, :rating, :price, :old_price, "EUR",
            :image_url, :button_text, :is_active, :sort_order
        )'
    );
    $statement->execute($data);
} catch (PDOException $exception) {
    if ($exception->getCode() === '23000') {
        send_json(['success' => false, 'error' => 'A training with this title already exists.'], 409);
    }

    send_json(['success' => false, 'error' => 'Could not create training.'], 500);
}

$id = (int) $pdo->lastInsertId();
$statement = $pdo->prepare('SELECT * FROM trainings WHERE id = :id LIMIT 1');
$statement->execute(['id' => $id]);

send_json([
    'success' => true,
    'training' => training_to_response($statement->fetch()),
], 201);
