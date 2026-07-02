<?php

declare(strict_types=1);

require __DIR__ . '/../../lib/cors.php';
require __DIR__ . '/../../lib/response.php';

apply_cors_headers();
require_method('GET');

$config = require __DIR__ . '/../../config/payment-gateway.php';

function debug_cert_file(string $path, bool $includeFirstLine = false): array
{
    $exists = $path !== '' && file_exists($path);
    $readable = $exists && is_readable($path);
    $data = [
        'path' => $path,
        'resolved_path' => $path !== '' ? (realpath($path) ?: null) : null,
        'exists' => $exists,
        'readable' => $readable,
        'size' => $exists ? filesize($path) : null,
    ];

    if ($includeFirstLine && $readable) {
        $handle = @fopen($path, 'rb');
        if (is_resource($handle)) {
            $line = fgets($handle);
            fclose($handle);
            $data['first_line'] = is_string($line) ? trim($line) : null;
        }
    }

    if (!$includeFirstLine && $readable) {
        $handle = @fopen($path, 'rb');
        if (is_resource($handle)) {
            $line = fgets($handle);
            fclose($handle);
            $data['starts_with_begin'] = is_string($line) && str_starts_with(trim($line), '-----BEGIN');
        }
    }

    return $data;
}

send_json([
    'success' => true,
    'warning' => 'Temporary local diagnostics endpoint. Remove or protect before production.',
    'runtime' => [
        'php_sapi' => PHP_SAPI,
        'cwd' => getcwd() ?: null,
        'endpoint_dir' => __DIR__,
        'backend_root' => $config['backend_root'] ?? null,
        'curl_cainfo' => ini_get('curl.cainfo') ?: null,
        'openssl_cafile' => ini_get('openssl.cafile') ?: null,
    ],
    'certificates' => [
        'cert_path' => debug_cert_file((string) ($config['cert_path'] ?? ''), true),
        'key_path' => debug_cert_file((string) ($config['key_path'] ?? ''), false),
        'ca_path' => debug_cert_file((string) ($config['ca_path'] ?? ''), true),
        'server_ca_path' => debug_cert_file((string) ($config['server_ca_path'] ?? ''), true),
        'combined_ca_path' => debug_cert_file((string) ($config['combined_ca_path'] ?? ''), true),
    ],
]);
