@extends('layouts.app')

@section('content')
<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-lg-10">
            <h1 class="mb-3">Programa de Afiliados BookingCore</h1>
            <p class="lead">Monetize sua audiência promovendo tours e pacotes turísticos com comissão transparente e suporte dedicado.</p>

            <div class="card mb-4">
                <div class="card-body">
                    <h5 class="card-title">Benefícios</h5>
                    <ul class="mb-0">
                        <li>Comissões automáticas por reservas elegíveis.</li>
                        <li>Painel com métricas de cliques, reservas e ganhos.</li>
                        <li>Fluxo de saque com rastreabilidade completa.</li>
                    </ul>
                </div>
            </div>

            <div class="card mb-4">
                <div class="card-body">
                    <h5 class="card-title">Como funciona</h5>
                    <ol class="mb-0">
                        <li>Cadastre-se como afiliado.</li>
                        <li>Compartilhe seus links com código de referência.</li>
                        <li>Receba comissão após confirmação dos status elegíveis.</li>
                    </ol>
                </div>
            </div>

            <div class="d-flex gap-2">
                <a href="{{ url('/login') }}" class="btn btn-outline-primary">Entrar / Cadastrar</a>
                <a href="{{ url('/user/affiliate') }}" class="btn btn-primary">Tornar-se afiliado</a>
            </div>
        </div>
    </div>
</div>
@endsection
