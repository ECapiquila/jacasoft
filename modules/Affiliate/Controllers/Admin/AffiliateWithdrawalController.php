<?php

namespace Modules\Affiliate\Controllers\Admin;

class AffiliateWithdrawalController
{
    public function index(): array
    {
        return ['view' => 'affiliate::admin.withdrawals'];
    }
}
