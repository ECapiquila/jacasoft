<?php

namespace Modules\Affiliate\Models;

class AffiliateCommission
{
    public int $affiliate_id;
    public int $booking_id;
    public string $commission_type;
    public float $commission_value;
    public float $booking_amount;
    public float $commission_amount;
    public string $status = 'pending';
}
