<?php

declare(strict_types=1);

require __DIR__ . '/../lib/BankGatewayClient.php';
require __DIR__ . '/../lib/PaymentRepository.php';

$config = require __DIR__ . '/../config/payment-gateway.php';

function print_line(string $message = ''): void
{
    echo $message . PHP_EOL;
}

function cert_status(string $label, string $path): void
{
    print_line("{$label}: " . (is_readable($path) ? 'readable' : 'missing or unreadable') . " ({$path})");
}

function print_json_block(string $label, mixed $value): void
{
    print_line($label . ':');
    $encoded = json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    print_line($encoded !== false ? $encoded : '(unable to encode JSON)');
}

function redirect_is_public_https(string $url): bool
{
    $parts = parse_url($url);
    $host = strtolower((string) ($parts['host'] ?? ''));

    return ($parts['scheme'] ?? '') === 'https'
        && $host !== ''
        && !in_array($host, ['localhost', '127.0.0.1', '::1'], true);
}

$orderNumber = 'TLS-TEST-' . date('YmdHis');
$training = [
    'title' => 'Quipu TLS Connectivity Test',
];
$order = [
    'order_number' => $orderNumber,
    'amount' => 1.00,
];

$_SERVER['REMOTE_ADDR'] = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
$_SERVER['HTTP_USER_AGENT'] = $_SERVER['HTTP_USER_AGENT'] ?? 'PHP CLI Quipu TLS Test';
$_SERVER['HTTP_ACCEPT'] = $_SERVER['HTTP_ACCEPT'] ?? 'application/json';

$payload = PaymentRepository::buildCreateOrderPayload($config, $order, $training);
$client = new BankGatewayClient($config);

print_line('Quipu Create Order TLS test');
print_line('===========================');
cert_status('cert.pem', (string) $config['cert_path']);
cert_status('key.pem', (string) $config['key_path']);
cert_status('ca.pem', (string) $config['ca_path']);
print_line('URL: ' . $config['create_order_url']);
print_line('Amount: 1.00 EUR');
print_line('Configured typeRid: ' . $config['order_type_rid']);
print_line('Configured BANK_HPP_REDIRECT_URL: ' . ($config['hpp_redirect_url'] ?? '(not set)'));
print_line('Payload hppRedirectUrl: ' . $payload['order']['hppRedirectUrl']);
print_line('hppRedirectUrl public HTTPS: ' . (redirect_is_public_https($payload['order']['hppRedirectUrl']) ? 'yes' : 'no'));
if (!redirect_is_public_https($payload['order']['hppRedirectUrl'])) {
    print_line('WARNING: Set BANK_HPP_REDIRECT_URL to a public HTTPS URL for real Quipu testing.');
}
print_json_block('request_json', $payload);
print_line();

try {
    $response = $client->createOrder($payload);
    $bankOrder = PaymentRepository::extractBankOrder($response);
    $redirectUrl = null;

    if ($bankOrder['id'] && $bankOrder['password'] && $bankOrder['hppUrl']) {
        $redirectUrl = $client->buildHppRedirectUrl((string) $bankOrder['hppUrl'], (string) $bankOrder['id'], (string) $bankOrder['password']);
    }

    print_line('success: yes');
    print_line('http_status: ' . (string) ($response['_http_status'] ?? 'unknown'));
    print_line('raw_response_body: ' . (string) ($response['_raw_response'] ?? ''));
    $decodedForPrint = $response;
    unset($decodedForPrint['_raw_response']);
    print_json_block('decoded_response_json', $decodedForPrint);
    print_line('bank_order_id_returned: ' . ($bankOrder['id'] ? 'yes' : 'no'));
    print_line('hpp_redirect_url_returned: ' . ($redirectUrl ? 'yes' : 'no'));
} catch (Throwable $exception) {
    print_line('success: no');
    print_line('error: ' . $exception->getMessage());

    if ($exception instanceof BankGatewayHttpException) {
        $debug = $exception->debugContext();
        $bankErrorCode = $exception->bankErrorCode();
        $bankErrorDescription = $exception->bankErrorDescription();
        if ($bankErrorCode !== null) {
            print_line('Quipu response: ' . $bankErrorCode);
        }
        if ($bankErrorDescription !== null) {
            print_line('Quipu description: ' . $bankErrorDescription);
        }
        if ($bankErrorCode === 'OrderTypeNotFound') {
            print_line('Hint: Ask bank/Quipu for the correct typeRid configured for MerchantID ' . ($config['merchant_id'] ?? 'unknown') . '.');
        }
        print_line('request_url: ' . (string) ($debug['request_url'] ?? ''));
        print_line('http_status: ' . (string) ($debug['http_status'] ?? 'unknown'));
        print_line('raw_response_body: ' . (string) ($debug['raw_response_body'] ?? ''));
        print_json_block('decoded_response_json', $debug['decoded_response_json'] ?? null);
        print_json_block('curl_info', $debug['curl_info'] ?? []);
        print_line('curl_error: ' . (string) ($debug['curl_error'] ?? ''));
    }
}
