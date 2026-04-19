<?php

namespace Modules\Affiliate\Services;

class AffiliateCommissionService
{
    public function calculateAmount(string $type, float $value, float $bookingTotal): float
    {
        if ($type === 'fixed') {
            return max(0, $value);
        }

        return round(($bookingTotal * $value) / 100, 2);
    }

    public function shouldGenerate(string $bookingStatus, array $eligibleStatuses): bool
    {
        return in_array($bookingStatus, $eligibleStatuses, true);
    }

    public function isSelfCommission(int $affiliateUserId, int $bookingCustomerId): bool
    {
        return $affiliateUserId === $bookingCustomerId;
    }
}
