import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/server/auth/rbac';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const schema = z.object({
  bankAccounts: z.array(z.object({
    banco: z.string(),
    titular: z.string(),
    iban: z.string(),
    instrucao: z.string()
  })),
  percentDefault: z.number().min(0).max(1),
  exchangeRate: z.number().positive()
});

export async function PATCH(request: NextRequest) {
  try {
    requireAuth(request, ['ADMIN']);
    const payload = schema.parse(await request.json());
    await prisma.siteConfig.updateMany({
      data: {
        bankAccounts: payload.bankAccounts,
        exchangeRate: payload.exchangeRate
      }
    });
    await prisma.commissionRule.updateMany({
      data: {
        percentDefault: payload.percentDefault
      }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    if (error instanceof Response) return error;
    return NextResponse.json({ error: 'Erro ao atualizar configurações' }, { status: 400 });
  }
}
