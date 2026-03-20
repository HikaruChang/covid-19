import { NextResponse } from 'next/server';
import { getDB } from '@/lib/bindings';

// GET /api/hospital/supplies - 医院物资需求列表（仅返回已核实条目）
export async function GET() {
  const db = getDB();
  const { results: supplies } = await db
    .prepare('SELECT * FROM hospital_supplies WHERE verified = 1 ORDER BY created_at DESC')
    .all();

  if (supplies.length === 0) return NextResponse.json([]);

  // 批量查询所有物资明细，避免 N+1 问题
  const ids = (supplies as Record<string, unknown>[]).map((s) => s.id);
  const placeholders = ids.map(() => '?').join(',');
  const { results: allItems } = await db
    .prepare(`SELECT * FROM hospital_supply_items WHERE supply_id IN (${placeholders})`)
    .bind(...ids)
    .all();

  // 按 supply_id 分组
  const itemsBySupply = new Map<unknown, unknown[]>();
  for (const item of allItems as Record<string, unknown>[]) {
    const list = itemsBySupply.get(item.supply_id) ?? [];
    list.push(item);
    itemsBySupply.set(item.supply_id, list);
  }

  for (const supply of supplies as Record<string, unknown>[]) {
    supply.items = itemsBySupply.get(supply.id) ?? [];
  }

  return NextResponse.json(supplies);
}
