import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/server/auth/rbac';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request, ['CORRETOR']);
    const corretor = await prisma.corretor.findUniqueOrThrow({
      where: { userId: user.id },
      include: {
        ledgerEntries: true
      }
    });
    return NextResponse.json({
      saldo: corretor.walletBalance,
      ledgerEntries: corretor.ledgerEntries,
      bankData: corretor.bankData
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Response) return error;
    return NextResponse.json({ error: 'Erro ao carregar carteira' }, { status: 400 });
  }
}
