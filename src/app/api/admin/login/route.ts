import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/bindings';
import { verifyTurnstile } from '@/lib/turnstile';
import { verifyPassword, generateAdminToken, COOKIE_NAME, TOKEN_TTL } from '@/lib/auth';

interface AdminRow {
  id: number;
  username: string;
  password_hash: string;
  display_name: string | null;
}

// POST /api/admin/login
export async function POST(request: NextRequest) {
  const body = await request.json() as { username?: string; password?: string; turnstileToken?: string };

  if (!body.username || !body.password || !body.turnstileToken) {
    return NextResponse.json({ message: '缺少必要參數' }, { status: 400 });
  }

  // 1. 驗證 Turnstile
  const turnstileOk = await verifyTurnstile(body.turnstileToken).catch(() => false);
  if (!turnstileOk) {
    return NextResponse.json({ message: '人機驗證失敗' }, { status: 403 });
  }

  // 2. 從資料庫查詢管理員
  const db = getDB();
  const { results } = await db
    .prepare('SELECT id, username, password_hash, display_name FROM admins WHERE username = ?')
    .bind(body.username)
    .all<AdminRow>();

  const admin = results[0];
  if (!admin) {
    // 仍執行一次假雜湊以防時序攻擊洩漏帳號是否存在
    await verifyPassword('dummy', 'pbkdf2:sha256:100000:00000000000000000000000000000000:0000000000000000000000000000000000000000000000000000000000000000').catch(() => false);
    return NextResponse.json({ message: '帳號或密碼錯誤' }, { status: 401 });
  }

  // 3. 驗證密碼
  const passwordOk = await verifyPassword(body.password, admin.password_hash);
  if (!passwordOk) {
    return NextResponse.json({ message: '帳號或密碼錯誤' }, { status: 401 });
  }

  // 4. 更新最後登入時間（非阻塞）
  db.prepare("UPDATE admins SET last_login_at = datetime('now') WHERE id = ?")
    .bind(admin.id)
    .run()
    .catch(() => { /* ignore */ });

  // 5. 發放 token cookie
  const token = await generateAdminToken(admin.id);
  const response = NextResponse.json({ message: 'ok', displayName: admin.display_name ?? admin.username });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: TOKEN_TTL,
    path: '/',
  });
  return response;
}
