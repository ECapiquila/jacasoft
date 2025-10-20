import { prisma } from '@/lib/prisma';
import type { PropertyFilter, PropertySummary } from './types';
import { Prisma } from '@prisma/client';

export async function getFeaturedProperties(): Promise<PropertySummary[]> {
  const properties = await prisma.property.findMany({
    where: { status: 'APROVADO', featured: true },
    take: 6,
    orderBy: { publishedAt: 'desc' }
  });
  return properties.map((property) => ({
    ...property,
    location: property.location as PropertySummary['location']
  }));
}

export async function listProperties(filters: PropertyFilter) {
  const where: Prisma.PropertyWhereInput = {
    status: 'APROVADO'
  };

  if (filters.purpose) {
    where.purpose = filters.purpose;
  }
  if (filters.type) {
    where.type = filters.type;
  }
  if (filters.priceMin || filters.priceMax) {
    where.price = {};
    if (filters.priceMin) where.price.gte = filters.priceMin;
    if (filters.priceMax) where.price.lte = filters.priceMax;
  }
  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q, mode: 'insensitive' } },
      { description: { contains: filters.q, mode: 'insensitive' } }
    ];
  }
  if (filters.provincia || filters.cidade || filters.bairro) {
    where.AND = [
      {
        location: {
          path: '$.provincia',
          string_contains: filters.provincia ?? ''
        }
      }
    ];
    if (filters.cidade) {
      where.AND?.push({
        location: {
          path: '$.cidade',
          string_contains: filters.cidade
        }
      });
    }
    if (filters.bairro) {
      where.AND?.push({
        location: {
          path: '$.bairro',
          string_contains: filters.bairro
        }
      });
    }
  }
  if (filters.bedrooms) {
    where.bedrooms = { gte: filters.bedrooms };
  }
  if (filters.amenities?.length) {
    where.amenities = { hasEvery: filters.amenities };
  }

  const orderBy = (() => {
    switch (filters.orderBy) {
      case 'preco':
        return { price: 'asc' } as Prisma.PropertyOrderByWithRelationInput;
      case 'area':
        return { areaTotal: 'desc' } as Prisma.PropertyOrderByWithRelationInput;
      default:
        return { publishedAt: 'desc' } as Prisma.PropertyOrderByWithRelationInput;
    }
  })();

  const properties = await prisma.property.findMany({
    where,
    orderBy,
    take: 50
  });

  return properties.map((property) => ({
    ...property,
    location: property.location as PropertySummary['location']
  }));
}

export async function getPropertyById(id: string) {
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      corretor: {
        include: {
          user: true
        }
      }
    }
  });
  if (!property) {
    throw new Error('Imóvel não encontrado');
  }
  return {
    ...property,
    location: property.location as PropertySummary['location']
  };
}
