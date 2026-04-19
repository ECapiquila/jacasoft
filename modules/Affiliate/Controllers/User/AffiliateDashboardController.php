<?php

namespace Modules\Affiliate\Controllers\User;

class AffiliateDashboardController
{
    public function index(): array
    {
        return [
            'view' => 'affiliate::user.dashboard',
            'data' => [],
        ];
    }

    public function apply(array $payload, callable $createPartner): array
    {
        $payload['status'] = config('affiliate.auto_approve_partner') ? 'approved' : 'pending';
        return $createPartner($payload);
    }

    public function requestWithdrawal(array $payload, callable $createWithdrawal): array
    {
        return $createWithdrawal($payload);
    }
}
