<?php

namespace Modules\Affiliate\Models;

class AffiliatePayout
{
    public int $withdrawal_id;
    public string $provider = 'manual';
    public string $status = 'pending';
    public ?string $external_reference = null;
    public ?string $processed_at = null;
}
