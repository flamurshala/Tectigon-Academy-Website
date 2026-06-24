<?php

declare(strict_types=1);

require __DIR__ . '/../../lib/cors.php';
require __DIR__ . '/../../lib/response.php';
require __DIR__ . '/../../lib/session.php';

apply_cors_headers();
require_method('POST');
start_auth_session();

$body = read_json_body();
$email = trim((string) ($body['email'] ?? ''));
$password = (string) ($body['password'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '') {
    send_json([
        'success' => false,
        'error' => 'Please enter a valid email and password.',
    ], 422);
}

$pdo = require __DIR__ . '/../../config/connection.php';
$statement = $pdo->prepare(
    'SELECT id, name, email, password_hash, role, is_active, created_at, updated_at
     FROM users
     WHERE email = :email
     LIMIT 1'
);
$statement->execute(['email' => $email]);
$user = $statement->fetch();

if (
    !$user ||
    (int) $user['is_active'] !== 1 ||
    !is_staff_role($user['role']) ||
    !password_verify($password, $user['password_hash'])
) {
    send_json([
        'success' => false,
        'error' => 'Invalid credentials.',
    ], 401);
}

set_authenticated_user($user);

send_json([
    'success' => true,
    'user' => [
        'id' => (int) $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'role' => $user['role'],
        'is_active' => (bool) $user['is_active'],
        'created_at' => $user['created_at'],
        'updated_at' => $user['updated_at'],
    ],
]);
