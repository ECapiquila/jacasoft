<?php
declare(strict_types=1);

class LeadValidator
{
    public static function validate(array $payload): array
    {
        $errors = [];

        $name = trim((string)($payload['name'] ?? ''));
        $phone = preg_replace('/\D+/', '', (string)($payload['phone'] ?? ''));
        $source = trim((string)($payload['source'] ?? 'landing-page'));

        if ($name === '') {
            $errors['name'] = 'O nome é obrigatório.';
        } elseif (mb_strlen($name) < 3 || mb_strlen($name) > 120) {
            $errors['name'] = 'O nome deve ter entre 3 e 120 caracteres.';
        }

        if ($phone === '') {
            $errors['phone'] = 'O telefone é obrigatório.';
        } elseif (!preg_match('/^\d{10,14}$/', $phone)) {
            $errors['phone'] = 'Informe um número de telefone válido com DDD.';
        }

        if ($source === '') {
            $source = 'landing-page';
        } elseif (mb_strlen($source) > 80) {
            $errors['source'] = 'A origem informada é muito longa.';
        }

        return [
            'isValid' => $errors === [],
            'data' => [
                'name' => $name,
                'phone' => $phone,
                'source' => $source,
            ],
            'errors' => $errors,
        ];
    }
}
