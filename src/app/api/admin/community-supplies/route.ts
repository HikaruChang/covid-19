import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/bindings';
import { isAdminAuthenticated } from '@/lib/auth';

// GET /api/admin/community-supplies
export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: 'unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit = 20;
  const offset = (page - 1) * limit;

  const db = getDB();
  const { results } = await db
    .prepare('SELECT * FROM community_supplies ORDER BY created_at DESC LIMIT ? OFFSET ?')
    .bind(limit, offset)
    .all();
  const { results: countRow } = await db
    .prepare('SELECT COUNT(*) as total FROM community_supplies')
    .all();
  const total = (countRow[0] as any)?.total ?? 0;

  return NextResponse.json({ data: results, total, page, limit });
}

// PATCH /api/admin/community-supplies?id=1 - 切换核实状态
export async function PATCH(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: 'unauthorized' }, { status: 401 });
  }
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ message: 'missing id' }, { status: 400 });
  const body = await request.json() as { verified?: number };

  const db = getDB();
  await db
    .prepare('UPDATE community_supplies SET verified = ? WHERE id = ?')
    .bind(body.verified ?? 1, id)
    .run();
  return NextResponse.json({ message: 'ok' });
}

// DELETE /api/admin/community-supplies?id=1
export async function DELETE(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: 'unauthorized' }, { status: 401 });
  }
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ message: 'missing id' }, { status: 400 });

  const db = getDB();
  await db.batch([
    db.prepare('DELETE FROM community_supply_items WHERE community_supply_id = ?').bind(id),
    db.prepare('DELETE FROM community_supplies WHERE id = ?').bind(id),
  ]);
  return NextResponse.json({ message: 'ok' });
}
