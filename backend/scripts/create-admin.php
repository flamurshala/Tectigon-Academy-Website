<?php

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    exit("This script can only be run from the command line.\n");
}

$name = $argv[1] ?? null;
$email = $argv[2] ?? null;
$password = $argv[3] ?? null;
$role = $argv[4] ?? 'admin';

if (!$name || !$email || !$password || !filter_var($email, FILTER_VALIDATE_EMAIL) || !in_array($role, ['admin', 'staff'], true)) {
    exit("Usage: php backend/scripts/create-admin.php \"Name\" email@example.com \"Password\" [admin|staff]\n");
}

$pdo = require __DIR__ . '/../config/connection.php';
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

$statement = $pdo->prepare(
    'INSERT INTO users (name, email, password_hash, role, is_active)
     VALUES (:name, :email, :password_hash, :role, 1)
     ON DUPLICATE KEY UPDATE
       name = VALUES(name),
       password_hash = VALUES(password_hash),
       role = VALUES(role),
       is_active = 1,
       updated_at = CURRENT_TIMESTAMP'
);

$statement->execute([
    'name' => $name,
    'email' => $email,
    'password_hash' => $passwordHash,
    'role' => $role,
]);

echo "Admin user ready: {$email}\n";
