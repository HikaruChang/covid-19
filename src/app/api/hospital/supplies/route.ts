import { NextResponse } from 'next/server';
import { getDB } from '@/lib/bindings';

// GET /api/hospital/supplies - 医院物资需求列表（仅返回已核实条目）
export async function GET() {
  const db = getDB();
  const { results: supplies } = await db
    .prepare('SELECT * FROM hospital_supplies WHERE verified = 1 ORDER BY created_at DESC')
    .all();

  // 附加每个需求的物资明细
  for (const supply of supplies as Record<string, unknown>[]) {
    const { results: items } = await db
      .prepare('SELECT * FROM hospital_supply_items WHERE supply_id = ?')
      .bind(supply.id)
      .all();
    supply.items = items;
  }

  return NextResponse.json(supplies);
}
