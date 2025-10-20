import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { VisitStatus } from '@prisma/client';

const visitSchema = z.object({
  propertyId: z.string(),
  clientId: z.string(),
  corretorId: z.string(),
  datetime: z.coerce.date()
});

export async function scheduleVisit(input: z.infer<typeof visitSchema>) {
  const data = visitSchema.parse(input);
  return prisma.visit.create({
    data: {
      propertyId: data.propertyId,
      clientId: data.clientId,
      corretorId: data.corretorId,
      datetime: data.datetime
    }
  });
}

const updateSchema = z.object({
  visitId: z.string(),
  status: z.nativeEnum(VisitStatus)
});

export async function updateVisitStatus(input: z.infer<typeof updateSchema>) {
  const data = updateSchema.parse(input);
  return prisma.visit.update({
    where: { id: data.visitId },
    data: {
      status: data.status
    }
  });
}
