<?php

declare(strict_types=1);

const TRAINING_IMAGE_MAX_BYTES = 2097152;
const TRAINING_ALLOWED_IMAGE_TYPES = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
];

function training_to_response(array $training): array
{
    return [
        'id' => (int) $training['id'],
        'title' => $training['title'],
        'slug' => $training['slug'],
        'short_description' => $training['short_description'],
        'full_description' => $training['full_description'],
        'level_label' => $training['level_label'],
        'training_hours' => $training['training_hours'] === null ? null : (int) $training['training_hours'],
        'students_count' => (int) $training['students_count'],
        'rating' => (float) $training['rating'],
        'price' => (float) $training['price'],
        'old_price' => $training['old_price'] === null ? null : (float) $training['old_price'],
        'currency' => 'EUR',
        'discount_text' => format_training_discount((float) $training['price'], $training['old_price'] === null ? null : (float) $training['old_price']),
        'image_url' => $training['image_url'],
        'button_text' => $training['button_text'],
        'is_active' => (bool) $training['is_active'],
        'sort_order' => (int) $training['sort_order'],
        'created_at' => $training['created_at'],
        'updated_at' => $training['updated_at'],
    ];
}

function validate_training_payload(array $input, bool $isUpdate = false): array
{
    $title = trim((string) ($input['title'] ?? ''));
    $shortDescription = trim((string) ($input['short_description'] ?? ''));
    $price = trim((string) ($input['price'] ?? ''));

    $errors = [];

    if ($title === '') {
        $errors['title'] = 'Title is required.';
    }

    if ($shortDescription === '') {
        $errors['short_description'] = 'Short description is required.';
    }

    if ($price === '' || !is_numeric($price) || (float) $price < 0) {
        $errors['price'] = 'Price must be a valid number.';
    }

    $trainingHours = nullable_int($input['training_hours'] ?? null);
    $studentsCount = int_value($input['students_count'] ?? 0);
    $rating = decimal_value($input['rating'] ?? 0);
    $oldPrice = nullable_decimal($input['old_price'] ?? null);
    $sortOrder = int_value($input['sort_order'] ?? 0);

    if ($trainingHours !== null && $trainingHours < 0) {
        $errors['training_hours'] = 'Training hours must be positive.';
    }

    if ($studentsCount < 0) {
        $errors['students_count'] = 'Students count must be positive.';
    }

    if ($rating < 0 || $rating > 5) {
        $errors['rating'] = 'Rating must be between 0 and 5.';
    }

    if ($oldPrice !== null && $oldPrice < 0) {
        $errors['old_price'] = 'Old price must be positive.';
    }

    if ($errors !== []) {
        send_json([
            'success' => false,
            'error' => 'Please fix the highlighted fields.',
            'errors' => $errors,
        ], 422);
    }

    return [
        'title' => $title,
        'short_description' => $shortDescription,
        'full_description' => nullable_string($input['full_description'] ?? null),
        'level_label' => nullable_string($input['level_label'] ?? null),
        'training_hours' => $trainingHours,
        'students_count' => $studentsCount,
        'rating' => $rating,
        'price' => (float) $price,
        'old_price' => $oldPrice,
        'button_text' => trim((string) ($input['button_text'] ?? 'Më shumë')) ?: 'Më shumë',
        'is_active' => truthy($input['is_active'] ?? true) ? 1 : 0,
        'sort_order' => $sortOrder,
    ];
}

