<?php

namespace Modules\Affiliate\Services;

class AffiliateTrackingService
{
    public function captureReference(array $query, callable $findApprovedAffiliateByCode, callable $setCookie, callable $logClick): void
    {
        $refCode = $query['ref'] ?? null;
        if (!$refCode) {
            return;
        }

        $partner = $findApprovedAffiliateByCode($refCode);
        if (!$partner) {
            return;
        }

        $setCookie($refCode);
        $logClick($partner, $refCode);
    }
}
