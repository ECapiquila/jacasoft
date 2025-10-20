'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      setError('Credenciais inválidas.');
      return;
    }
    const data = await response.json();
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('role', data.user.role);
    window.location.href = data.user.role === 'ADMIN' ? '/admin' : data.user.role === 'CORRETOR' ? '/corretor' : '/';
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 px-6 py-16">
      <h1 className="text-3xl font-semibold text-neutral-900">Entrar</h1>
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
        <div>
          <label className="block text-sm font-medium" htmlFor="password">
            Palavra-passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            required
          />
        </div>
        <button type="submit" className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white">
          Entrar
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
      <div className="text-sm text-neutral-600">
        <Link href="/auth/forgot" className="text-primary">
          Esqueci a palavra-passe
        </Link>
      </div>
    </main>
  );
}
