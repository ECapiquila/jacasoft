import { prisma } from '@/lib/prisma';
import { sendEmail, renderTemplate } from '@/server/auth/email';
import { Prisma, Currency, OrderStatus, LedgerType } from '@prisma/client';
import { z } from 'zod';

const createOrderSchema = z.object({
  propertyId: z.string(),
  clientId: z.string(),
  value: z.number().positive(),
  currency: z.nativeEnum(Currency)
});

const addProofSchema = z.object({
  orderId: z.string(),
  fileUrl: z.string().url(),
  valueInformed: z.number().positive().optional(),
  bankOrigin: z.string().optional(),
  payerName: z.string().optional()
});

export async function createOrder(input: z.infer<typeof createOrderSchema>) {
  const data = createOrderSchema.parse(input);

  const property = await prisma.property.findUniqueOrThrow({
    where: { id: data.propertyId },
    include: { corretor: true }
  });

  const reference = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  return prisma.order.create({
    data: {
      propertyId: property.id,
      clientId: data.clientId,
      corretorId: property.corretorId,
      value: data.value,
      currency: data.currency,
      reference,
      status: OrderStatus.AGUARDANDO_COMPROVATIVO
    },
    include: {
      property: true
    }
  });
}

export async function attachProof(input: z.infer<typeof addProofSchema>) {
  const data = addProofSchema.parse(input);
  const order = await prisma.order.update({
    where: { id: data.orderId },
    data: {
      status: OrderStatus.EM_VERIFICACAO,
      proofs: {
        create: {
          fileUrl: data.fileUrl,
          valueInformed: data.valueInformed,
          bankOrigin: data.bankOrigin,
          payerName: data.payerName
        }
      }
    },
    include: {
      client: true,
      property: true
    }
  });

  return order;
}

const verifyOrderSchema = z.object({
  orderId: z.string(),
  approve: z.boolean(),
  adminId: z.string(),
  notes: z.string().optional()
});

async function calculateCommission(orderId: string) {
  const order = await prisma.order.findUniqueOrThrow({
    where: { id: orderId },
    include: {
      property: true,
      corretor: true
    }
  });
  const commissionRule = await prisma.commissionRule.findFirst();
  const overrides = commissionRule?.overridesByCorretor as Record<string, number> | null;
  const percent = overrides?.[order.corretorId] ?? Number(commissionRule?.percentDefault ?? 0.1);
  const commission = Number(order.value) * percent;
  const liquid = Number(order.value) - commission;
  return { commission, liquid, percent, order };
}

export async function verifyOrder(input: z.infer<typeof verifyOrderSchema>) {
  const data = verifyOrderSchema.parse(input);
  const { commission, liquid, percent, order } = await calculateCommission(data.orderId);

  if (!data.approve) {
    const updated = await prisma.order.update({
      where: { id: data.orderId },
      data: {
        status: OrderStatus.REPROVADO,
        adminNotes: data.notes
      },
      include: {
        client: true
      }
    });

    await sendEmail({
      to: updated.client.email,
      subject: `Pedido ${updated.reference} reprovado`,
      html: renderTemplate('order-rejected', {
        name: updated.client.name,
        reference: updated.reference,
        reason: data.notes ?? 'Verifique o comprovativo enviado'
      })
    });

    return updated;
  }

  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.order.update({
      where: { id: data.orderId },
      data: {
        status: OrderStatus.CONCLUIDO
      },
      include: {
        client: true,
        corretor: {
          include: { user: true }
        }
      }
    });

    await tx.ledgerEntry.createMany({
      data: [
        {
          type: LedgerType.COMISSAO,
          orderId: updated.id,
          corretorId: updated.corretorId,
          amount: commission,
          currency: updated.currency,
          notes: `Comissão ${percent * 100}%`
        },
        {
          type: LedgerType.CREDITO_CORRETOR,
          orderId: updated.id,
          corretorId: updated.corretorId,
          amount: liquid,
          currency: updated.currency,
          notes: 'Crédito líquido após comissão'
        }
      ]
    });

    await tx.corretor.update({
      where: { id: updated.corretorId },
      data: {
        walletBalance: { increment: liquid }
      }
    });

    await sendEmail({
      to: updated.client.email,
      subject: `Pedido ${updated.reference} aprovado`,
      html: renderTemplate('order-approved', {
        name: updated.client.name,
        reference: updated.reference
      })
    });

    return updated;
  });

  return result;
}
