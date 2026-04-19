<?php

namespace Modules\Affiliate\Services;

class AffiliateBookingMetaService
{
    public function attachAffiliateMeta(int $bookingId, int $affiliateId, string $affiliateCode, callable $upsertMeta): void
    {
        $upsertMeta($bookingId, 'affiliate_id', (string) $affiliateId);
        $upsertMeta($bookingId, 'affiliate_code', $affiliateCode);
    }
}
