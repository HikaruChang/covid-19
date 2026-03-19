import { NextResponse } from 'next/server';
import { getDB } from '@/lib/bindings';

// GET /api/accommodations - 医护人员免费住宿列表
export async function GET() {
  const db = getDB();
  const { results } = await db
    .prepare('SELECT * FROM accommodations ORDER BY created_at DESC')
    .all();
  return NextResponse.json(results);
}
