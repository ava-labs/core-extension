import * as fs from 'node:fs';
import * as path from 'node:path';
import type { BrowserContext, Page, Route } from '@playwright/test';
import { MARKR_BASE_URL, MOCK_RPC_URL, type SwapFixture } from '../types/swap';

/**
 * Set `RECORD_FIXTURES=1` to forward Markr/Jupiter requests to the real
 * network and write captured responses back to the matching fixture file.
 * Use this whenever the upstream schema changes (new Markr deployment,
 * etc.). The build's `MARKR_API_TOKEN` is replayed automatically so the
 * extension proxy returns 200 instead of 403.
 */
const RECORD_MODE = process.env.RECORD_FIXTURES === '1';

const FIXTURES_DIR = path.resolve(__dirname, '..', 'fixtures', 'swap');

function fixturePath(name: string): string {
  return path.join(FIXTURES_DIR, `${name}.json`);
}

export function loadSwapFixture(fixtureName: string): SwapFixture {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require(`../fixtures/swap/${fixtureName}.json`);
}

function writeFixturePartial(name: string, patch: Partial<SwapFixture>): void {
  const filePath = fixturePath(name);
  let current: SwapFixture;
  try {
    current = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    current = { pair: patch.pair as SwapFixture['pair'], quote: undefined };
  }
  fs.writeFileSync(filePath, JSON.stringify({ ...current, ...patch }, null, 2));
  console.log(
    `[record] updated ${path.relative(process.cwd(), filePath)} (${Object.keys(patch).join(', ')})`,
  );
}

/**
 * Intercepts swap-related HTTP requests via context.route() and returns
 * fixture data. The current production swap path routes everything —
 * EVM and Solana — through Markr (`MarkrServiceInitializer` accepts both
 * `evmSigner` and `solanaSigner`), so a single Markr mock handler covers
 * all chains. If a future deployment splits Solana traffic back to
 * Jupiter, restore the Jupiter helpers from git history.
 */
export async function setupSwapApiMocks(
  context: BrowserContext,
  fixture: SwapFixture,
): Promise<void> {
  const chain = fixture.pair.chain;

  if (!RECORD_MODE) {
    await installMarkrUrlGuard(context);
  }
  await setupMarkrMocks(context, fixture);

  await context.route('**/proxy/blockaid/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ result_type: 'Benign', simulation: null }),
    });
  });

  // Page-level EVM JSON-RPC → mock RPC server (needed for EVM chains)
  if (chain !== 'solana') {
    const rpcPatterns: Array<[string, string]> = [
      ['**/ext/bc/C/rpc**', ''],
      ['**/ext/bc/eth/rpc**', '/ethereum'],
      ['**proxy-api.avax.network/proxy/chain/C/rpc**', ''],
      ['**proxy-api.avax.network/proxy/chain/8453/rpc**', '/base'],
      ['**glacier-api.avax.network**/rpc**', ''],
      ['**mainnet.base.org**', '/base'],
      ['**base-rpc.publicnode.com**', '/base'],
      [`${MOCK_RPC_URL}**`, ''],
      [`${MOCK_RPC_URL}/ethereum**`, '/ethereum'],
      [`${MOCK_RPC_URL}/base**`, '/base'],
    ];

    for (const [pattern, suffix] of rpcPatterns) {
      await context.route(pattern, (route) => proxyToMockRpc(route, suffix));
    }
  }
}

/**
 * Catches Markr-shaped URLs that don't match `MARKR_BASE_URL`. This is the
 * silent-bypass scenario: if the build's `MARKR_API_URL` ever drifts from
 * the constant in `swap.ts`, the mock routes installed below won't fire
 * and tests would pass against the real network. Failing loud here makes
 * that drift impossible to miss.
 *
 * Install order matters: this guard is added FIRST so the specific mock
 * routes (added after) take precedence for matching URLs. Playwright
 * routes are last-added-first-served, so non-matching URLs fall through
 * to this guard.
 */
async function installMarkrUrlGuard(context: BrowserContext): Promise<void> {
  await context.route('**/proxy/markr*/**', async (route) => {
    const url = route.request().url();
    if (url.startsWith(MARKR_BASE_URL)) {
      await route.fallback();
      return;
    }
    const msg =
      `[swap-mock] Unmocked Markr request: ${url}\n` +
      `Expected prefix: ${MARKR_BASE_URL}\n` +
      `The build's MARKR_API_URL no longer matches MARKR_BASE_URL in ` +
      `e2e/types/swap.ts. Update the constant, then refresh fixtures with ` +
      `RECORD_FIXTURES=1.`;
    await route.abort();
    throw new Error(msg);
  });
}

