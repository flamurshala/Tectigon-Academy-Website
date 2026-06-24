<?php

declare(strict_types=1);

require __DIR__ . '/../../lib/cors.php';
require __DIR__ . '/../../lib/response.php';
require __DIR__ . '/../../lib/session.php';

apply_cors_headers();
require_method('POST');
start_auth_session();
clear_auth_session();

send_json([
    'success' => true,
]);
