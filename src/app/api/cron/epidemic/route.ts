import { NextRequest, NextResponse } from 'next/server';
import { getDB, getEnvVar } from '@/lib/bindings';
import type { EpidemicApiProvince } from '@/types';

// GET /api/cron/epidemic - 定时抓取疫情数据并更新 D1
// 该路由可被 Cloudflare Cron Triggers 调用（Cron Triggers 会自动携带 cf-cron 头）
// 也可通过 Authorization: Bearer <CRON_SECRET> 手动触发
export async function GET(request: NextRequest) {
  // 若非 Cloudflare Cron Trigger，要求 Authorization header
  const isCronTrigger = request.headers.get('x-cloudflare-cron') !== null;
  if (!isCronTrigger) {
    const cronSecret = getEnvVar('CRON_SECRET');
    const authHeader = request.headers.get('authorization') ?? '';
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
  }

  const apiUrl = getEnvVar('EPIDEMIC_API_URL');
  if (!apiUrl) {
    return NextResponse.json({ error: 'EPIDEMIC_API_URL not configured' }, { status: 500 });
  }

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) {
      return NextResponse.json({ error: `Upstream API returned ${res.status}` }, { status: 502 });
    }

    const json = await res.json() as { data: { listByArea: EpidemicApiProvince[] } };
    const listByArea = json.data?.listByArea;
    if (!listByArea?.length) {
      return NextResponse.json({ error: 'No data from upstream' }, { status: 502 });
    }

    const db = getDB();

    // Aggregate country-level totals
    let countryConfirmed = 0;
    let countrySuspected = 0;
    let countryCured = 0;
    let countryDead = 0;

    const stmts: D1PreparedStatement[] = [];

    for (const province of listByArea) {
      countryConfirmed += province.confirmed;
      countrySuspected += province.suspected;
      countryCured += province.cured;
      countryDead += province.dead;

      // Upsert province
      stmts.push(
        db.prepare(
          `INSERT INTO epidemic_data (area_type, name, short_name, confirmed, suspected, cured, dead, updated_at)
           VALUES ('province', ?, ?, ?, ?, ?, ?, datetime('now'))
           ON CONFLICT(area_type, name) DO UPDATE SET
             short_name = excluded.short_name,
             confirmed = excluded.confirmed,
             suspected = excluded.suspected,
             cured = excluded.cured,
             dead = excluded.dead,
             updated_at = datetime('now')`
        ).bind(
          province.provinceName,
          province.provinceShortName,
          province.confirmed,
          province.suspected,
          province.cured,
          province.dead,
        )
      );

      // Upsert cities
      for (const city of province.cities || []) {
        stmts.push(
          db.prepare(
            `INSERT INTO epidemic_data (area_type, name, parent_name, confirmed, suspected, cured, dead, updated_at)
             VALUES ('city', ?, ?, ?, ?, ?, ?, datetime('now'))
             ON CONFLICT(area_type, name) DO UPDATE SET
               parent_name = excluded.parent_name,
               confirmed = excluded.confirmed,
               suspected = excluded.suspected,
               cured = excluded.cured,
               dead = excluded.dead,
               updated_at = datetime('now')`
          ).bind(
            city.cityName,
            province.provinceName,
            city.confirmed,
            city.suspected,
            city.cured,
            city.dead,
          )
        );
      }
    }

    // Upsert country
    stmts.push(
      db.prepare(
        `INSERT INTO epidemic_data (area_type, name, confirmed, suspected, cured, dead, updated_at)
         VALUES ('country', '中国', ?, ?, ?, ?, datetime('now'))
         ON CONFLICT(area_type, name) DO UPDATE SET
           confirmed = excluded.confirmed,
           suspected = excluded.suspected,
           cured = excluded.cured,
           dead = excluded.dead,
           updated_at = datetime('now')`
      ).bind(countryConfirmed, countrySuspected, countryCured, countryDead)
    );

    // Execute all in batch
    await db.batch(stmts);

    return NextResponse.json({
      success: true,
      provinces: listByArea.length,
      total: { confirmed: countryConfirmed, suspected: countrySuspected, cured: countryCured, dead: countryDead },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
