'use client';

import { useState } from 'react';

interface AdminWithdrawReviewProps {
  withdrawalId: string;
  amount: number;
  bankData: Record<string, string>;
}

export function AdminWithdrawReview({ withdrawalId, amount, bankData }: AdminWithdrawReviewProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  async function handleAction(targetStatus: 'PAGO' | 'REPROVADO') {
    setStatus('loading');
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/admin/withdrawals/${withdrawalId}`, {
      method: 'PATCH',
      headers: token
        ? {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        : { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: targetStatus })
    });
    setStatus(response.ok ? 'done' : 'error');
  }

  return (
    <div className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold">Processar saque</h3>
      <p className="text-sm text-neutral-600">Valor solicitado: {amount.toLocaleString('pt-PT', { style: 'currency', currency: 'KZ' })}</p>
      <div className="rounded-2xl bg-neutral-50 p-4 text-sm">
        {Object.entries(bankData).map(([key, value]) => (
          <p key={key}>
            <span className="font-medium capitalize">{key}:</span> {value}
          </p>
        ))}
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => handleAction('PAGO')}
          disabled={status === 'loading'}
          className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          Marcar como pago
        </button>
        <button
          type="button"
          onClick={() => handleAction('REPROVADO')}
          disabled={status === 'loading'}
          className="flex-1 rounded-xl border border-neutral-300 px-4 py-3 text-sm font-semibold text-neutral-700 disabled:opacity-60"
        >
          Reprovar
        </button>
      </div>
      {status === 'done' && <p className="text-sm text-green-600">Atualizado com sucesso.</p>}
      {status === 'error' && <p className="text-sm text-red-600">Erro ao atualizar.</p>}
    </div>
  );
}
