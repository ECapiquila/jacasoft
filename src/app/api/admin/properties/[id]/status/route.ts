import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/server/auth/rbac';
import { z } from 'zod';

interface Params {
  params: { id: string };
}

const schema = z.object({
  status: z.enum(['APROVADO', 'REPROVADO', 'PAUSADO']),
  notes: z.string().optional()
});

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    requireAuth(request, ['ADMIN']);
    const payload = schema.parse(await request.json());
    const property = await prisma.property.update({
      where: { id: params.id },
      data: {
        status: payload.status,
        adminNotes: payload.notes,
        publishedAt: payload.status === 'APROVADO' ? new Date() : undefined
      }
    });
    return NextResponse.json(property);
  } catch (error) {
    console.error(error);
    if (error instanceof Response) return error;
    return NextResponse.json({ error: 'Erro ao atualizar status' }, { status: 400 });
  }
}