function handle_training_image_upload(?string $currentImageUrl = null): ?string
{
    if (!isset($_FILES['image']) || $_FILES['image']['error'] === UPLOAD_ERR_NO_FILE) {
        return $currentImageUrl;
    }

    $file = $_FILES['image'];

    if ($file['error'] !== UPLOAD_ERR_OK) {
        send_json(['success' => false, 'error' => 'Image upload failed.'], 422);
    }

    if ($file['size'] > TRAINING_IMAGE_MAX_BYTES) {
        send_json(['success' => false, 'error' => 'Image must be 2 MB or smaller.'], 422);
    }

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $finfo->file($file['tmp_name']);

    if (!isset(TRAINING_ALLOWED_IMAGE_TYPES[$mimeType])) {
        send_json(['success' => false, 'error' => 'Only JPG, PNG, and WEBP images are allowed.'], 422);
    }

    $uploadDirectory = dirname(__DIR__) . '/uploads/trainings';

    if (!is_dir($uploadDirectory) && !mkdir($uploadDirectory, 0755, true)) {
        send_json(['success' => false, 'error' => 'Could not create upload directory.'], 500);
    }

    $extension = TRAINING_ALLOWED_IMAGE_TYPES[$mimeType];
    $filename = bin2hex(random_bytes(16)) . '.' . $extension;
    $targetPath = "{$uploadDirectory}/{$filename}";

    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        send_json(['success' => false, 'error' => 'Could not save uploaded image.'], 500);
    }

    if ($currentImageUrl && str_starts_with($currentImageUrl, '/uploads/trainings/')) {
        $oldPath = dirname(__DIR__) . $currentImageUrl;

        if (is_file($oldPath)) {
            @unlink($oldPath);
        }
    }

    return "/uploads/trainings/{$filename}";
}

function generate_unique_training_slug(PDO $pdo, string $title, ?int $ignoreId = null): string
{
    $baseSlug = slugify($title);

    if ($baseSlug === '') {
        $baseSlug = 'training';
    }

    $slug = $baseSlug;
    $suffix = 2;

    while (training_slug_exists($pdo, $slug, $ignoreId)) {
        $slug = "{$baseSlug}-{$suffix}";
        $suffix++;
    }

    return $slug;
}

function training_slug_exists(PDO $pdo, string $slug, ?int $ignoreId = null): bool
{
    if ($ignoreId !== null) {
        $statement = $pdo->prepare('SELECT id FROM trainings WHERE slug = :slug AND id <> :id LIMIT 1');
        $statement->execute(['slug' => $slug, 'id' => $ignoreId]);
    } else {
        $statement = $pdo->prepare('SELECT id FROM trainings WHERE slug = :slug LIMIT 1');
        $statement->execute(['slug' => $slug]);
    }

    return (bool) $statement->fetch();
}

function slugify(string $value): string
{
    $value = strtr($value, [
        'ë' => 'e',
        'Ë' => 'e',
        'ç' => 'c',
        'Ç' => 'c',
    ]);
    $value = strtolower(trim($value));
    $value = preg_replace('/[^a-z0-9]+/', '-', $value) ?? '';
    return trim($value, '-');
}

function format_training_discount(float $price, ?float $oldPrice): ?string
{
    if ($oldPrice === null || $oldPrice <= $price || $oldPrice <= 0) {
        return null;
    }

    $discount = (($oldPrice - $price) / $oldPrice) * 100;

    if ($discount < 10) {
        $formatted = rtrim(rtrim(number_format($discount, 1, '.', ''), '0'), '.');
    } else {
        $rounded = round($discount);
        $formatted = (string) $rounded;
    }

    return "Kurseni {$formatted}%";
}

function nullable_string(mixed $value): ?string
{
    $value = trim((string) ($value ?? ''));
    return $value === '' ? null : $value;
}

function nullable_int(mixed $value): ?int
{
    $value = trim((string) ($value ?? ''));
    return $value === '' ? null : (int) $value;
}

function nullable_decimal(mixed $value): ?float
{
    $value = trim((string) ($value ?? ''));
    return $value === '' ? null : (float) $value;
}

function int_value(mixed $value): int
{
    $value = trim((string) ($value ?? '0'));
    return $value === '' ? 0 : (int) $value;
}

function decimal_value(mixed $value): float
{
    $value = trim((string) ($value ?? '0'));
    return $value === '' ? 0.0 : (float) $value;
}

function truthy(mixed $value): bool
{
    if (is_bool($value)) {
        return $value;
    }

    return in_array((string) $value, ['1', 'true', 'on', 'yes'], true);
}
