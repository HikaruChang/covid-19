import { NextResponse } from 'next/server';
import { getDB } from '@/lib/bindings';

// GET /api/platforms/medical - 线上医疗诊断平台
export async function GET() {
  const db = getDB();
  const { results } = await db
    .prepare('SELECT * FROM medical_platforms ORDER BY created_at DESC')
    .all();
  return NextResponse.json(results);
}
