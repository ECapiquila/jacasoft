import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/server/auth/rbac';
import { listLedgerEntries } from '@/server/finance/wallet';

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request, ['CORRETOR']);
    const url = new URL(request.url);
    const from = url.searchParams.get('from') ? new Date(url.searchParams.get('from')!) : undefined;
    const to = url.searchParams.get('to') ? new Date(url.searchParams.get('to')!) : undefined;
    const entries = await listLedgerEntries(user.id, from, to);
    return NextResponse.json({ data: entries });
  } catch (error) {
    console.error(error);
    if (error instanceof Response) return error;
    return NextResponse.json({ error: 'Erro ao listar lançamentos' }, { status: 400 });
  }
}
