import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/server/auth/rbac';
import { sendMessage } from '@/server/messaging/service';
import { z } from 'zod';

const schema = z.object({
  toUserId: z.string(),
  propertyId: z.string().optional(),
  content: z.string().min(1)
});

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);
    const payload = schema.parse(await request.json());
    const message = await sendMessage({
      fromUserId: user.id,
      toUserId: payload.toUserId,
      propertyId: payload.propertyId,
      content: payload.content
    });
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error(error);
    if (error instanceof Response) return error;
    return NextResponse.json({ error: 'Erro ao enviar mensagem' }, { status: 400 });
  }
}
