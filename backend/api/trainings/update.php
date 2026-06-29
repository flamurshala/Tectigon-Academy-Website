<?php

declare(strict_types=1);

require __DIR__ . '/../../lib/cors.php';
require __DIR__ . '/../../lib/response.php';
require __DIR__ . '/../../lib/session.php';
require __DIR__ . '/../../lib/admin.php';
require __DIR__ . '/../../lib/training.php';

apply_cors_headers();
require_method('POST');

$id = (int) ($_POST['id'] ?? 0);

if ($id <= 0) {
    send_json(['success' => false, 'error' => 'Valid training id is required.'], 422);
}

$pdo = require __DIR__ . '/../../config/connection.php';
require_staff_user($pdo);

$statement = $pdo->prepare('SELECT * FROM trainings WHERE id = :id LIMIT 1');
$statement->execute(['id' => $id]);
$existing = $statement->fetch();

if (!$existing) {
    send_json(['success' => false, 'error' => 'Training not found.'], 404);
}

$data = validate_training_payload($_POST, true);
$data['id'] = $id;
$data['slug'] = generate_unique_training_slug($pdo, $data['title'], $id);
$data['image_url'] = handle_training_image_upload($existing['image_url']);

try {
    $statement = $pdo->prepare(
        'UPDATE trainings
         SET title = :title,
             slug = :slug,
             short_description = :short_description,
             full_description = :full_description,
             category_label = NULL,
             level_label = :level_label,
             badge_text = NULL,
             training_hours = :training_hours,
             students_count = :students_count,
             rating = :rating,
             price = :price,
             old_price = :old_price,
             currency = "EUR",
             image_url = :image_url,
             button_text = :button_text,
             is_active = :is_active,
             sort_order = :sort_order
         WHERE id = :id'
    );
    $statement->execute($data);
} catch (PDOException $exception) {
    if ($exception->getCode() === '23000') {
        send_json(['success' => false, 'error' => 'A training with this title already exists.'], 409);
    }

    send_json(['success' => false, 'error' => 'Could not update training.'], 500);
}

$statement = $pdo->prepare('SELECT * FROM trainings WHERE id = :id LIMIT 1');
$statement->execute(['id' => $id]);

send_json([
    'success' => true,
    'training' => training_to_response($statement->fetch()),
]);
