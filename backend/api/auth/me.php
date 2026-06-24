<?php

declare(strict_types=1);

require __DIR__ . '/../../lib/cors.php';
require __DIR__ . '/../../lib/response.php';
require __DIR__ . '/../../lib/session.php';

apply_cors_headers();
require_method('GET');
start_auth_session();

$pdo = require __DIR__ . '/../../config/connection.php';
$user = get_authenticated_user($pdo);

if (!$user) {
    send_json([
        'success' => false,
        'error' => 'Unauthenticated.',
    ], 401);
}

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
