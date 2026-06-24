<?php

declare(strict_types=1);

function apply_cors_headers(): void
{
    $config = require __DIR__ . '/../config/app.php';
    $allowedOrigin = $config['allowed_origin'];

    if ($allowedOrigin === '') {
        return;
    }

    $requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if ($requestOrigin === $allowedOrigin) {
        header("Access-Control-Allow-Origin: {$allowedOrigin}");
        header('Access-Control-Allow-Credentials: true');
        header('Vary: Origin');
    }

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
        http_response_code(204);
        exit;
    }
}
