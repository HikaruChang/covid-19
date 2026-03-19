import { NextRequest, NextResponse } from 'next/server';

// POST /api/locale - 切换语言
export async function POST(request: NextRequest) {
  const { locale } = await request.json() as { locale: string };
  if (!locale || !['zh', 'en'].includes(locale)) {
    return NextResponse.json({ error: 'invalid locale' }, { status: 400 });
  }

  const response = NextResponse.json({ locale });
  response.cookies.set('locale', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
  return response;
}
