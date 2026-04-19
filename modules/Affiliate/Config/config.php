<?php

return [
    'auto_approve_partner' => true,
    'cookie_name' => 'affiliate_ref',
    'cookie_ttl_days' => 30,
    'default_commission_type' => 'percent',
    'default_commission_value' => 10,
    'eligible_booking_statuses' => ['paid'],
    'minimum_withdrawal_amount' => 10000,
    'partner_statuses' => ['pending', 'approved', 'rejected', 'suspended'],
    'commission_statuses' => ['pending', 'approved', 'paid', 'cancelled'],
    'withdrawal_statuses' => ['pending', 'approved', 'paid', 'rejected'],
    'payout_statuses' => ['pending', 'processing', 'paid', 'failed'],
];
