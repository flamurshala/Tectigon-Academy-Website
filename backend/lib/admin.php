<?php

declare(strict_types=1);

function require_staff_user(PDO $pdo): array
{
    start_auth_session();
    $user = get_authenticated_user($pdo);

    if (!$user) {
        send_json([
            'success' => false,
            'error' => 'Unauthenticated.',
        ], 401);
    }

    return $user;
}
