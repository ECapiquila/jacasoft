'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { WalletCard } from '@/components/WalletCard';
import { LedgerTable } from '@/components/LedgerTable';
import { WithdrawForm } from '@/components/WithdrawForm';

interface LedgerEntry {
  id: string;
  type: string;
  amount: number;
  currency: string;
  createdAt: string;
  notes?: string | null;
}

export default function CorretorDashboard() {
  const [balance, setBalance] = useState(0);
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [bankData, setBankData] = useState<Record<string, string>>({});
  const [minWithdrawal, setMinWithdrawal] = useState(0);

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch('/api/me/wallet', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) return;
      const data = await response.json();
      setBalance(Number(data.saldo));
      setEntries(data.ledgerEntries ?? []);
      setBankData(data.bankData ?? {});
      const configResponse = await fetch('/api/config/public');
      if (configResponse.ok) {
        const config = await configResponse.json();
        setMinWithdrawal(Number(config.minWithdrawal ?? 0));
      }
    }
    load();
  }, []);

  return (
    <ProtectedRoute allowedRoles={['CORRETOR']}>
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
        <h1 className="text-3xl font-semibold text-neutral-900">Painel do Corretor</h1>
        <WalletCard balance={balance} />
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <LedgerTable entries={entries} />
          <WithdrawForm minValue={minWithdrawal || 10000} defaultBankData={bankData} />
        </div>
      </main>
    </ProtectedRoute>
  );
}
