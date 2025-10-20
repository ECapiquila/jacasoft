import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/server/orders/service';
import { requireAuth } from '@/server/auth/rbac';
import { z } from 'zod';

const schema = z.object({
  propertyId: z.string(),
  value: z.number().positive(),
  currency: z.enum(['KZ', 'USD'])
});

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request, ['CLIENTE']);
    const payload = schema.parse(await request.json());
    const order = await createOrder({ ...payload, clientId: user.id });
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error(error);
    if (error instanceof Response) return error;
    return NextResponse.json({ error: 'Erro ao criar pedido' }, { status: 400 });
  }
}
