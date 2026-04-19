<?php

namespace Modules\Affiliate\Listeners;

use Modules\Affiliate\Events\BookingStatusChanged;
use Modules\Affiliate\Services\AffiliateCommissionService;

class GenerateAffiliateCommissionListener
{
    public function __construct(private AffiliateCommissionService $commissionService)
    {
    }

    public function handle(BookingStatusChanged $event, callable $resolver, callable $persist): void
    {
        $booking = $resolver($event->bookingId);
        if (!$booking) {
            return;
        }

        if (!$this->commissionService->shouldGenerate($event->toStatus, config('affiliate.eligible_booking_statuses'))) {
            return;
        }

        $persist($booking);
    }
}
