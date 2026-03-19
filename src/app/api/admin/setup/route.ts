import { NextResponse } from 'next/server';

// 此端點已停用。新增管理員請直接操作 D1 資料庫。
export async function POST() {
  return NextResponse.json({ message: 'not found' }, { status: 404 });
}
