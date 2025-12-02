<?php
declare(strict_types=1);

const DATABASE_DEFAULTS = [
    'host' => 'localhost',
    'port' => '3306',
    'dbname' => 'u638520025_paginavendas',
    'user' => 'u638520025_paginavendas',
    'password' => 'OmVaZw~He8q/',
    'charset' => 'utf8mb4',
];

function get_env(string $key, ?string $default = null): string
{
    $value = getenv($key);
    if ($value === false || $value === '') {
        if ($default !== null) {
            return $default;
        }

        throw new RuntimeException("Missing environment variable: {$key}");
    }

    return $value;
}

function get_database_config(): array
{
    return [
        'host' => get_env('DB_HOST', DATABASE_DEFAULTS['host']),
        'port' => get_env('DB_PORT', DATABASE_DEFAULTS['port']),
        'dbname' => get_env('DB_NAME', DATABASE_DEFAULTS['dbname']),
        'user' => get_env('DB_USER', DATABASE_DEFAULTS['user']),
        'password' => getenv('DB_PASSWORD') !== false && getenv('DB_PASSWORD') !== ''
            ? getenv('DB_PASSWORD')
            : DATABASE_DEFAULTS['password'],
        'charset' => DATABASE_DEFAULTS['charset'],
    ];
}
