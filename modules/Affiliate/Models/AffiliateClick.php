<?php

namespace Modules\Affiliate\Models;

class AffiliateClick
{
    public int $affiliate_id;
    public string $ref_code;
    public ?string $object_model = null;
    public ?int $object_id = null;
    public ?string $ip_address = null;
    public ?string $user_agent = null;
    public ?string $session_id = null;
}
