import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/server/auth/rbac';
import { prisma } from '@/lib/prisma';

function toCSV(rows: Record<string, unknown>[]) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const data = [headers.join(','), ...rows.map((row) => headers.map((key) => row[key]).join(','))];
  return data.join('\n');
}

export async function GET(request: NextRequest) {
  try {
    requireAuth(request, ['ADMIN']);
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const from = url.searchParams.get('from') ? new Date(url.searchParams.get('from')!) : undefined;
    const to = url.searchParams.get('to') ? new Date(url.searchParams.get('to')!) : undefined;
    const csv = url.searchParams.get('csv') === '1';

    let rows: Record<string, unknown>[] = [];

    switch (type) {
      case 'vendas':
        rows = await prisma.order.findMany({
          where: {
            status: 'CONCLUIDO',
            createdAt: {
              gte: from,
              lte: to
            }
          },
          select: {
            reference: true,
            value: true,
            currency: true,
            createdAt: true
          }
        });
        break;
      case 'comissoes':
        rows = await prisma.ledgerEntry.findMany({
          where: {
            type: 'COMISSAO',
            createdAt: {
              gte: from,
              lte: to
            }
          },
          select: {
            amount: true,
            currency: true,
            createdAt: true,
            corretorId: true,
            orderId: true
          }
        });
        break;
      case 'saques':
        rows = await prisma.withdrawal.findMany({
          where: {
            createdAt: {
              gte: from,
              lte: to
            }
          },
          select: {
            id: true,
            amount: true,
            status: true,
            createdAt: true
          }
        });
        break;
      default:
        rows = await prisma.ledgerEntry.findMany({
          select: {
            id: true,
            type: true,
            amount: true,
            createdAt: true
          }
        });
    }

    if (csv) {
      const body = toCSV(rows);
      return new NextResponse(body, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="relatorio-${type ?? 'geral'}.csv"`
        }
      });
    }

    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error(error);
    if (error instanceof Response) return error;
    return NextResponse.json({ error: 'Erro ao gerar relatório' }, { status: 400 });
  }
}
