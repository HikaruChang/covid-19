import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/bindings';
import { notifyAdmins } from '@/lib/notify';
import { formatReport } from '@/lib/templates';
import { verifyTurnstile } from '@/lib/turnstile';

// POST /api/report - 提交信息纠错
export async function POST(request: NextRequest) {
  const body = await request.json() as Record<string, string>;

  if (!body.type || !body.cause || !body.content || !body.turnstileToken) {
    return NextResponse.json({ message: 'bad request' }, { status: 400 });
  }

  const VALID_TYPES = ['general', 'peopleAccommodations', 'accommodations', 'supplies', 'medicalPlatform', 'psychologicalPlatform'];
  if (!VALID_TYPES.includes(body.type)) {
    return NextResponse.json({ message: 'bad request' }, { status: 400 });
  }
  if (body.cause.length > 200 || body.content.length > 2000) {
    return NextResponse.json({ message: 'bad request' }, { status: 400 });
  }

  const turnstileOk = await verifyTurnstile(body.turnstileToken);
  if (!turnstileOk) {
    return NextResponse.json({ message: '人机验证失败' }, { status: 403 });
  }

  const db = getDB();
  await db
    .prepare('INSERT INTO reports (type, cause, content) VALUES (?, ?, ?)')
    .bind(body.type, body.cause, body.content)
    .run();

  const message = formatReport(body.type, body.cause, body.content);
  notifyAdmins(message).catch(console.error);

  return new NextResponse(null, { status: 204 });
}
