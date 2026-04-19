<?php

namespace Modules\Affiliate\Services;

class AffiliatePayoutService
{
    public function startProcessing(array $payout): array
    {
        $payout['status'] = 'processing';
        return $payout;
    }

    public function markPaid(array $payout, string $externalReference): array
    {
        $payout['status'] = 'paid';
        $payout['external_reference'] = $externalReference;
        $payout['processed_at'] = gmdate('Y-m-d H:i:s');

        return $payout;
    }
}
