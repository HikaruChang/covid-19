/// <reference types="@cloudflare/workers-types" />

// Cloudflare bindings 类型声明（通过 interface merging 扩展 @opennextjs/cloudflare 的全局 CloudflareEnv）
interface CloudflareEnv {
  DB: D1Database;
  R2: R2Bucket;
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
  EPIDEMIC_API_URL: string;
  TURNSTILE_SITE_KEY: string;
  TURNSTILE_SECRET_KEY: string;
  ADMIN_TOKEN_SECRET: string;
  CRON_SECRET: string;
}