async function setupMarkrMocks(
  context: BrowserContext,
  fixture: SwapFixture,
): Promise<void> {
  if (RECORD_MODE) {
    await setupMarkrRecordMode(context, fixture);
    return;
  }

  await context.route(`${MARKR_BASE_URL}/quote`, async (route) => {
    await route.fulfill({
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
      body: buildSsePayload(refreshExpiry(fixture.quote)),
    });
  });

  await context.route(`${MARKR_BASE_URL}/swap`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(
        fixture.swapTx ?? {
          to: '0x' + 'bb'.repeat(20),
          data: '0x12345678',
          value: '0x0',
        },
      ),
    });
  });

  await context.route(`${MARKR_BASE_URL}/spender-address*`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        address: fixture.spenderAddress ?? '0x' + 'cc'.repeat(20),
      }),
    });
  });
}

async function setupMarkrRecordMode(
  context: BrowserContext,
  fixture: SwapFixture,
): Promise<void> {
  // Passive observation. Cloudflare on the Markr edge blocks
  // `route.fetch()` replays from Node (TLS-fingerprint check), so we let the
  // original browser-originated request pass through unrouted and just
  // listen on the response.
  const fixtureName = fixture.pair.fixture;

  context.on('response', async (response) => {
    const url = response.url();
    if (!url.includes(MARKR_BASE_URL)) return;
    if (response.status() !== 200) return;

    const body = await response.text().catch(() => null);
    if (body === null) return;

    if (url.endsWith('/quote')) {
      const events = parseSseEvents(body);
      if (events.length > 0) {
        writeFixturePartial(fixtureName, {
          pair: fixture.pair,
          quote: events,
        });
      }
    } else if (url.endsWith('/swap')) {
      try {
        writeFixturePartial(fixtureName, {
          swapTx: JSON.parse(body) as SwapFixture['swapTx'],
        });
      } catch {
        /* non-JSON */
      }
    } else if (url.includes('/spender-address')) {
      try {
        const json = JSON.parse(body) as { address?: string };
        if (json?.address) {
          writeFixturePartial(fixtureName, { spenderAddress: json.address });
        }
      } catch {
        /* non-JSON */
      }
    }
  });
}

export async function teardownSwapApiMocks(
  context: BrowserContext,
): Promise<void> {
  await context.unrouteAll({ behavior: 'ignoreErrors' });
}

/**
 * Enables Quick Swaps (Degen Mode) so the swap flow uses quote.gasEstimate
 * instead of calling provider.estimateGas(). Required for EVM mock tests where
 * the tx calldata can't pass real gas estimation.
 */
export async function enableQuickSwaps(page: Page): Promise<void> {
  const result = await page.evaluate(async () => {
    return new Promise<{ success: boolean; error?: string }>(
      (resolve, reject) => {
        const timeout = setTimeout(
          () => reject(new Error('enableQuickSwaps timed out after 15s')),
          15_000,
        );

        const port = chrome.runtime.connect({ name: 'avalanche-extension' });
        const requestId = `settings_set_degen_mode-${Date.now()}`;
        const sessionId = crypto.randomUUID();

        const message = JSON.stringify({
          id: requestId,
          jsonrpc: '2.0',
          method: 'provider_request',
          params: {
            sessionId,
            scope: '',
            request: {
              id: requestId,
              method: 'settings_set_degen_mode',
              params: [true],
            },
          },
          context: { tabId: 99999 },
        });

        port.onMessage.addListener((response: string) => {
          try {
            const parsed = JSON.parse(response);
            if (parsed.id === requestId) {
              clearTimeout(timeout);
              port.disconnect();
              resolve(
                parsed.error
                  ? { success: false, error: JSON.stringify(parsed.error) }
                  : { success: true },
              );
            }
          } catch {
            /* ignore non-matching messages */
          }
        });

        port.postMessage(message);
      },
    );
  });

  if (!result.success) {
    throw new Error(`Failed to enable Quick Swaps: ${result.error}`);
  }
}

function buildSsePayload(quoteData: unknown): string {
  const items = Array.isArray(quoteData) ? quoteData : [quoteData];
  return items.map((item) => `data:${JSON.stringify(item)}\n\n`).join('');
}

/**
 * Markr quotes carry an `expiredAt` (unix seconds). Replay rewrites it to a
 * far-future value so fixtures recorded at any point in time stay valid.
 */
function refreshExpiry(quoteData: unknown): unknown {
  const farFuture = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365;
  const items = Array.isArray(quoteData) ? quoteData : [quoteData];
  return items.map((item) => {
    if (item && typeof item === 'object' && 'expiredAt' in item) {
      return { ...(item as Record<string, unknown>), expiredAt: farFuture };
    }
    return item;
  });
}

function parseSseEvents(body: string): unknown[] {
  const events: unknown[] = [];
  for (const line of body.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('data:')) continue;
    try {
      events.push(JSON.parse(trimmed.slice(5).trim()));
    } catch {
      /* skip non-JSON */
    }
  }
  return events;
}

async function proxyToMockRpc(route: Route, pathSuffix = ''): Promise<void> {
  const postData = route.request().postData();
  if (!postData) {
    await route.fallback();
    return;
  }

  try {
    const response = await fetch(`${MOCK_RPC_URL}${pathSuffix}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: postData,
    });
    await route.fulfill({
      status: response.status,
      contentType: 'application/json',
      body: await response.text(),
    });
  } catch {
    await route.fallback();
  }
}
