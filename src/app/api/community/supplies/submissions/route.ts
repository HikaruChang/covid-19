import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/bindings';
import { notifyAdmins } from '@/lib/notify';
import { formatCommunitySubmission } from '@/lib/templates';
import { verifyTurnstile } from '@/lib/turnstile';
import type { CommunitySubmissionRequest } from '@/types';

// POST /api/community/supplies/submissions - 提交社区物资需求
export async function POST(request: NextRequest) {
  const body: CommunitySubmissionRequest & { turnstileToken?: string } = await request.json();

  if (!body.turnstileToken) {
    return NextResponse.json({ message: '人机验证失败' }, { status: 403 });
  }
  const turnstileOk = await verifyTurnstile(body.turnstileToken);
  if (!turnstileOk) {
    return NextResponse.json({ message: '人机验证失败' }, { status: 403 });
  }

  if (!body.name || !body.age || !body.province || !body.city || !body.suburb || !body.address) {
    return NextResponse.json({ message: 'bad request' }, { status: 400 });
  }

  if (body.medicalSupplies && !Array.isArray(body.medicalSupplies)) {
    return NextResponse.json({ message: 'medicalSupplies must be array' }, { status: 400 });
  }
  if (body.liveSupplies && !Array.isArray(body.liveSupplies)) {
    return NextResponse.json({ message: 'liveSupplies must be array' }, { status: 400 });
  }

  const MAX_ITEMS = 50;
  if ((body.medicalSupplies?.length ?? 0) > MAX_ITEMS || (body.liveSupplies?.length ?? 0) > MAX_ITEMS) {
    return NextResponse.json({ message: 'too many items' }, { status: 400 });
  }

  const db = getDB();

  const result = await db
    .prepare(`INSERT INTO community_supplies
      (name, age, province, city, suburb, address, contact_phone, agent_name, agent_contact_phone, needs_vehicle, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(
      body.name, body.age, body.province, body.city, body.suburb, body.address,
      body.contactPhone ?? '', body.agentName ?? '', body.agentContactPhone ?? '',
      body.needsVehicle ? 1 : 0, body.notes ?? ''
    )
    .run();

  const supplyId = result.meta.last_row_id;

  // 批量插入物资明细（原子操作）
  const itemStmts: D1PreparedStatement[] = [];
  if (body.medicalSupplies) {
    for (const item of body.medicalSupplies) {
      itemStmts.push(
        db.prepare(`INSERT INTO community_supply_items (community_supply_id, type, name, unit, need, daily, have, requirements)
          VALUES (?, 'medical', ?, ?, ?, ?, ?, ?)`)
          .bind(supplyId, item.name, item.unit ?? '', item.need ?? '', item.daily ?? '', item.have ?? '', item.requirements ?? '')
      );
    }
  }

  if (body.liveSupplies) {
    for (const item of body.liveSupplies) {
      itemStmts.push(
        db.prepare(`INSERT INTO community_supply_items (community_supply_id, type, name, unit, need, daily, have, requirements)
          VALUES (?, 'live', ?, ?, ?, ?, ?, ?)`)
          .bind(supplyId, item.name, item.unit ?? '', item.need ?? '', item.daily ?? '', item.have ?? '', item.requirements ?? '')
      );
    }
  }

  if (itemStmts.length > 0) {
    await db.batch(itemStmts);
  }

  // 异步发送 Telegram 通知
  const message = formatCommunitySubmission(body);
  notifyAdmins(message).catch(console.error);

  return new NextResponse(null, { status: 204 });
}
