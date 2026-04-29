import type { BrowserContext, Page, Route } from '@playwright/test';
import {
  MARKR_BASE_URL,
  JUPITER_BASE_URL,
  MOCK_RPC_URL,
  type SwapFixture,
} from '../types/swap';

export function loadSwapFixture(fixtureName: string): SwapFixture {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require(`../fixtures/swap/${fixtureName}.json`);
}

/**
 * Intercepts swap-related HTTP requests via context.route() and returns
 * fixture data. Automatically selects Markr (EVM) or Jupiter (Solana)
 * routes based on the fixture's chain field.
 */
export async function setupSwapApiMocks(
  context: BrowserContext,
  fixture: SwapFixture,
): Promise<void> {
  const chain = fixture.pair.chain;

  if (chain === 'solana') {
    await setupJupiterMocks(context, fixture);
  } else {
    await setupMarkrMocks(context, fixture);
  }

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

async function setupMarkrMocks(
  context: BrowserContext,
  fixture: SwapFixture,
): Promise<void> {
  // KNOWN ISSUE — env-coupled mock URL.
  //
  // `MARKR_BASE_URL` here is the prod Markr path. The extension's actual Markr
  // endpoint is driven by `MARKR_API_URL` at build time (e.g. dev builds use
  // `…/markr-helium`, staging uses `…/markr-staging`). When the build's URL
  // doesn't match the constant, these route handlers don't fire and Markr
  // requests fall through to the real network — the swap-mock tests then
  // "pass" against live data instead of fixtures.
  //
  // Switching to a wildcard or regex (e.g. `**/markr*/quote`) makes the
  // routes intercept correctly, but the recorded fixtures are tied to a
  // specific Markr SSE schema and other deployments may emit a different
  // shape. Until fixtures are re-recorded against the build's actual Markr
  // endpoint, leave the exact-URL match in place. Fix tracked separately.
  await context.route(`${MARKR_BASE_URL}/quote`, async (route) => {
    await route.fulfill({
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
      body: buildSsePayload(fixture.quote),
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

async function setupJupiterMocks(
  context: BrowserContext,
  fixture: SwapFixture,
): Promise<void> {
  await context.route(`${JUPITER_BASE_URL}/quote**`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(fixture.quote),
    });
  });

  await context.route(`${JUPITER_BASE_URL}/swap`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(
        fixture.jupiterSwapTx ?? {
          swapTransaction:
            'AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEDBBQWOH6Ccz5wKuERRESRdSxWSxFR4noJHc+VxXxNFKIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMGRm/lIRcy/+ytunLDm+e8jOW7xfcSayxDmzpAAAAAbQreB/SHw7Sgz3BaIaqm1sHEzIiPxJsunRBHwzqSVIYBAgIAAQwCAAAAoIYBAAAAAAA=',
          simulationError: null,
        },
      ),
    });
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
