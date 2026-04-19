<?php

namespace Modules\Affiliate\Controllers;

class AffiliateLandingController
{
    public function index(): array
    {
        return [
            'view' => 'affiliate::public.index',
            'data' => [
                'title' => 'Programa de Afiliados BookingCore',
            ],
        ];
    }
}
