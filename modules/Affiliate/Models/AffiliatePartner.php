<?php

namespace Modules\Affiliate\Models;

class AffiliatePartner
{
    public int $id;
    public int $user_id;
    public string $affiliate_code;
    public string $status;
    public string $full_name;
    public string $phone;
    public string $payment_method;
    public string $payment_details;
    public string $commission_type;
    public float $commission_value;
    public float $total_earnings = 0;
    public int $total_bookings = 0;

    public static function generateCode(int $size = 8): string
    {
        return strtoupper(substr(bin2hex(random_bytes($size)), 0, $size));
    }
}
