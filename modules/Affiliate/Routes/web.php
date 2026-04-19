<?php

use Modules\Affiliate\Controllers\AffiliateLandingController;
use Modules\Affiliate\Controllers\User\AffiliateDashboardController;
use Modules\Affiliate\Controllers\Admin\AffiliatePartnerController;
use Modules\Affiliate\Controllers\Admin\AffiliateCommissionController;
use Modules\Affiliate\Controllers\Admin\AffiliateWithdrawalController;

return [
    ['GET', '/affiliate', [AffiliateLandingController::class, 'index']],

    ['GET', '/user/affiliate', [AffiliateDashboardController::class, 'index']],
    ['POST', '/user/affiliate/apply', [AffiliateDashboardController::class, 'apply']],
    ['POST', '/user/affiliate/withdrawals', [AffiliateDashboardController::class, 'requestWithdrawal']],

    ['GET', '/admin/module/affiliate/partners', [AffiliatePartnerController::class, 'index']],
    ['POST', '/admin/module/affiliate/partners/{id}/status', [AffiliatePartnerController::class, 'updateStatus']],
    ['GET', '/admin/module/affiliate/commissions', [AffiliateCommissionController::class, 'index']],
    ['GET', '/admin/module/affiliate/withdrawals', [AffiliateWithdrawalController::class, 'index']],
];
