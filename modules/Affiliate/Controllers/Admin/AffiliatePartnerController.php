<?php

namespace Modules\Affiliate\Controllers\Admin;

class AffiliatePartnerController
{
    public function index(): array
    {
        return ['view' => 'affiliate::admin.partners'];
    }

    public function updateStatus(int $id, string $status, callable $callback): void
    {
        $callback($id, $status);
    }
}
