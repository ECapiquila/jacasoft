import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendEmail, renderTemplate } from '@/server/auth/email';

const schema = z.object({
  email: z.string().email()
});

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      return NextResponse.json({ error: 'Utilizador não encontrado' }, { status: 404 });
    }

    await sendEmail({
      to: user.email,
      subject: 'Recuperação de palavra-passe',
      html: renderTemplate('generic', {
        message: 'Recebemos o seu pedido. Contacte o suporte para redefinir a palavra-passe.'
      })
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao solicitar recuperação' }, { status: 400 });
  }
}
