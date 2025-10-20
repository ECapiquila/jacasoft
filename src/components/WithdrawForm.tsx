'use client';

import { useState } from 'react';

interface WithdrawFormProps {
  minValue: number;
  defaultBankData: Record<string, string>;
}

export function WithdrawForm({ minValue, defaultBankData }: WithdrawFormProps) {
  const [amount, setAmount] = useState(minValue);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const token = localStorage.getItem('token');
    const response = await fetch('/api/me/withdrawals', {
      method: 'POST',
      headers: token
        ? {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        : { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, bankData: defaultBankData })
    });
    setLoading(false);
    setMessage(response.ok ? 'Solicitação enviada!' : 'Erro ao solicitar saque.');
  }

  return (
    <form className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
      <h3 className="text-lg font-semibold">Solicitar saque</h3>
      <div>
        <label className="block text-sm font-medium" htmlFor="amount">
          Valor (mínimo {minValue.toLocaleString('pt-PT', { style: 'currency', currency: 'KZ' })})
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          min={minValue}
          value={amount}
          onChange={(event) => setAmount(Number(event.target.value))}
          className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? 'A enviar…' : 'Enviar pedido'}
      </button>
      {message && <p className="text-sm text-neutral-600">{message}</p>}
    </form>
  );
}
