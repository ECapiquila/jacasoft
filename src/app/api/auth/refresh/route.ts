import { NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyRefreshToken, signAccessToken, signRefreshToken } from '@/server/auth/jwt';

const schema = z.object({
  refreshToken: z.string()
});

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    const payload = verifyRefreshToken(data.refreshToken);
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    return NextResponse.json({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Refresh token inválido' }, { status: 401 });
  }
}
