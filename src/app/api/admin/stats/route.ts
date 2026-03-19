import { NextResponse } from 'next/server';
import { getDB } from '@/lib/bindings';
import { isAdminAuthenticated } from '@/lib/auth';

// GET /api/admin/stats - 各資料表筆數統計
export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: 'unauthorized' }, { status: 401 });
  }

  const db = getDB();
  const tables = [
    'hospital_supplies',
    'community_supplies',
    'accommodations',
    'reports',
    'epidemic_subscriptions',
  ] as const;

  const counts: Record<string, number> = {};
  for (const table of tables) {
    const { results } = await db
      .prepare(`SELECT COUNT(*) as n FROM ${table}`)
      .all();
    counts[table] = (results[0] as any)?.n ?? 0;
  }

  return NextResponse.json(counts);
}
