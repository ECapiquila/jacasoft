'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminProofReview } from '@/components/AdminProofReview';
import { AdminWithdrawReview } from '@/components/AdminWithdrawReview';

interface OrderToVerify {
  id: string;
  reference: string;
  proofs: Array<{ id: string; fileUrl: string; valueInformed?: number | null }>;
}

interface WithdrawalPending {
  id: string;
  amount: number;
  bankDataSnapshot: Record<string, string>;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<OrderToVerify[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalPending[]>([]);

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem('token');
      if (!token) return;
      const [ordersResponse, withdrawalsResponse] = await Promise.all([
        fetch('/api/admin/orders', { headers: { Authorization: `Bearer ${token}` } }).catch(() => null),
        fetch('/api/admin/withdrawals', { headers: { Authorization: `Bearer ${token}` } }).catch(() => null)
      ]);
      if (ordersResponse?.ok) {
        const data = await ordersResponse.json();
        setOrders(data.data ?? []);
      }
      if (withdrawalsResponse?.ok) {
        const data = await withdrawalsResponse.json();
        setWithdrawals(data.data ?? []);
      }
    }
    load();
  }, []);

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <h1 className="text-3xl font-semibold text-neutral-900">Painel Administrativo</h1>
        <section className="grid gap-6 lg:grid-cols-2">
          {orders.map((order) => (
            <AdminProofReview key={order.id} orderId={order.id} proofs={order.proofs} />
          ))}
          {orders.length === 0 && <p className="text-neutral-500">Nenhum comprovativo pendente.</p>}
        </section>
        <section className="grid gap-6 lg:grid-cols-2">
          {withdrawals.map((withdrawal) => (
            <AdminWithdrawReview key={withdrawal.id} withdrawalId={withdrawal.id} amount={withdrawal.amount} bankData={withdrawal.bankDataSnapshot} />
          ))}
          {withdrawals.length === 0 && <p className="text-neutral-500">Nenhum saque pendente.</p>}
        </section>
      </main>
    </ProtectedRoute>
  );
}
