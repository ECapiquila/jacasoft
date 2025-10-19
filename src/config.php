<?php
declare(strict_types=1);

const REQUIRED_ENV_VARS = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER'];

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
    foreach (REQUIRED_ENV_VARS as $envVar) {
        if (getenv($envVar) === false || getenv($envVar) === '') {
            throw new RuntimeException('Database configuration incomplete. Please set DB_HOST, DB_PORT, DB_NAME, and DB_USER.');
        }
    }

    return [
        'host' => get_env('DB_HOST'),
        'port' => get_env('DB_PORT'),
        'dbname' => get_env('DB_NAME'),
        'user' => get_env('DB_USER'),
        'password' => getenv('DB_PASSWORD') ?: '',
        'charset' => 'utf8mb4',
    ];
}
