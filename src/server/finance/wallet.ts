import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { LedgerType, WithdrawalStatus } from '@prisma/client';

export async function getWallet(corretorId: string) {
  const corretor = await prisma.corretor.findUniqueOrThrow({
    where: { id: corretorId }
  });
  return corretor;
}

export async function listLedgerEntries(corretorId: string, from?: Date, to?: Date) {
  return prisma.ledgerEntry.findMany({
    where: {
      corretorId,
      createdAt: {
        gte: from,
        lte: to
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

const withdrawalSchema = z.object({
  corretorId: z.string(),
  amount: z.number().positive(),
  bankData: z.record(z.string(), z.string()).optional()
});

export async function requestWithdrawal(input: z.infer<typeof withdrawalSchema>) {
  const data = withdrawalSchema.parse(input);
  const corretor = await prisma.corretor.findUniqueOrThrow({ where: { id: data.corretorId } });
  if (Number(corretor.walletBalance) < data.amount) {
    throw new Error('Saldo insuficiente');
  }
  const bankDataSnapshot = data.bankData ?? (corretor.bankData as Record<string, string>);

  return prisma.withdrawal.create({
    data: {
      corretorId: corretor.id,
      amount: data.amount,
      bankDataSnapshot
    }
  });
}

const adminWithdrawalSchema = z.object({
  withdrawalId: z.string(),
  status: z.nativeEnum(WithdrawalStatus),
  adminReceiptUrl: z.string().url().optional(),
  notes: z.string().optional()
});

export async function processWithdrawal(input: z.infer<typeof adminWithdrawalSchema>) {
  const data = adminWithdrawalSchema.parse(input);
  const withdrawal = await prisma.withdrawal.findUniqueOrThrow({
    where: { id: data.withdrawalId }
  });

  if (data.status === WithdrawalStatus.PAGO) {
    return prisma.$transaction(async (tx) => {
      await tx.ledgerEntry.create({
        data: {
          type: LedgerType.DEBITO_SAQUE,
          corretorId: withdrawal.corretorId,
          amount: Number(withdrawal.amount),
          currency: 'KZ',
          notes: data.notes
        }
      });

      await tx.corretor.update({
        where: { id: withdrawal.corretorId },
        data: {
          walletBalance: { decrement: Number(withdrawal.amount) }
        }
      });

      return tx.withdrawal.update({
        where: { id: withdrawal.id },
        data: {
          status: WithdrawalStatus.PAGO,
          adminReceiptUrl: data.adminReceiptUrl
        }
      });
    });
  }

  return prisma.withdrawal.update({
    where: { id: withdrawal.id },
    data: {
      status: data.status,
      adminReceiptUrl: data.adminReceiptUrl
    }
  });
}
