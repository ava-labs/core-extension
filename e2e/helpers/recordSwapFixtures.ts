/**
 * Records live swap API responses and saves them as JSON fixtures.
 *
 * Supports:
 *   - Markr (EVM: Avalanche, Ethereum) — SSE quote + spender address
 *   - Jupiter (Solana) — REST quote + swap transaction
 *
 * Run:
 *   npx ts-node --compiler-options '{"module":"CommonJS","esModuleInterop":true}' \
 *     helpers/recordSwapFixtures.ts
 *
 * Note: Markr requires the extension proxy, so recording from outside
 * returns 403. Use the manually-crafted fixtures when that happens.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  MARKR_BASE_URL,
  JUPITER_BASE_URL,
  SOL_MINT,
  SWAP_PAIRS,
  type SwapFixture,
  type SwapPair,
} from '../types/swap';

const WALLET_ADDRESS = '0x0000000000000000000000000000000000000001';
const MARKR_APP_ID =
  '0x1c8f2aada1d99f5ac6e1011ce002fc53a6e36ab104e30f11a13053734edec239';

// ── Markr (EVM) ────────────────────────────────────────────────────

async function recordMarkrQuote(pair: SwapPair): Promise<unknown[]> {
  const nativeAddress = '0x0000000000000000000000000000000000000000';
  const rawAmount = BigInt(
    Math.floor(parseFloat(pair.amount) * 10 ** pair.from.decimals),
  ).toString();

  const response = await fetch(`${MARKR_BASE_URL}/quote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      appId: MARKR_APP_ID,
      chainId: pair.from.chainId,
      from: WALLET_ADDRESS,
      tokenIn: pair.from.address ?? nativeAddress,
      tokenInDecimals: pair.from.decimals,
      tokenOut: pair.to.address ?? nativeAddress,
      tokenOutDecimals: pair.to.decimals,
      amount: rawAmount,
      slippage: 0.5,
    }),
  });

  if (!response.ok) {
    throw new Error(`Markr quote: ${response.status} ${response.statusText}`);
  }

  const events: unknown[] = [];
  for (const line of (await response.text()).split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('data:')) {
      try {
        events.push(JSON.parse(trimmed.slice(5)));
      } catch {
        /* skip non-JSON */
      }
    }
  }

  if (!events.length) throw new Error('Markr returned no quote events');
  return events;
}

async function recordMarkrSpender(chainId: number): Promise<string> {
  const response = await fetch(
    `${MARKR_BASE_URL}/spender-address?chainId=${chainId}`,
  );
  if (!response.ok) {
    throw new Error(`Markr spender: ${response.status} ${response.statusText}`);
  }
  return ((await response.json()) as { address: string }).address;
}

async function recordMarkrFixture(pair: SwapPair): Promise<SwapFixture> {
  return {
    pair,
    quote: await recordMarkrQuote(pair),
    spenderAddress: await recordMarkrSpender(pair.from.chainId),
  };
}

// ── Jupiter (Solana) ───────────────────────────────────────────────

async function recordJupiterQuote(pair: SwapPair): Promise<unknown> {
  const inputMint = pair.from.address ?? SOL_MINT;
  const outputMint = pair.to.address ?? SOL_MINT;
  const rawAmount = BigInt(
    Math.floor(parseFloat(pair.amount) * 10 ** pair.from.decimals),
  ).toString();

  const params = new URLSearchParams({
    inputMint,
    outputMint,
    amount: rawAmount,
    slippageBps: '50',
    swapMode: 'ExactIn',
  });

  const response = await fetch(`${JUPITER_BASE_URL}/quote?${params}`);

  if (!response.ok) {
    throw new Error(`Jupiter quote: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function recordJupiterSwapTx(
  quoteResponse: unknown,
): Promise<{ swapTransaction: string; simulationError: null }> {
  const response = await fetch(`${JUPITER_BASE_URL}/swap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      quoteResponse,
      userPublicKey: '11111111111111111111111111111111',
      wrapAndUnwrapSol: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Jupiter swap: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<{
    swapTransaction: string;
    simulationError: null;
  }>;
}

async function recordJupiterFixture(pair: SwapPair): Promise<SwapFixture> {
  const quote = await recordJupiterQuote(pair);
  let jupiterSwapTx: SwapFixture['jupiterSwapTx'];

  try {
    jupiterSwapTx = await recordJupiterSwapTx(quote);
  } catch (err) {
    console.warn(`    ⚠ Jupiter swap tx failed (quote-only): ${err}`);
  }

  return { pair, quote, jupiterSwapTx };
}

// ── Main ───────────────────────────────────────────────────────────

async function main() {
  const fixturesDir = path.resolve(__dirname, '..', 'fixtures', 'swap');
  fs.mkdirSync(fixturesDir, { recursive: true });

  for (const [key, pair] of Object.entries(SWAP_PAIRS)) {
    try {
      console.log(
        `Recording: ${key} (${pair.from.symbol} → ${pair.to.symbol}) [${pair.chain}]`,
      );

      const fixture =
        pair.chain === 'solana'
          ? await recordJupiterFixture(pair)
          : await recordMarkrFixture(pair);

      const filePath = path.join(fixturesDir, `${pair.fixture}.json`);
      fs.writeFileSync(filePath, JSON.stringify(fixture, null, 2));
      console.log(`  ✓ ${filePath}`);
    } catch (err) {
      console.error(`  ✗ ${key}: ${err}`);
    }
  }
}

main().catch(console.error);
