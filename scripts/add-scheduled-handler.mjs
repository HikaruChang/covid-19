/**
 * Post-build script: appends a `scheduled()` export to `.open-next/worker.js`
 * so that Cloudflare Cron Triggers can invoke the epidemic data fetch route.
 *
 * The generated worker.js already imports `runWithCloudflareRequestContext`
 * and `middlewareHandler` at the top level, so they are in scope here.
 *
 * Usage: node scripts/add-scheduled-handler.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';

const workerPath = '.open-next/worker.js';

const content = readFileSync(workerPath, 'utf-8');

// Sanity check: make sure the scheduled export doesn't already exist.
if (content.includes('export async function scheduled')) {
  console.log('ℹ️  scheduled() handler already present in worker.js, skipping.');
  process.exit(0);
}

const scheduledExport = `

// ---------------------------------------------------------------------------
// Cron trigger handler – appended by scripts/add-scheduled-handler.mjs
// Called by Cloudflare on the schedule defined in wrangler.toml.
// Routes the cron event through the same Next.js pipeline as a normal fetch.
// ---------------------------------------------------------------------------
export async function scheduled(event, env, ctx) {
  // Use a placeholder URL – routing is determined by the path, not the host.
  const request = new Request('https://covid-19.rua.moe/api/cron/epidemic', {
    method: 'GET',
    headers: {
      // The cron route checks this header to bypass Bearer auth.
      'x-cloudflare-cron': '1',
    },
  });

  const response = await runWithCloudflareRequestContext(request, env, ctx, async () => {
    const reqOrResp = await middlewareHandler(request, env, ctx);
    if (reqOrResp instanceof Response) return reqOrResp;
    // @ts-expect-error: resolved by wrangler build
    const { handler } = await import('./server-functions/default/handler.mjs');
    return handler(reqOrResp, env, ctx, request.signal);
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '(no body)');
    throw new Error(\`Cron job failed with status \${response.status}: \${body}\`);
  }

  console.log('[cron] Epidemic data updated successfully.');
}
`;

writeFileSync(workerPath, content + scheduledExport);
console.log('✅ Added scheduled() export to .open-next/worker.js');
