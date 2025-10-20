import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/server/auth/rbac';
import { scheduleVisit } from '@/server/visits/service';
import { z } from 'zod';

const schema = z.object({
  propertyId: z.string(),
  corretorId: z.string(),
  datetime: z.string()
});

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request, ['CLIENTE']);
    const payload = schema.parse(await request.json());
    const visit = await scheduleVisit({
      propertyId: payload.propertyId,
      corretorId: payload.corretorId,
      clientId: user.id,
      datetime: new Date(payload.datetime)
    });
    return NextResponse.json(visit, { status: 201 });
  } catch (error) {
    console.error(error);
    if (error instanceof Response) return error;
    return NextResponse.json({ error: 'Erro ao agendar visita' }, { status: 400 });
  }
}
