import { NextRequest } from 'next/server';
import { verifyAccessToken } from './jwt';

export type AuthenticatedUser = {
  id: string;
  role: 'CLIENTE' | 'CORRETOR' | 'ADMIN';
};

export function requireAuth(request: NextRequest, roles?: AuthenticatedUser['role'][]): AuthenticatedUser {
  const header = request.headers.get('authorization');
  if (!header) {
    throw new Response('Unauthorized', { status: 401 });
  }
  const token = header.replace('Bearer ', '').trim();
  if (!token) {
    throw new Response('Unauthorized', { status: 401 });
  }
  const payload = verifyAccessToken(token);
  if (roles && !roles.includes(payload.role)) {
    throw new Response('Forbidden', { status: 403 });
  }
  return { id: payload.sub, role: payload.role };
}
