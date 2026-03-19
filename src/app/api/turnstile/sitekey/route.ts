import { NextResponse } from 'next/server';
import { getEnvVar } from '@/lib/bindings';

// GET /api/turnstile/sitekey - 返回 Turnstile site key（公开值）
export async function GET() {
  const siteKey = getEnvVar('TURNSTILE_SITE_KEY');
  return NextResponse.json({ siteKey: siteKey || '' });
}
