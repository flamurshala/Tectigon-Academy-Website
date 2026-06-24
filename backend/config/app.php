<?php

declare(strict_types=1);

require_once __DIR__ . '/env.php';

load_backend_env();

return [
    'allowed_origin' => getenv('API_ALLOWED_ORIGIN') ?: '',
    'session_name' => getenv('AUTH_SESSION_NAME') ?: 'tectigon_staff_session',
    'session_lifetime' => (int) (getenv('AUTH_SESSION_LIFETIME') ?: 86400),
];
