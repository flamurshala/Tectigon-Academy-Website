<?php

declare(strict_types=1);

function load_backend_env(): void
{
    static $loaded = false;

    if ($loaded) {
        return;
    }

    $loaded = true;
    $envPaths = [
        dirname(__DIR__) . '/.env',
        dirname(__DIR__) . '/.env.local',
        dirname(__DIR__, 2) . '/.env',
        dirname(__DIR__, 2) . '/.env.local',
    ];

    foreach ($envPaths as $envPath) {
        if (!is_readable($envPath)) {
            continue;
        }

        $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        if ($lines === false) {
            continue;
        }

        foreach ($lines as $line) {
            $line = trim($line);

            if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
                continue;
            }

            [$key, $value] = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            $value = trim($value, "\"'");

            if ($key === '' || getenv($key) !== false) {
                continue;
            }

            putenv("{$key}={$value}");
            $_ENV[$key] = $value;
            $_SERVER[$key] = $value;
        }
    }
}
