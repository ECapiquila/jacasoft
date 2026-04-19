<?php

namespace Modules\Affiliate\Models;

class AffiliateCoupon
{
    public int $affiliate_id;
    public string $coupon_code;
    public string $discount_type;
    public float $discount_value;
    public ?string $valid_from = null;
    public ?string $valid_to = null;
    public string $status = 'active';
}
