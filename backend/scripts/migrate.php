<?php

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    exit("This script can only be run from the command line.\n");
}

$pdo = require __DIR__ . '/../config/connection.php';
foreach (['users.sql', 'trainings.sql', 'payments.sql'] as $schemaFile) {
    $schemaPath = __DIR__ . "/../database/{$schemaFile}";
    $schema = file_get_contents($schemaPath);

    if ($schema === false) {
        exit("Could not read schema file: {$schemaPath}\n");
    }

    $pdo->exec($schema);
}

addColumnIfMissing($pdo, 'orders', 'bank_status', 'VARCHAR(100) NULL AFTER bank_hpp_url');
addColumnIfMissing($pdo, 'orders', 'hpp_redirect_url', 'TEXT NULL AFTER bank_status');
addColumnIfMissing($pdo, 'orders', 'raw_create_order_response', 'LONGTEXT NULL AFTER hpp_redirect_url');
addColumnIfMissing($pdo, 'orders', 'raw_get_order_response', 'LONGTEXT NULL AFTER raw_create_order_response');
addColumnIfMissing($pdo, 'payments', 'bank_status', 'VARCHAR(100) NULL AFTER status');

echo "Database schema is up to date.\n";

function addColumnIfMissing(PDO $pdo, string $table, string $column, string $definition): void
{
    $statement = $pdo->prepare(
        'SELECT COUNT(*)
         FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = :table
           AND COLUMN_NAME = :column'
    );
    $statement->execute(['table' => $table, 'column' => $column]);

    if ((int) $statement->fetchColumn() === 0) {
        $pdo->exec("ALTER TABLE {$table} ADD COLUMN {$column} {$definition}");
    }
}
