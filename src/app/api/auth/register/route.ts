import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/server/auth/password';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  password: z.string().min(8),
  role: z.enum(['CLIENTE', 'CORRETOR']).default('CLIENTE'),
  company: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json({ error: 'E-mail já registado.' }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        passwordHash: await hashPassword(data.password),
        verified: data.role === 'CLIENTE'
      }
    });

    if (data.role === 'CORRETOR') {
      await prisma.corretor.create({
        data: {
          userId: user.id,
          company: data.company,
          bankData: {},
          kycStatus: 'PENDENTE'
        }
      });
    }

    return NextResponse.json({ id: user.id, email: user.email });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Não foi possível registar.' }, { status: 400 });
  }
}
