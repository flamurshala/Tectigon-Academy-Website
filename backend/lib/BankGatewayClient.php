<?php

declare(strict_types=1);

class BankGatewayHttpException extends RuntimeException
{
    public function __construct(
        string $message,
        private readonly array $debugContext,
        int $code = 0,
        ?Throwable $previous = null
    ) {
        parent::__construct($message, $code, $previous);
    }

    public function debugContext(): array
    {
        return $this->debugContext;
    }

    public function bankErrorCode(): ?string
    {
        $decoded = $this->debugContext['decoded_response_json'] ?? null;

        return is_array($decoded) && isset($decoded['errorCode']) ? (string) $decoded['errorCode'] : null;
    }

    public function bankErrorDescription(): ?string
    {
        $decoded = $this->debugContext['decoded_response_json'] ?? null;

        return is_array($decoded) && isset($decoded['errorDescription']) ? (string) $decoded['errorDescription'] : null;
    }
}

class BankGatewayClient
{
    public function __construct(private readonly array $config)
    {
    }

    public function createOrder(array $payload): array
    {
        return $this->request('POST', $this->config['create_order_url'], $payload, 'create_order');
    }

    public function getOrderDetails(string $bankOrderId, string $password): array
    {
        $baseUrl = rtrim($this->config['create_order_url'], '/');
        $url = $baseUrl . '/' . rawurlencode($bankOrderId)
            . '?password=' . rawurlencode($password)
            . '&tokenDetailLevel=2&tranDetailLevel=1';

        return $this->request('GET', $url, null, 'get_order_details');
    }

    public function buildHppRedirectUrl(string $hppUrl, string $bankOrderId, string $password): string
    {
        $separator = str_contains($hppUrl, '?') ? '&' : '?';
        return $hppUrl . $separator . http_build_query([
            'id' => $bankOrderId,
            'password' => $password,
        ]);
    }

    public function refund(string $bankOrderId, string $password, float $amount): array
    {
        $url = $this->transactionUrl($bankOrderId, $password);

        return $this->request('POST', $url, [
            'tran' => [
                'phase' => 'Single',
                'amount' => number_format($amount, 2, '.', ''),
                'type' => 'Refund',
            ],
        ], 'refund');
    }

    public function reverse(string $bankOrderId, string $password, float $amount): array
    {
        $url = $this->transactionUrl($bankOrderId, $password);

        return $this->request('POST', $url, [
            'tran' => [
                'voidKind' => 'Full',
                'amount' => number_format($amount, 2, '.', ''),
                'phase' => 'Single',
            ],
        ], 'reverse');
    }

    private function transactionUrl(string $bankOrderId, string $password): string
    {
        $baseUrl = rtrim($this->config['create_order_url'], '/');

        return $baseUrl . '/' . rawurlencode($bankOrderId)
            . '/exec-tran?password=' . rawurlencode($password);
    }

