import { getCloudflareContext } from '@opennextjs/cloudflare';

/** 获取 D1 数据库实例 */
export function getDB(): D1Database {
  return getCloudflareContext().env.DB;
}

/** 获取 R2 存储桶实例 */
export function getR2(): R2Bucket {
  return getCloudflareContext().env.R2;
}

/** 获取环境变量 */
export function getEnvVar(key: string): string {
  return (getCloudflareContext().env as unknown as Record<string, string>)[key] ?? '';
}
