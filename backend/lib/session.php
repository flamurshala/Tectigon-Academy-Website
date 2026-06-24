<?php

declare(strict_types=1);

function start_auth_session(): void
{
    $config = require __DIR__ . '/../config/app.php';
    $isSecure = is_request_secure();

    session_name($config['session_name']);
    session_set_cookie_params([
        'lifetime' => $config['session_lifetime'],
        'path' => '/',
        'secure' => $isSecure,
        'httponly' => true,
        'samesite' => $isSecure ? 'None' : 'Lax',
    ]);

    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
}

function is_request_secure(): bool
{
    if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
        return true;
    }

    return ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';
}

function set_authenticated_user(array $user): void
{
    session_regenerate_id(true);
    $_SESSION['user_id'] = (int) $user['id'];
    $_SESSION['user_role'] = $user['role'];
}

function clear_auth_session(): void
{
    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', [
            'expires' => time() - 42000,
            'path' => $params['path'],
            'domain' => $params['domain'],
            'secure' => $params['secure'],
            'httponly' => $params['httponly'],
            'samesite' => $params['samesite'] ?? 'Lax',
        ]);
    }

    session_destroy();
}

function get_authenticated_user(PDO $pdo): ?array
{
    $userId = $_SESSION['user_id'] ?? null;

    if (!$userId) {
        return null;
    }

    $statement = $pdo->prepare(
        'SELECT id, name, email, role, is_active, created_at, updated_at
         FROM users
         WHERE id = :id
         LIMIT 1'
    );
    $statement->execute(['id' => $userId]);
    $user = $statement->fetch();

    if (!$user || (int) $user['is_active'] !== 1 || !is_staff_role($user['role'])) {
        return null;
    }

    return $user;
}

function is_staff_role(string $role): bool
{
    return in_array($role, ['admin', 'staff'], true);
}
