import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/server/auth/rbac';
import { verifyOrder } from '@/server/orders/service';
import { z } from 'zod';

interface Params {
  params: { id: string };
}

const schema = z.object({
  approve: z.boolean(),
  notes: z.string().optional()
});

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const user = requireAuth(request, ['ADMIN']);
    const payload = schema.parse(await request.json());
    const order = await verifyOrder({
      orderId: params.id,
      approve: payload.approve,
      adminId: user.id,
      notes: payload.notes
    });
    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    if (error instanceof Response) return error;
    return NextResponse.json({ error: 'Erro ao verificar pedido' }, { status: 400 });
  }
}
