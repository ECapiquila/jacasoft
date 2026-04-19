@extends('layouts.user')

@section('content')
<div class="panel">
    <h3 class="mb-3">Painel do Afiliado</h3>
    <div class="row">
        <div class="col-md-3"><div class="card"><div class="card-body"><small>Cliques</small><h4>{{ $stats['clicks'] ?? 0 }}</h4></div></div></div>
        <div class="col-md-3"><div class="card"><div class="card-body"><small>Reservas</small><h4>{{ $stats['bookings'] ?? 0 }}</h4></div></div></div>
        <div class="col-md-3"><div class="card"><div class="card-body"><small>Ganhos</small><h4>{{ $stats['earnings'] ?? 0 }}</h4></div></div></div>
        <div class="col-md-3"><div class="card"><div class="card-body"><small>Saldo disponível</small><h4>{{ $stats['available'] ?? 0 }}</h4></div></div></div>
    </div>
</div>
@endsection
