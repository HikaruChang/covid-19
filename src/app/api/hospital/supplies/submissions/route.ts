import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/bindings';
import { notifyAdmins } from '@/lib/notify';
import { formatHospitalSubmission } from '@/lib/templates';
import { verifyTurnstile } from '@/lib/turnstile';
import type { HospitalSubmissionRequest } from '@/types';

// POST /api/hospital/supplies/submissions - 提交医院物资需求
export async function POST(request: NextRequest) {
  const body: HospitalSubmissionRequest & { turnstileToken?: string } = await request.json();

  if (!body.turnstileToken) {
    return NextResponse.json({ message: '人机验证失败' }, { status: 403 });
  }
  const turnstileOk = await verifyTurnstile(body.turnstileToken);
  if (!turnstileOk) {
    return NextResponse.json({ message: '人机验证失败' }, { status: 403 });
  }

  // 验证必填字段
  if (!body.name || !body.province || !body.city || !body.suburb || !body.address ||
    !body.contactOrg || !body.contactPhone || !body.supplies || !body.pathways) {
    return NextResponse.json({ message: 'bad request' }, { status: 400 });
  }

  if (!Array.isArray(body.supplies) || body.supplies.length > 50) {
    return NextResponse.json({ message: 'too many items' }, { status: 400 });
  }

  const db = getDB();

  // 插入主记录
  const result = await db
    .prepare(`INSERT INTO hospital_supplies 
      (name, province, city, suburb, address, patients, beds, contact_name, contact_org, contact_phone, pathways, logistic_status, source, proof, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(
      body.name, body.province, body.city, body.suburb, body.address,
      body.patients ?? '', body.beds ?? '', body.contactName ?? '',
      body.contactOrg, body.contactPhone, body.pathways,
      body.logisticStatus ?? '', body.source ?? '', body.proof ?? '', body.notes ?? ''
    )
    .run();

  const supplyId = result.meta.last_row_id;

  // 批量插入物资明细（原子操作）
  const itemStmts = body.supplies.map((item) =>
    db.prepare(`INSERT INTO hospital_supply_items (supply_id, name, unit, need, daily, have, requirements)
      VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .bind(supplyId, item.name, item.unit, item.need, item.daily, item.have, item.requirements)
  );
  if (itemStmts.length > 0) {
    await db.batch(itemStmts);
  }

  // 异步发送 Telegram 通知
  const message = formatHospitalSubmission(body);
  notifyAdmins(message).catch(console.error);

  return new NextResponse(null, { status: 204 });
}
