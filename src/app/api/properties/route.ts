import { NextRequest, NextResponse } from 'next/server';
import { listProperties } from '@/server/properties/queries';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/server/auth/rbac';
import { z } from 'zod';

const propertySchema = z.object({
  title: z.string().min(3),
  purpose: z.enum(['VENDA', 'ARRENDAMENTO']),
  type: z.string(),
  price: z.number().positive(),
  currency: z.enum(['KZ', 'USD']),
  location: z.object({
    provincia: z.string(),
    cidade: z.string(),
    bairro: z.string(),
    lat: z.number(),
    lng: z.number()
  }),
  areaTotal: z.number().positive(),
  bedrooms: z.number().int(),
  bathrooms: z.number().int(),
  parking: z.number().int(),
  amenities: z.array(z.string()).min(1),
  description: z.string().min(20),
  media: z.array(z.string()).min(5)
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filters = {
    q: searchParams.get('q') ?? undefined,
    purpose: (searchParams.get('purpose') as 'VENDA' | 'ARRENDAMENTO' | null) ?? undefined,
    type: searchParams.get('type') ?? undefined,
    priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
    priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
    provincia: searchParams.get('provincia') ?? undefined,
    cidade: searchParams.get('cidade') ?? undefined,
    bairro: searchParams.get('bairro') ?? undefined,
    bedrooms: searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined,
    amenities: searchParams.getAll('amenities') ?? undefined,
    orderBy: (searchParams.get('orderBy') as 'novos' | 'preco' | 'area' | null) ?? undefined
  };

  const properties = await listProperties(filters);
  return NextResponse.json({ data: properties });
}

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request, ['CORRETOR']);
    const payload = propertySchema.parse(await request.json());

    const property = await prisma.property.create({
      data: {
        ...payload,
        corretor: {
          connect: { userId: user.id }
        },
        status: 'SUBMETIDO'
      }
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error(error);
    if (error instanceof Response) return error;
    return NextResponse.json({ error: 'Não foi possível criar o imóvel' }, { status: 400 });
  }
}
