interface LedgerEntryItem {
  id: string;
  type: string;
  amount: number;
  currency: string;
  createdAt: string | Date;
  notes?: string | null;
}

interface LedgerTableProps {
  entries: LedgerEntryItem[];
}

export function LedgerTable({ entries }: LedgerTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-neutral-200">
      <table className="min-w-full divide-y divide-neutral-200 bg-white text-sm">
        <thead className="bg-neutral-100 text-left text-xs uppercase tracking-wide text-neutral-600">
          <tr>
            <th className="px-4 py-3">Data</th>
            <th className="px-4 py-3">Tipo</th>
            <th className="px-4 py-3">Valor</th>
            <th className="px-4 py-3">Notas</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className="border-t border-neutral-100 text-neutral-700">
              <td className="px-4 py-3">{new Date(entry.createdAt).toLocaleDateString('pt-PT')}</td>
              <td className="px-4 py-3 font-medium">{entry.type}</td>
              <td className="px-4 py-3">
                {entry.amount.toLocaleString('pt-PT', { style: 'currency', currency: entry.currency })}
              </td>
              <td className="px-4 py-3 text-neutral-500">{entry.notes ?? '-'}</td>
            </tr>
          ))}
          {entries.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-neutral-500">
                Ainda sem lançamentos.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
