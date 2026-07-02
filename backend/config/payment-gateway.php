<?php

declare(strict_types=1);

require_once __DIR__ . '/env.php';

load_backend_env();

$backendRoot = dirname(__DIR__);
$defaultHppRedirectUrl = (getenv('FRONTEND_BASE_URL') ?: 'https://tectigonacademy.com') . '/payment/result';

if (!function_exists('payment_gateway_path')) {
    function payment_gateway_path(string $path): string
    {
        $resolved = realpath($path);

        return $resolved !== false ? $resolved : $path;
    }
}

return [
    'app_env' => getenv('APP_ENV') ?: 'local',
    'environment' => getenv('BANK_ENVIRONMENT') ?: 'test',
    'merchant_id' => getenv('BANK_MERCHANT_ID') ?: 'ECOM_TEST313',
    'order_type_rid' => getenv('BANK_ORDER_TYPE_RID') ?: '1',
    'create_order_url' => getenv('BANK_CREATE_ORDER_URL') ?: 'https://3dss2test.quipu.de:8000/order',
    'portal_url' => getenv('BANK_PORTAL_URL') ?: 'https://3dss2test.quipu.de:8004/',
    'backend_root' => payment_gateway_path($backendRoot),
    'cert_path' => payment_gateway_path(getenv('BANK_CERT_PATH') ?: $backendRoot . '/secure/certs/cert.pem'),
    'key_path' => payment_gateway_path(getenv('BANK_KEY_PATH') ?: $backendRoot . '/secure/certs/key.pem'),
    'ca_path' => payment_gateway_path(getenv('BANK_CA_PATH') ?: $backendRoot . '/secure/certs/ca.pem'),
    'server_ca_path' => payment_gateway_path(getenv('BANK_SERVER_CA_PATH') ?: (ini_get('curl.cainfo') ?: (ini_get('openssl.cafile') ?: $backendRoot . '/secure/certs/ca.pem'))),
    'combined_ca_path' => payment_gateway_path(getenv('BANK_COMBINED_CA_PATH') ?: $backendRoot . '/storage/cache/bank-ca-bundle.pem'),
    'currency' => 'EUR',
    'language' => getenv('BANK_LANGUAGE') ?: 'en',
    'payment_provider' => 'local_bank',
    'allow_missing_certs' => (getenv('BANK_ALLOW_MISSING_CERTS') ?: '0') === '1',
    'disable_ssl_verify' => (getenv('BANK_DISABLE_SSL_VERIFY') ?: '0') === '1',
    'curl_verbose' => (getenv('BANK_CURL_VERBOSE') ?: '0') === '1',
    'frontend_base_url' => getenv('FRONTEND_BASE_URL') ?: 'http://localhost:3000',
    'hpp_redirect_url' => getenv('BANK_HPP_REDIRECT_URL') ?: $defaultHppRedirectUrl,
    'technical_log_path' => payment_gateway_path(getenv('BANK_LOG_PATH') ?: $backendRoot . '/api/storage/logs/payment-gateway.log'),
    'curl_verbose_log_path' => payment_gateway_path(getenv('BANK_CURL_VERBOSE_LOG_PATH') ?: $backendRoot . '/storage/logs/curl-verbose.log'),
    // TODO: Add bank-requested desktop/mobile business logos at 134x26 px if required by the portal/API.
];
