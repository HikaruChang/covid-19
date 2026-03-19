import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/bindings';

// GET /api/epidemic/query?city=北京 - 查询疫情数据（原 robot-wechaty 查询功能）
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  if (city && city.length > 50) {
    return NextResponse.json({ message: 'invalid city' }, { status: 400 });
  }

  const db = getDB();

  if (!city || city === '中国' || city === '全国') {
    const result = await db
      .prepare("SELECT * FROM epidemic_data WHERE area_type = 'country' AND name = '中国'")
      .first();
    return NextResponse.json(result ?? { name: '中国', confirmed: 0, suspected: 0, cured: 0, dead: 0 });
  }

  // 先查省（模糊匹配全名和短名）
  const province = await db
    .prepare("SELECT * FROM epidemic_data WHERE area_type = 'province' AND (name LIKE ? OR short_name LIKE ?)")
    .bind(`%${city}%`, `%${city}%`)
    .first();

  if (province) return NextResponse.json(province);

  // 再查市
  const cityData = await db
    .prepare("SELECT * FROM epidemic_data WHERE area_type = 'city' AND name LIKE ?")
    .bind(`%${city}%`)
    .first();

  if (cityData) return NextResponse.json(cityData);

  return NextResponse.json({ message: 'not found' }, { status: 404 });
}
