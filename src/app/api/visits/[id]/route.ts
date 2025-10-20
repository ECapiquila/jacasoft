import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/server/auth/rbac';
import { updateVisitStatus } from '@/server/visits/service';
import { z } from 'zod';

interface Params {
  params: { id: string };
}

const schema = z.object({
  status: z.enum(['PENDENTE', 'CONFIRMADA', 'CONCLUIDA', 'CANCELADA'])
});

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    requireAuth(request, ['CORRETOR', 'ADMIN']);
    const payload = schema.parse(await request.json());
    const visit = await updateVisitStatus({ visitId: params.id, status: payload.status });
    return NextResponse.json(visit);
  } catch (error) {
    console.error(error);
    if (error instanceof Response) return error;
    return NextResponse.json({ error: 'Erro ao atualizar visita' }, { status: 400 });
  }
}
