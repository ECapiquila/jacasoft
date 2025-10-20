import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/server/auth/rbac';
import { getConversations } from '@/server/messaging/service';

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    const messages = await getConversations(user.id);
    return NextResponse.json({ data: messages });
  } catch (error) {
    console.error(error);
    if (error instanceof Response) return error;
    return NextResponse.json({ error: 'Erro ao carregar mensagens' }, { status: 400 });
  }
}
