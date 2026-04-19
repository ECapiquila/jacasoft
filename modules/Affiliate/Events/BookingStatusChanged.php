<?php

namespace Modules\Affiliate\Events;

class BookingStatusChanged
{
    public function __construct(
        public int $bookingId,
        public string $fromStatus,
        public string $toStatus
    ) {
    }
}
