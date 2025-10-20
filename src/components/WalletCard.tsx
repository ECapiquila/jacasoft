interface WalletCardProps {
  balance: number | string;
}

export function WalletCard({ balance }: WalletCardProps) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-neutral-500">Saldo disponível</p>
      <p className="text-3xl font-semibold text-neutral-900">{Number(balance).toLocaleString('pt-PT', { style: 'currency', currency: 'KZ' })}</p>
    </div>
  );
}
