'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface SearchBarProps {
  variant?: 'default' | 'compact';
}

export function SearchBar({ variant = 'default' }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [purpose, setPurpose] = useState<'VENDA' | 'ARRENDAMENTO' | ''>('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (purpose) params.set('purpose', purpose);
    router.push(`/imoveis?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={clsx('flex gap-2 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm', {
        'flex-col sm:flex-row sm:items-center': variant === 'default',
        'flex-col gap-3': variant === 'compact'
      })}
      aria-label="Pesquisar imóveis"
    >
      <div className="flex flex-1 items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
        <MagnifyingGlassIcon className="h-5 w-5 text-neutral-400" aria-hidden />
        <label className="sr-only" htmlFor="search-input">
          Pesquisar imóveis
        </label>
        <input
          id="search-input"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cidade, bairro ou referência"
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="sr-only" htmlFor="purpose">
          Finalidade
        </label>
        <select
          id="purpose"
          name="purpose"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value as typeof purpose)}
          className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-3 text-sm text-neutral-700 focus:border-primary"
        >
          <option value="">Finalidade</option>
          <option value="VENDA">Compra</option>
          <option value="ARRENDAMENTO">Arrendamento</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow hover:bg-primary/90"
      >
        Pesquisar
      </button>
    </form>
  );
}
