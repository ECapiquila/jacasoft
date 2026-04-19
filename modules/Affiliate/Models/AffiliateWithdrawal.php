<?php

namespace Modules\Affiliate\Models;

class AffiliateWithdrawal
{
    public int $affiliate_id;
    public float $amount;
    public string $status = 'pending';
    public ?string $paid_at = null;
    public ?string $admin_note = null;
}
