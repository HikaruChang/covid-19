import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/bindings';
import { isAdminAuthenticated } from '@/lib/auth';

// POST /api/epidemic/subscribe - 訂閱疫情更新（僅限管理員）
export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: 'unauthorized' }, { status: 401 });
  }

  const body = await request.json() as Record<string, string>;

  const validSubscriberTypes = ['webhook', 'telegram'];
  if (!body.city || !body.subscriberType || !body.subscriberId) {
    return NextResponse.json({ message: 'bad request' }, { status: 400 });
  }
  if (!validSubscriberTypes.includes(body.subscriberType)) {
    return NextResponse.json({ message: 'invalid subscriber_type' }, { status: 400 });
  }

  const db = getDB();
  await db
    .prepare('INSERT OR IGNORE INTO epidemic_subscriptions (city, subscriber_type, subscriber_id) VALUES (?, ?, ?)')
    .bind(body.city, body.subscriberType, body.subscriberId)
    .run();

  return NextResponse.json({ message: 'subscribed' });
}

// DELETE /api/epidemic/subscribe - 取消訂閱（僅限管理員）
export async function DELETE(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: 'unauthorized' }, { status: 401 });
  }

  const body = await request.json() as Record<string, string>;

  if (!body.city || !body.subscriberType || !body.subscriberId) {
    return NextResponse.json({ message: 'bad request' }, { status: 400 });
  }

  const db = getDB();
  await db
    .prepare('DELETE FROM epidemic_subscriptions WHERE city = ? AND subscriber_type = ? AND subscriber_id = ?')
    .bind(body.city, body.subscriberType, body.subscriberId)
    .run();

  return NextResponse.json({ message: 'unsubscribed' });
}
