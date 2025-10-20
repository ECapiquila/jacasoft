import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/server/auth/rbac';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    requireAuth(request, ['ADMIN']);
    const orders = await prisma.order.findMany({
      where: { status: 'EM_VERIFICACAO' },
      include: { proofs: true }
    });
    return NextResponse.json({ data: orders });
  } catch (error) {
    console.error(error);
    if (error instanceof Response) return error;
    return NextResponse.json({ error: 'Erro ao listar pedidos' }, { status: 400 });
  }
}
