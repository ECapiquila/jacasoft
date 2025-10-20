'use client';

import { useState } from 'react';

export default function ForgotPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const response = await fetch('/api/auth/forgot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    setMessage(response.ok ? 'Enviámos instruções para o seu e-mail.' : 'Não foi possível enviar.');
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 px-6 py-16">
      <h1 className="text-3xl font-semibold text-neutral-900">Recuperar acesso</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            required
          />
        </div>
        <button type="submit" className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white">
          Enviar
        </button>
        {message && <p className="text-sm text-neutral-600">{message}</p>}
      </form>
    </main>
  );
}
