'use client';

import { useState } from 'react';
import { OrderPaymentPanel } from '@/components/OrderPaymentPanel';

interface OrderFlowProps {
  propertyId: string;
  price: number;
  currency: 'KZ' | 'USD';
  bankAccounts: Array<{ banco: string; titular: string; iban: string; instrucao: string }>;
}

export function OrderFlow({ propertyId, price, currency, bankAccounts }: OrderFlowProps) {
  const [order, setOrder] = useState<{ id: string; reference: string } | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  async function startOrder() {
    setStatus('loading');
    const token = localStorage.getItem('token');
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: token
        ? {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        : { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId, value: price, currency })
    });
    if (!response.ok) {
      setStatus('error');
      return;
    }
    const data = await response.json();
    setOrder({ id: data.id, reference: data.reference });
    setStatus('idle');
  }

  if (order) {
    return <OrderPaymentPanel orderId={order.id} reference={order.reference} bankAccounts={bankAccounts} />;
  }

  return (
    <aside className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold">Iniciar pedido</h3>
      <p className="text-sm text-neutral-600">
        Efetue o pagamento por transferência bancária. Após clicar em &quot;Iniciar pedido&quot;, irá receber as instruções de pagamento e
        poderá carregar o comprovativo.
      </p>
      <button
        type="button"
        onClick={startOrder}
        disabled={status === 'loading'}
        className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {status === 'loading' ? 'A iniciar…' : 'Iniciar pedido'}
      </button>
      {status === 'error' && <p className="text-sm text-red-600">Não foi possível iniciar o pedido.</p>}
    </aside>
  );
}
