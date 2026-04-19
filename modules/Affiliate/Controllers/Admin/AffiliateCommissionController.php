<?php

namespace Modules\Affiliate\Controllers\Admin;

class AffiliateCommissionController
{
    public function index(): array
    {
        return ['view' => 'affiliate::admin.commissions'];
    }
}
