<?php
declare(strict_types=1);

require __DIR__ . '/src/bootstrap.php';

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';

if ($path === '/api/leads') {
    $controller = new LeadController();
    $controller->store();
    exit;
}

http_response_code(200);
require __DIR__ . '/templates/landing.php';
