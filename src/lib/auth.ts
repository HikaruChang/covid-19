import { getCloudflareContext } from '@opennextjs/cloudflare';
import { cookies } from 'next/headers';

export const COOKIE_NAME = 'admin_token';
export const TOKEN_TTL = 60 * 60 * 8; // 8 hours in seconds

// ─── Password Hashing (PBKDF2 / Web Crypto API) ────────────────────────────

/**
 * 以 PBKDF2-SHA256 雜湊密碼。
 * 格式：pbkdf2:sha256:100000:{salt_hex}:{hash_hex}
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = Array.from(salt).map((b) => b.toString(16).padStart(2, '0')).join('');

  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    key,
    256,
  );
  const hashHex = Array.from(new Uint8Array(bits)).map((b) => b.toString(16).padStart(2, '0')).join('');
  return `pbkdf2:sha256:100000:${saltHex}:${hashHex}`;
}

/** 驗證明文密碼與資料庫中儲存的雜湊是否匹配 */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split(':');
  if (parts.length !== 5 || parts[0] !== 'pbkdf2' || parts[1] !== 'sha256') return false;
  const iterations = parseInt(parts[2], 10);
  const saltHex = parts[3];
  const expectedHash = parts[4];

  const saltBytes = saltHex.match(/.{2}/g);
  if (!saltBytes) return false;
  const salt = new Uint8Array(saltBytes.map((h) => parseInt(h, 16)));

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    key,
    256,
  );
  const actualHash = Array.from(new Uint8Array(bits)).map((b) => b.toString(16).padStart(2, '0')).join('');

  // 常量時間比較，防止時序攻擊
  if (actualHash.length !== expectedHash.length) return false;
  let diff = 0;
  for (let i = 0; i < actualHash.length; i++) {
    diff |= actualHash.charCodeAt(i) ^ expectedHash.charCodeAt(i);
  }
  return diff === 0;
}

// ─── Token Signing (HMAC-SHA256) ────────────────────────────────────────────

async function hmacSign(secret: string, data: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * 生成含 adminId 的帶簽名 token。
 * 格式：{adminId}:{exp}.{HMAC("{adminId}:{exp}", secret)}
 */
export async function generateAdminToken(adminId: number): Promise<string> {
  const { env } = getCloudflareContext();
  const secret = env.ADMIN_TOKEN_SECRET;
  const exp = Math.floor(Date.now() / 1000) + TOKEN_TTL;
  const payload = `${adminId}:${exp}`;
  const sig = await hmacSign(secret, payload);
  return `${payload}.${sig}`;
}

/**
 * 驗證 token，成功時返回 adminId，失敗返回 null。
 */
export async function verifyAdminToken(token: string): Promise<number | null> {
  try {
    const { env } = getCloudflareContext();
    const secret = env.ADMIN_TOKEN_SECRET;
    const dotIdx = token.lastIndexOf('.');
    if (dotIdx < 0) return null;
    const payload = token.slice(0, dotIdx);
    const sig = token.slice(dotIdx + 1);

    // payload = "{adminId}:{exp}"
    const colonIdx = payload.indexOf(':');
    if (colonIdx < 0) return null;
    const adminId = parseInt(payload.slice(0, colonIdx), 10);
    const exp = parseInt(payload.slice(colonIdx + 1), 10);
    if (isNaN(adminId) || isNaN(exp)) return null;
    if (exp < Math.floor(Date.now() / 1000)) return null;

    const expected = await hmacSign(secret, payload);
    if (expected.length !== sig.length) return null;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) {
      diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
    }
    return diff === 0 ? adminId : null;
  } catch {
    return null;
  }
}

// ─── Request-Level Helpers ───────────────────────────────────────────────────

/** 從 cookie 中取得已驗證的 adminId，失敗返回 null */
export async function getAuthenticatedAdminId(): Promise<number | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

/** 布林版本，供各 API route 快速檢查 */
export async function isAdminAuthenticated(): Promise<boolean> {
  return (await getAuthenticatedAdminId()) !== null;
}
