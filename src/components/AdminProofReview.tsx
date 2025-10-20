'use client';

import { useState } from 'react';

interface ProofReviewProps {
  orderId: string;
  proofs: Array<{ id: string; fileUrl: string; valueInformed?: number | null }>;
}

export function AdminProofReview({ orderId, proofs }: ProofReviewProps) {
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleAction(approve: boolean) {
    setLoading(approve ? 'approve' : 'reject');
    setMessage(null);
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/admin/orders/${orderId}/verify`, {
      method: 'PATCH',
      headers: token
        ? {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        : { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approve })
    });
    setLoading(null);
    setMessage(response.ok ? 'Atualizado com sucesso.' : 'Erro ao atualizar.');
  }

  return (
    <div className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold">Comprovativos enviados</h3>
      <div className="space-y-3 text-sm">
        {proofs.map((proof) => (
          <div key={proof.id} className="flex items-center justify-between rounded-2xl border border-neutral-200 p-3">
            <a href={proof.fileUrl} target="_blank" rel="noreferrer" className="text-primary">
              Ver comprovativo
            </a>
            {proof.valueInformed && <span>Valor informado: {proof.valueInformed.toLocaleString('pt-PT')}</span>}
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => handleAction(true)}
          disabled={loading !== null}
          className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading === 'approve' ? 'A aprovar…' : 'Aprovar'}
        </button>
        <button
          type="button"
          onClick={() => handleAction(false)}
          disabled={loading !== null}
          className="flex-1 rounded-xl border border-neutral-300 px-4 py-3 text-sm font-semibold text-neutral-700 disabled:opacity-60"
        >
          {loading === 'reject' ? 'A reprovar…' : 'Reprovar'}
        </button>
      </div>
      {message && <p className="text-sm text-neutral-600">{message}</p>}
    </div>
  );
}
