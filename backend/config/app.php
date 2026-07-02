<?php

declare(strict_types=1);

require_once __DIR__ . '/env.php';

load_backend_env();

$allowedOrigin = getenv('API_ALLOWED_ORIGIN') ?: (getenv('FRONTEND_URL') ?: '');
$localOrigins = ['http://localhost:3000', 'http://localhost:3001'];
$allowedOrigins = array_filter(array_map('trim', explode(',', $allowedOrigin)));

foreach ($localOrigins as $localOrigin) {
    if (!in_array($localOrigin, $allowedOrigins, true)) {
        $allowedOrigins[] = $localOrigin;
    }
}

return [
    'allowed_origin' => implode(',', $allowedOrigins),
    'session_name' => getenv('AUTH_SESSION_NAME') ?: 'tectigon_staff_session',
    'session_lifetime' => (int) (getenv('AUTH_SESSION_LIFETIME') ?: 86400),
];
