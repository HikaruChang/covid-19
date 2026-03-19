import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/auth';

// POST /api/admin/logout
export async function POST() {
  const response = NextResponse.json({ message: 'ok' });
  response.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/', httpOnly: true, secure: true, sameSite: 'strict' });
  return response;
}
