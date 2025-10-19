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
        $timestamp = $payload['timestamp'] ?? (new DateTimeImmutable('now', new DateTimeZone('UTC')))->format(DateTimeInterface::ATOM);

        try {
            $submittedAt = new DateTimeImmutable($timestamp);
        } catch (Exception $exception) {
            $submittedAt = new DateTimeImmutable('now', new DateTimeZone('UTC'));
        }

        try {
            $pdo = Database::connection();
            $statement = $pdo->prepare('INSERT INTO leads (name, phone, source, submitted_at) VALUES (:name, :phone, :source, :submitted_at)');
            $statement->execute([
                ':name' => $data['name'],
                ':phone' => $data['phone'],
                ':source' => $data['source'],
                ':submitted_at' => $submittedAt->setTimezone(new DateTimeZone('UTC'))->format('Y-m-d H:i:s'),
            ]);
            $leadId = (int) $pdo->lastInsertId();
        } catch (Throwable $exception) {
            error_log('Lead storage failed: ' . $exception->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Não foi possível salvar seus dados no momento.',
            ]);
            return;
        }

        http_response_code(201);
        echo json_encode([
            'success' => true,
            'id' => $leadId,
        ]);
    }
}
