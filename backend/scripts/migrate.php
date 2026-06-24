<?php

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    exit("This script can only be run from the command line.\n");
}

$pdo = require __DIR__ . '/../config/connection.php';
$schemaPath = __DIR__ . '/../database/users.sql';
$schema = file_get_contents($schemaPath);

if ($schema === false) {
    exit("Could not read schema file: {$schemaPath}\n");
}

$pdo->exec($schema);

echo "Database schema is up to date.\n";
