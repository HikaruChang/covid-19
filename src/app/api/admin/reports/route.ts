import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/bindings';
import { isAdminAuthenticated } from '@/lib/auth';

// GET /api/admin/reports
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
    .prepare('SELECT * FROM reports ORDER BY created_at DESC LIMIT ? OFFSET ?')
    .bind(limit, offset)
    .all();
  const { results: countRow } = await db
    .prepare('SELECT COUNT(*) as total FROM reports')
    .all();
  const total = (countRow[0] as any)?.total ?? 0;

  return NextResponse.json({ data: results, total, page, limit });
}

// DELETE /api/admin/reports?id=1
export async function DELETE(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: 'unauthorized' }, { status: 401 });
  }
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ message: 'missing id' }, { status: 400 });

  const db = getDB();
  await db.prepare('DELETE FROM reports WHERE id = ?').bind(id).run();
  return NextResponse.json({ message: 'ok' });
}
