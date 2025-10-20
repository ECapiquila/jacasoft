import { NextRequest, NextResponse } from 'next/server';
import { getPropertyById } from '@/server/properties/queries';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/server/auth/rbac';
import { z } from 'zod';

interface Params {
  params: { id: string };
}

const updateSchema = z.object({
  title: z.string().optional(),
  price: z.number().positive().optional(),
  description: z.string().optional(),
  media: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional()
});

export async function GET(_: Request, { params }: Params) {
  try {
    const property = await getPropertyById(params.id);
    return NextResponse.json(property);
  } catch (error) {
    return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const user = requireAuth(request);
    const property = await prisma.property.findUniqueOrThrow({ where: { id: params.id } });
    const corretor = await prisma.corretor.findUnique({ where: { userId: user.id } });
    if (user.role !== 'ADMIN' && property.corretorId !== corretor?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }
    const payload = updateSchema.parse(await request.json());
    const updated = await prisma.property.update({
      where: { id: params.id },
      data: payload
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    if (error instanceof Response) return error;
    return NextResponse.json({ error: 'Erro ao atualizar imóvel' }, { status: 400 });
  }
}
