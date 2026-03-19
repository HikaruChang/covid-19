import { getEnvVar } from './bindings';

/**
 * 发送 Telegram 通知（替代原 notify.go）
 */
export async function notifyAdmins(message: string): Promise<void> {
  const botToken = getEnvVar('TELEGRAM_BOT_TOKEN');
  const chatId = getEnvVar('TELEGRAM_CHAT_ID');

  if (!botToken || !chatId) {
    console.warn('Telegram bot not configured');
    return;
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`Telegram notification failed (${res.status}): ${text}`);
  }
}
