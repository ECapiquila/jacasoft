import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await prisma.property.findMany({
    where: { status: 'APROVADO' },
    select: { id: true, updatedAt: true }
  });

  const baseUrl = process.env.SITE_URL ?? 'http://localhost:3000';

  return [
    {
      url: baseUrl,
      lastModified: new Date()
    },
    ...properties.map((property) => ({
      url: `${baseUrl}/imoveis/${property.id}`,
      lastModified: property.updatedAt
    }))
  ];
}
