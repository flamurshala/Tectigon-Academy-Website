<?php

declare(strict_types=1);

$config = require __DIR__ . '/../config/payment-gateway.php';

function print_line(string $message = ''): void
{
    echo $message . PHP_EOL;
}

function file_status(string $label, string $path): void
{
    print_line("{$label}: {$path}");
    print_line('  exists: ' . (file_exists($path) ? 'yes' : 'no'));
    print_line('  readable: ' . (is_readable($path) ? 'yes' : 'no'));
    print_line('  size: ' . (file_exists($path) ? (string) filesize($path) . ' bytes' : 'n/a'));
}

function pem_cert_blocks(string $path): array
{
    if (!is_readable($path)) {
        return [];
    }

    $contents = file_get_contents($path);
    if (!is_string($contents)) {
        return [];
    }

    preg_match_all('/-----BEGIN CERTIFICATE-----.*?-----END CERTIFICATE-----/s', $contents, $matches);

    return $matches[0] ?? [];
}

function format_name(array $name): string
{
    $parts = [];
    foreach ($name as $key => $value) {
        if (is_array($value)) {
            $value = implode(', ', $value);
        }
        $parts[] = "{$key}={$value}";
    }

    return implode(', ', $parts);
}

function print_certificate_details(string $label, string $path): void
{
    $blocks = pem_cert_blocks($path);
    print_line();
    print_line("{$label} certificate blocks: " . count($blocks));

    if ($blocks === []) {
        print_line("  {$label} is not a readable PEM certificate or bundle.");
        return;
    }

    foreach ($blocks as $index => $block) {
        $certificate = openssl_x509_read($block);
        $parsed = $certificate ? openssl_x509_parse($certificate) : false;
        $number = $index + 1;

        if (!is_array($parsed)) {
            print_line("  #{$number}: failed to parse certificate.");
            continue;
        }

        print_line("  #{$number} subject: " . format_name($parsed['subject'] ?? []));
        print_line("  #{$number} issuer: " . format_name($parsed['issuer'] ?? []));
        print_line("  #{$number} valid from: " . ($parsed['validFrom_time_t'] ? date('c', $parsed['validFrom_time_t']) : 'unknown'));
        print_line("  #{$number} valid to: " . ($parsed['validTo_time_t'] ? date('c', $parsed['validTo_time_t']) : 'unknown'));
    }
}

$certPath = (string) ($config['cert_path'] ?? '');
$keyPath = (string) ($config['key_path'] ?? '');
$caPath = (string) ($config['ca_path'] ?? '');
$serverCaPath = (string) ($config['server_ca_path'] ?? '');
$combinedCaPath = (string) ($config['combined_ca_path'] ?? '');

print_line('Quipu certificate diagnostics');
print_line('============================');
file_status('cert.pem', $certPath);
file_status('key.pem', $keyPath);
file_status('ca.pem', $caPath);
file_status('server CA bundle', $serverCaPath);
file_status('generated combined CA bundle', $combinedCaPath);

print_certificate_details('cert.pem', $certPath);
print_certificate_details('ca.pem', $caPath);

print_line();
print_line('Private key check');
$keyContents = is_readable($keyPath) ? file_get_contents($keyPath) : false;
$privateKey = is_string($keyContents) ? openssl_pkey_get_private($keyContents) : false;
print_line('  key.pem is private key: ' . ($privateKey ? 'yes' : 'no'));

$certBlocks = pem_cert_blocks($certPath);
$certificate = $certBlocks !== [] ? openssl_x509_read($certBlocks[0]) : false;
if ($certificate && $privateKey) {
    print_line('  cert.pem matches key.pem: ' . (openssl_x509_check_private_key($certificate, $privateKey) ? 'yes' : 'no'));
} else {
    print_line('  cert.pem matches key.pem: unable to check');
}

print_line();
print_line('Manual OpenSSL fallback commands are documented in backend/README.md.');
