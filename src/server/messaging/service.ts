import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const messageSchema = z.object({
  fromUserId: z.string(),
  toUserId: z.string(),
  propertyId: z.string().optional(),
  content: z.string().min(1)
});

export async function sendMessage(input: z.infer<typeof messageSchema>) {
  const data = messageSchema.parse(input);
  return prisma.message.create({
    data
  });
}

export async function getConversations(userId: string) {
  return prisma.message.findMany({
    where: {
      OR: [{ fromUserId: userId }, { toUserId: userId }]
    },
    orderBy: { createdAt: 'desc' }
  });
}
