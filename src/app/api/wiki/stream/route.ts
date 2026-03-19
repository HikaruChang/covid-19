import { NextResponse } from 'next/server';
import { getDB } from '@/lib/bindings';

// GET /api/wiki/stream - 信息看板
export async function GET() {
  const db = getDB();
  const { results } = await db
    .prepare('SELECT * FROM wiki_streams ORDER BY created_at DESC LIMIT 100')
    .all();
  return NextResponse.json(results);
}
