import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/server/auth/rbac';
import { saveFile } from '@/server/uploads/storage';
import { attachProof } from '@/server/orders/service';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const user = requireAuth(request, ['CLIENTE']);
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: 'Arquivo obrigatório' }, { status: 400 });
    }

    const order = await prisma.order.findUniqueOrThrow({
      where: { id: params.id }
    });
    if (order.clientId !== user.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const originalName = typeof (file as any).name === 'string' ? (file as any).name : 'comprovativo.pdf';
    const fileUrl = await saveFile(buffer, originalName);

    const valueInformed = formData.get('valueInformed') ? Number(formData.get('valueInformed')) : undefined;
    const proof = await attachProof({
      orderId: params.id,
      fileUrl,
      valueInformed,
      bankOrigin: formData.get('bankOrigin')?.toString(),
      payerName: formData.get('payerName')?.toString()
    });

    return NextResponse.json(proof);
  } catch (error) {
    console.error(error);
    if (error instanceof Response) return error;
    return NextResponse.json({ error: 'Erro ao enviar comprovativo' }, { status: 400 });
  }
}
