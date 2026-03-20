import { NextResponse } from 'next/server';
import { getDB } from '@/lib/bindings';

// GET /api/community/supplies - 社区物资需求列表（仅返回已核实条目）
export async function GET() {
  const db = getDB();
  const { results: supplies } = await db
    .prepare('SELECT * FROM community_supplies WHERE verified = 1 ORDER BY created_at DESC')
    .all();

  if (supplies.length === 0) return NextResponse.json([]);

  // 批量查询所有物资明细，避免 N+1 问题
  const ids = (supplies as Record<string, unknown>[]).map((s) => s.id);
  const placeholders = ids.map(() => '?').join(',');
  const { results: allItems } = await db
    .prepare(`SELECT * FROM community_supply_items WHERE community_supply_id IN (${placeholders})`)
    .bind(...ids)
    .all();

  // 按 community_supply_id 和 type 分组
  const medicalBySupply = new Map<unknown, unknown[]>();
  const liveBySupply = new Map<unknown, unknown[]>();
  for (const item of allItems as Record<string, unknown>[]) {
    const target = item.type === 'medical' ? medicalBySupply : liveBySupply;
    const list = target.get(item.community_supply_id) ?? [];
    list.push(item);
    target.set(item.community_supply_id, list);
  }

  for (const supply of supplies as Record<string, unknown>[]) {
    supply.medicalSupplies = medicalBySupply.get(supply.id) ?? [];
    supply.liveSupplies = liveBySupply.get(supply.id) ?? [];
  }

  return NextResponse.json(supplies);
}
