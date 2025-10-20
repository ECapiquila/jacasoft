import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/server/auth/rbac';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    requireAuth(request, ['ADMIN']);
    const withdrawals = await prisma.withdrawal.findMany({
      where: { status: { in: ['SOLICITADO', 'EM_ANALISE'] } }
    });
    return NextResponse.json({
      data: withdrawals.map((withdrawal) => ({
        ...withdrawal,
        bankDataSnapshot: withdrawal.bankDataSnapshot as Record<string, string>
      }))
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Response) return error;
    return NextResponse.json({ error: 'Erro ao listar saques' }, { status: 400 });
  }
}
