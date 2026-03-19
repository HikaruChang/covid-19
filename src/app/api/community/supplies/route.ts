import { NextResponse } from 'next/server';
import { getDB } from '@/lib/bindings';

// GET /api/community/supplies - 社区物资需求列表（仅返回已核实条目）
export async function GET() {
  const db = getDB();
  const { results: supplies } = await db
    .prepare('SELECT * FROM community_supplies WHERE verified = 1 ORDER BY created_at DESC')
    .all();

  for (const supply of supplies as Record<string, unknown>[]) {
    const { results: medicalItems } = await db
      .prepare("SELECT * FROM community_supply_items WHERE community_supply_id = ? AND type = 'medical'")
      .bind(supply.id)
      .all();
    const { results: liveItems } = await db
      .prepare("SELECT * FROM community_supply_items WHERE community_supply_id = ? AND type = 'live'")
      .bind(supply.id)
      .all();
    supply.medicalSupplies = medicalItems;
    supply.liveSupplies = liveItems;
  }

  return NextResponse.json(supplies);
}
