<?php

namespace Modules\Affiliate\Services;

class AffiliateNotificationService
{
    public function notifyAdminNewAffiliate(array $payload, object $adminChannelServices): void
    {
        $adminChannelServices->create([ 'event' => 'affiliate_new_partner', 'data' => $payload ]);
    }

    public function notifyAffiliate(array $payload, object $privateChannelServices): void
    {
        $privateChannelServices->create([ 'event' => 'affiliate_update', 'data' => $payload ]);
    }
}
