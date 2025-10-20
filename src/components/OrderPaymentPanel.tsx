'use client';

import { useState } from 'react';

interface OrderPaymentPanelProps {
  orderId: string;
  reference: string;
  bankAccounts: Array<{ banco: string; titular: string; iban: string; instrucao: string }>;
}

export function OrderPaymentPanel({ orderId, reference, bankAccounts }: OrderPaymentPanelProps) {
  const [proof, setProof] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!proof) return;
    const formData = new FormData();
    formData.append('file', proof);
    setStatus('loading');
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/orders/${orderId}/proofs`, {
      method: 'POST',
      body: formData,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
    setStatus(response.ok ? 'success' : 'error');
  }

  return (
    <aside className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold">Pagamento offline</h3>
      <p className="text-sm text-neutral-600">
        Referência do pedido: <span className="font-semibold text-neutral-900">{reference}</span>
      </p>
      <div className="space-y-3 text-sm">
        {bankAccounts.map((account, index) => (
          <div key={`${account.iban}-${index}`} className="rounded-2xl border border-neutral-200 p-4">
            <p className="font-semibold text-neutral-900">{account.banco}</p>
            <p>Titular: {account.titular}</p>
            <p>IBAN: {account.iban}</p>
            <p className="text-neutral-500">{account.instrucao}</p>
          </div>
        ))}
      </div>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium" htmlFor="proof">
          Enviar comprovativo
        </label>
        <input
          id="proof"
          name="proof"
          type="file"
          accept="image/*,application/pdf"
          required
          onChange={(event) => setProof(event.target.files?.[0] ?? null)}
          className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={!proof || status === 'loading'}
          className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {status === 'loading' ? 'A enviar…' : 'Enviar comprovativo'}
        </button>
        {status === 'success' && <p className="text-sm text-green-600">Comprovativo enviado com sucesso.</p>}
        {status === 'error' && <p className="text-sm text-red-600">Erro ao enviar comprovativo.</p>}
      </form>
    </aside>
  );
}
