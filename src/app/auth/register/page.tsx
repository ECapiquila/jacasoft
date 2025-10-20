'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: (searchParams.get('role') as 'CLIENTE' | 'CORRETOR' | null) ?? 'CLIENTE'
  });
  const [message, setMessage] = useState<string | null>(null);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setMessage(response.ok ? 'Conta criada com sucesso! Faça login.' : 'Erro ao registar.');
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 px-6 py-16">
      <h1 className="text-3xl font-semibold text-neutral-900">Criar conta</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium" htmlFor="name">
            Nome
          </label>
          <input
            id="name"
            value={form.name}
            onChange={(event) => update('name', event.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(event) => update('email', event.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="phone">
            Telefone
          </label>
          <input
            id="phone"
            value={form.phone}
            onChange={(event) => update('phone', event.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="password">
            Palavra-passe
          </label>
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={(event) => update('password', event.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="role">
            Perfil
          </label>
          <select
            id="role"
            value={form.role}
            onChange={(event) => update('role', event.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
          >
            <option value="CLIENTE">Cliente</option>
            <option value="CORRETOR">Corretor</option>
          </select>
        </div>
        <button type="submit" className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white">
          Registar
        </button>
        {message && <p className="text-sm text-neutral-600">{message}</p>}
      </form>
    </main>
  );
}
