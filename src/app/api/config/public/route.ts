import { NextResponse } from 'next/server';
import { getPublicSiteConfig } from '@/server/config/site';

export async function GET() {
  const config = await getPublicSiteConfig();
  return NextResponse.json(config);
}
