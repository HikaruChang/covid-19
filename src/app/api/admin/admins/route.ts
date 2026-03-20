import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/bindings';
import { isAdminAuthenticated, getAuthenticatedAdminId, hashPassword } from '@/lib/auth';

// GET /api/admin/admins - 列出所有管理員（不包含密碼雜湊）
export async function GET() {
  const callerId = await getAuthenticatedAdminId();
  if (callerId === null) {
    return NextResponse.json({ message: 'unauthorized' }, { status: 401 });
  }

  const db = getDB();
  const { results } = await db
    .prepare('SELECT id, username, display_name, created_at, last_login_at FROM admins ORDER BY created_at ASC')
    .all();
  return NextResponse.json({ data: results, currentAdminId: callerId });
}

// POST /api/admin/admins - 新增管理員
export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: 'unauthorized' }, { status: 401 });
  }

  const body = await request.json() as { username?: string; password?: string; displayName?: string };
  if (!body.username || !body.password) {
    return NextResponse.json({ message: '缺少 username 或 password' }, { status: 400 });
  }
  if (body.username.length > 64 || (body.displayName && body.displayName.length > 128)) {
    return NextResponse.json({ message: '欄位過長' }, { status: 400 });
  }
  if (body.password.length < 8 || body.password.length > 256) {
    return NextResponse.json({ message: '密碼長度需在 8–256 個字元之間' }, { status: 422 });
  }

  const hash = await hashPassword(body.password);
  const db = getDB();
  try {
    const { meta } = await db
      .prepare('INSERT INTO admins (username, password_hash, display_name) VALUES (?, ?, ?)')
      .bind(body.username, hash, body.displayName ?? body.username)
      .run();
    return NextResponse.json({ message: 'ok', id: meta.last_row_id }, { status: 201 });
  } catch (e: any) {
    if (String(e).includes('UNIQUE')) {
      return NextResponse.json({ message: '帳號已存在' }, { status: 409 });
    }
    throw e;
  }
}

// DELETE /api/admin/admins?id=1 - 刪除管理員
export async function DELETE(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: 'unauthorized' }, { status: 401 });
  }

  const id = new URL(request.url).searchParams.get('id');
  if (!id || !/^\d+$/.test(id)) return NextResponse.json({ message: 'invalid id' }, { status: 400 });

  // 禁止刪除最後一個管理員
  const db = getDB();
  const { results } = await db.prepare('SELECT COUNT(*) as n FROM admins').all();
  const count = (results[0] as any)?.n ?? 0;
  if (count <= 1) {
    return NextResponse.json({ message: '至少需保留一個管理員帳號' }, { status: 422 });
  }

  await db.prepare('DELETE FROM admins WHERE id = ?').bind(id).run();
  return NextResponse.json({ message: 'ok' });
}

// PATCH /api/admin/admins?id=1 - 修改密碼（只能修改自己的）
export async function PATCH(request: NextRequest) {
  const callerId = await getAuthenticatedAdminId();
  if (callerId === null) {
    return NextResponse.json({ message: 'unauthorized' }, { status: 401 });
  }

  const id = new URL(request.url).searchParams.get('id');
  if (!id || !/^\d+$/.test(id)) return NextResponse.json({ message: 'invalid id' }, { status: 400 });

  if (callerId !== parseInt(id, 10)) {
    return NextResponse.json({ message: '只能修改自己的密碼' }, { status: 403 });
  }

  const body = await request.json() as { password?: string };
  if (!body.password || body.password.length < 8 || body.password.length > 256) {
    return NextResponse.json({ message: '密碼長度需在 8–256 個字元之間' }, { status: 422 });
  }

  const hash = await hashPassword(body.password);
  const db = getDB();
  await db.prepare('UPDATE admins SET password_hash = ? WHERE id = ?').bind(hash, id).run();
  return NextResponse.json({ message: 'ok' });
}
