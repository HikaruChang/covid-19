import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'admin_token';

/**
 * Middleware（Edge Runtime）：保護 /admin/* 路徑。
 * 僅做 cookie 存在 + 基本格式（payload.sig，exp 未過期）檢查。
 * 完整的 HMAC 驗證在各 API route 及 Server Component 中執行。
 */
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin/login 本身不保護
  if (pathname.startsWith('/admin/login')) return NextResponse.next();

  const token = request.cookies.get(COOKIE_NAME)?.value ?? '';
  if (isTokenShapeValid(token)) return NextResponse.next();

  const loginUrl = new URL('/admin/login', request.url);
  loginUrl.searchParams.set('next', pathname);
  return NextResponse.redirect(loginUrl);
}

function isTokenShapeValid(token: string): boolean {
  if (!token) return false;
  const dotIdx = token.lastIndexOf('.');
  if (dotIdx < 0) return false;
  // payload format: "{adminId}:{exp}"
  const payload = token.slice(0, dotIdx);
  const colonIdx = payload.indexOf(':');
  if (colonIdx < 0) return false;
  const exp = parseInt(payload.slice(colonIdx + 1), 10);
  if (isNaN(exp)) return false;
  return exp > Math.floor(Date.now() / 1000);
}

export const config = {
  matcher: ['/admin/:path*'],
};
