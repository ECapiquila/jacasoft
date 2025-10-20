import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/server/auth/rbac';
import { processWithdrawal } from '@/server/finance/wallet';
import { z } from 'zod';
import { WithdrawalStatus } from '@prisma/client';

interface Params {
  params: { id: string };
}

const schema = z.object({
  status: z.nativeEnum(WithdrawalStatus),
  adminReceiptUrl: z.string().url().optional(),
  notes: z.string().optional()
});

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    requireAuth(request, ['ADMIN']);
    const payload = schema.parse(await request.json());
    const withdrawal = await processWithdrawal({
      withdrawalId: params.id,
      status: payload.status,
      adminReceiptUrl: payload.adminReceiptUrl,
      notes: payload.notes
    });
    return NextResponse.json(withdrawal);
  } catch (error) {
    console.error(error);
    if (error instanceof Response) return error;
    return NextResponse.json({ error: 'Erro ao processar saque' }, { status: 400 });
  }
}
