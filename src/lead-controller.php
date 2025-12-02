<?php
declare(strict_types=1);

class LeadController
{
    public function store(): void
    {
        header('Content-Type: application/json; charset=utf-8');

        if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Método não permitido.']);
            return;
        }

        $payload = json_decode(file_get_contents('php://input') ?: '[]', true);
        if (!is_array($payload)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'JSON inválido enviado.']);
            return;
        }

        $validation = LeadValidator::validate($payload);
        if (!$validation['isValid']) {
            http_response_code(422);
            echo json_encode([
                'success' => false,
                'message' => 'Erros de validação encontrados.',
                'errors' => $validation['errors'],
            ]);
            return;
        }

        $data = $validation['data'];

        $message = sprintf(
            'Olá, meu nome é %s. Acabei de ver a apresentação e quero saber mais. Meu contato: %s.',
            $data['name'],
            $data['phone']
        );

        $whatsappUrl = 'https://wa.me/244925521667?text=' . rawurlencode($message);

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'whatsappUrl' => $whatsappUrl,
        ]);
    }
}
