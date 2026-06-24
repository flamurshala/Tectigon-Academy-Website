<?php

declare(strict_types=1);

$pdo = require __DIR__ . '/config/connection.php';

$mysqlVersion = $pdo->query('SELECT VERSION()')->fetchColumn();
$databaseName = $pdo->query('SELECT DATABASE()')->fetchColumn();

echo sprintf(
    "Connected to MySQL %s using database %s%s",
    $mysqlVersion,
    $databaseName ?: '(none selected)',
    PHP_EOL
);