    private function request(string $method, string $url, ?array $payload, string $action): array
    {
        $this->writeTechnicalLog('certificate_diagnostics', $this->certificateDiagnostics());

        if (!$this->certificatesReadable() && !empty($this->config['allow_missing_certs'])) {
            return $this->simulatedResponse($action, $payload);
        }

        $this->assertCertificatesReadable();

        $ch = curl_init($url);
        $verboseHandle = $this->openVerboseLogHandle();
        $headers = [
            'Content-Type: application/json',
            'Accept: application/json',
        ];

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 45);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 20);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_SSLCERT, $this->config['cert_path']);
        curl_setopt($ch, CURLOPT_SSLKEY, $this->config['key_path']);
        curl_setopt($ch, CURLOPT_CAINFO, $this->resolveCaInfoPath());
        $this->applySslVerificationOptions($ch);

        if (is_resource($verboseHandle)) {
            curl_setopt($ch, CURLOPT_VERBOSE, true);
            curl_setopt($ch, CURLOPT_STDERR, $verboseHandle);
        }

        $requestJson = null;
        if ($method === 'POST') {
            $requestJson = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $requestJson);
        }

        $rawResponse = curl_exec($ch);
        $curlError = curl_error($ch);
        $curlInfo = curl_getinfo($ch);
        $httpStatus = (int) ($curlInfo['http_code'] ?? curl_getinfo($ch, CURLINFO_RESPONSE_CODE));
        curl_close($ch);

        if (is_resource($verboseHandle)) {
            fclose($verboseHandle);
        }

        $decoded = is_string($rawResponse) ? json_decode($rawResponse, true) : null;
        $debugContext = [
            'request_url' => $this->sanitizeUrl($url),
            'request_json' => $requestJson,
            'http_status' => $httpStatus,
            'raw_response_body' => is_string($rawResponse) ? $rawResponse : null,
            'decoded_response_json' => is_array($decoded) ? $decoded : null,
            'curl_info' => $curlInfo,
            'curl_error' => $curlError ?: null,
        ];

        $this->writeTechnicalLog($action, $debugContext);

        if ($rawResponse === false || $curlError !== '') {
            throw new BankGatewayHttpException($this->formatCurlError($curlError), $debugContext);
        }

        if (!is_array($decoded)) {
            throw new BankGatewayHttpException('Bank gateway returned invalid JSON.', $debugContext);
        }

        $decoded['_http_status'] = $httpStatus;
        $decoded['_raw_response'] = $rawResponse;

        if ($httpStatus >= 400) {
            throw new BankGatewayHttpException("Bank gateway HTTP error: {$httpStatus}", $debugContext, $httpStatus);
        }

        return $decoded;
    }

    private function assertCertificatesReadable(): void
    {
        foreach (['cert_path', 'key_path', 'ca_path'] as $key) {
            $path = $this->config[$key] ?? '';

            if (!is_string($path) || $path === '' || !is_readable($path)) {
                $message = "Bank gateway certificate file is missing or unreadable: {$key}. Check backend/secure/certs.";
                $this->writeTechnicalLog('certificate_check_failed', [
                    'key' => $key,
                    'diagnostics' => $this->certificateDiagnostics(),
                ]);
                throw new RuntimeException($message);
            }
        }
    }

    private function certificatesReadable(): bool
    {
        foreach (['cert_path', 'key_path', 'ca_path'] as $key) {
            $path = $this->config[$key] ?? '';

            if (!is_string($path) || $path === '' || !is_readable($path)) {
                return false;
            }
        }

        return true;
    }

    private function simulatedResponse(string $action, ?array $payload): array
    {
        $status = $action === 'get_order_details' ? 'Pending' : 'Created';
        $hppUrl = $payload['order']['hppRedirectUrl'] ?? (rtrim($this->config['frontend_base_url'], '/') . '/payment/result');
        $response = [
            'order' => [
                'id' => 'SIM-' . strtoupper(bin2hex(random_bytes(4))),
                'password' => bin2hex(random_bytes(8)),
                'hppUrl' => $hppUrl,
                'status' => $status,
            ],
            '_http_status' => 0,
        ];
        $response['_raw_response'] = json_encode([
            'simulated' => true,
            'reason' => 'BANK_ALLOW_MISSING_CERTS enabled and certificate files are missing.',
            'order' => $response['order'],
        ]);

        $this->writeTechnicalLog($action . '_simulated', ['reason' => 'missing certificates']);

        return $response;
    }

    private function applySslVerificationOptions(CurlHandle $ch): void
    {
        $appEnv = strtolower((string) ($this->config['app_env'] ?? 'production'));
        $disableRequested = !empty($this->config['disable_ssl_verify']);
        $localOrTest = in_array($appEnv, ['local', 'test'], true);

        if ($disableRequested && $localOrTest) {
            // Diagnostic escape hatch only. Never use this in production; fix ca.pem instead.
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
            $this->writeTechnicalLog('ssl_verification_disabled_for_diagnostics', [
                'app_env' => $appEnv,
                'warning' => 'BANK_DISABLE_SSL_VERIFY is only for diagnosing CA chain issues.',
            ]);
            return;
        }

        if ($disableRequested) {
            $this->writeTechnicalLog('ssl_disable_request_ignored', [
                'app_env' => $appEnv,
                'reason' => 'SSL verification cannot be disabled outside local/test.',
            ]);
        }

        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
    }

    private function openVerboseLogHandle()
    {
        if (empty($this->config['curl_verbose'])) {
            return null;
        }

        $path = (string) ($this->config['curl_verbose_log_path'] ?? '');
        if ($path === '') {
            return null;
        }

        $directory = dirname($path);
        if (!is_dir($directory)) {
            @mkdir($directory, 0755, true);
        }

        $handle = @fopen($path, 'ab');
        if (!is_resource($handle)) {
            $this->writeTechnicalLog('curl_verbose_log_failed', ['path' => $path]);
            return null;
        }

        fwrite($handle, PHP_EOL . '--- ' . date('c') . ' ---' . PHP_EOL);

        return $handle;
    }

    private function formatCurlError(string $curlError): string
    {
        if (str_contains(strtolower($curlError), 'ssl certificate problem')) {
            return 'TLS verification failed. The Quipu CA certificate chain is not trusted. Check backend/secure/certs/ca.pem. ca.pem may be missing, wrong, unreadable, or missing intermediate/root certificates.';
        }

        return "Bank gateway cURL error: {$curlError}";
    }

    private function sanitizeUrl(string $url): string
    {
        $parts = parse_url($url);
        if (!is_array($parts) || empty($parts['query'])) {
            return $url;
        }

        parse_str($parts['query'], $query);
        foreach (['password', 'token', 'key'] as $secretKey) {
            if (array_key_exists($secretKey, $query)) {
                $query[$secretKey] = '[redacted]';
            }
        }

        $scheme = isset($parts['scheme']) ? $parts['scheme'] . '://' : '';
        $host = $parts['host'] ?? '';
        $port = isset($parts['port']) ? ':' . $parts['port'] : '';
        $path = $parts['path'] ?? '';
        $fragment = isset($parts['fragment']) ? '#' . $parts['fragment'] : '';

        return $scheme . $host . $port . $path . '?' . http_build_query($query) . $fragment;
    }

    private function certificateDiagnostics(): array
    {
        return [
            'runtime' => [
                'php_sapi' => PHP_SAPI,
                'cwd' => getcwd() ?: null,
                'bank_client_dir' => __DIR__,
                'backend_root' => $this->config['backend_root'] ?? null,
            ],
            'cert_path' => $this->fileDiagnostics((string) ($this->config['cert_path'] ?? ''), true),
            'key_path' => $this->fileDiagnostics((string) ($this->config['key_path'] ?? ''), false),
            'ca_path' => $this->fileDiagnostics((string) ($this->config['ca_path'] ?? ''), true),
            'server_ca_path' => $this->fileDiagnostics((string) ($this->config['server_ca_path'] ?? ''), true),
            'combined_ca_path' => $this->fileDiagnostics((string) ($this->config['combined_ca_path'] ?? ''), true),
        ];
    }

    private function resolveCaInfoPath(): string
    {
        $bankCaPath = (string) ($this->config['ca_path'] ?? '');
        $serverCaPath = (string) ($this->config['server_ca_path'] ?? '');
        $combinedCaPath = (string) ($this->config['combined_ca_path'] ?? '');

        if (
            $bankCaPath !== ''
            && $serverCaPath !== ''
            && $combinedCaPath !== ''
            && is_readable($bankCaPath)
            && is_readable($serverCaPath)
            && realpath($bankCaPath) !== realpath($serverCaPath)
        ) {
            $directory = dirname($combinedCaPath);
            if (!is_dir($directory)) {
                @mkdir($directory, 0755, true);
            }

            $bankCa = file_get_contents($bankCaPath);
            $serverCa = file_get_contents($serverCaPath);
            if (is_string($bankCa) && is_string($serverCa)) {
                $contents = trim($bankCa) . PHP_EOL . trim($serverCa) . PHP_EOL;
                if (!is_readable($combinedCaPath) || file_get_contents($combinedCaPath) !== $contents) {
                    @file_put_contents($combinedCaPath, $contents);
                }

                if (is_readable($combinedCaPath)) {
                    $this->writeTechnicalLog('ca_bundle_selected', [
                        'mode' => 'combined',
                        'bank_ca_path' => $bankCaPath,
                        'server_ca_path' => $serverCaPath,
                        'combined_ca_path' => $combinedCaPath,
                    ]);
                    return $combinedCaPath;
                }
            }
        }

        $fallback = is_readable($serverCaPath) ? $serverCaPath : $bankCaPath;
        $this->writeTechnicalLog('ca_bundle_selected', [
            'mode' => $fallback === $serverCaPath ? 'server_ca' : 'bank_ca',
            'ca_info_path' => $fallback,
        ]);

        return $fallback;
    }

    private function fileDiagnostics(string $path, bool $includeFirstLine): array
    {
        $exists = $path !== '' && file_exists($path);
        $readable = $exists && is_readable($path);
        $firstLine = null;
        $startsWithBegin = false;

        if ($readable) {
            $handle = @fopen($path, 'rb');
            if (is_resource($handle)) {
                $line = fgets($handle);
                fclose($handle);
                $firstLine = is_string($line) ? trim($line) : null;
                $startsWithBegin = is_string($firstLine) && str_starts_with($firstLine, '-----BEGIN');
            }
        }

        $diagnostics = [
            'path' => $path,
            'resolved_path' => $path !== '' ? (realpath($path) ?: null) : null,
            'exists' => $exists,
            'readable' => $readable,
            'size' => $exists ? filesize($path) : null,
        ];

        if ($includeFirstLine) {
            $diagnostics['first_line'] = $firstLine;
        } else {
            $diagnostics['starts_with_begin'] = $startsWithBegin;
        }

        return $diagnostics;
    }

    private function writeTechnicalLog(string $action, array $context): void
    {
        $path = $this->config['technical_log_path'];
        $directory = dirname($path);

        if (!is_dir($directory)) {
            @mkdir($directory, 0755, true);
        }

        $line = json_encode([
            'time' => date('c'),
            'action' => $action,
            'context' => $context,
        ]);

        @file_put_contents($path, $line . PHP_EOL, FILE_APPEND);
    }
}
