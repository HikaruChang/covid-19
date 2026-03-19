import { NextResponse } from 'next/server';
import { getDB } from '@/lib/bindings';

// GET /api/people/accommodations - 武汉在外人员住宿
export async function GET() {
  const db = getDB();
  const { results } = await db
    .prepare('SELECT * FROM people_accommodations ORDER BY created_at DESC')
    .all();
  return NextResponse.json(results);
}
