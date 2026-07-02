<?php

declare(strict_types=1);

function apply_cors_headers(): void
{
    $config = require __DIR__ . '/../config/app.php';
    $allowedOrigins = array_filter(array_map('trim', explode(',', (string) $config['allowed_origin'])));

    $requestOrigin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
    $originAllowed = $requestOrigin !== '' && in_array($requestOrigin, $allowedOrigins, true);

    if ($originAllowed) {
        header("Access-Control-Allow-Origin: {$requestOrigin}");
        header('Access-Control-Allow-Credentials: true');
        header('Vary: Origin');
    }

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        http_response_code(204);
        exit;
    }
}
