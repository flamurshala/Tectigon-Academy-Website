<?php

declare(strict_types=1);

function send_json(array $payload, int $statusCode = 200): never
{
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($payload);
    exit;
}

function require_method(string $method): void
{
    if ($_SERVER['REQUEST_METHOD'] !== $method) {
        send_json([
            'success' => false,
            'error' => 'Method not allowed',
        ], 405);
    }
}

function read_json_body(): array
{
    $rawBody = file_get_contents('php://input');
    $data = json_decode($rawBody ?: '', true);

    if (!is_array($data)) {
        send_json([
            'success' => false,
            'error' => 'Invalid JSON request body',
        ], 400);
    }

    return $data;
}
