import { NextResponse } from 'next/server';
import { getDB } from '@/lib/bindings';

// GET /api/platforms/psychological - 线上心理咨询平台
export async function GET() {
  const db = getDB();
  const { results } = await db
    .prepare('SELECT * FROM psychological_platforms ORDER BY created_at DESC')
    .all();
  return NextResponse.json(results);
}
