import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/server/auth/rbac';
import { requestWithdrawal } from '@/server/finance/wallet';
import { z } from 'zod';

const schema = z.object({
  amount: z.number().positive(),
  bankData: z.record(z.string(), z.string()).optional()
});

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request, ['CORRETOR']);
    const payload = schema.parse(await request.json());
    const withdrawal = await requestWithdrawal({ ...payload, corretorId: user.id });
    return NextResponse.json(withdrawal, { status: 201 });
  } catch (error) {
    console.error(error);
    if (error instanceof Response) return error;
    return NextResponse.json({ error: 'Erro ao solicitar saque' }, { status: 400 });
  }
}
