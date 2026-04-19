<?php

namespace Modules\Affiliate\Providers;

class AffiliateServiceProvider
{
    public function register(): array
    {
        return [
            'config' => 'modules/Affiliate/Config/config.php',
            'routes' => 'modules/Affiliate/Routes/web.php',
            'views' => 'modules/Affiliate/Views',
        ];
    }
}
