/**
 * Swap test configuration — tokens, pairs, timeouts, and fixture types.
 *
 * Token ID format: `{TokenType}:{identifier}:{chainId}`
 */

export type SwapChain = 'avalanche' | 'ethereum' | 'solana' | 'base';

export interface SwapToken {
  id: string;
  symbol: string;
  chain: SwapChain;
  chainId: number;
  decimals: number;
  address?: string;
}

export const SWAP_TOKENS: Record<string, SwapToken> = {
  AVAX: {
    id: 'NATIVE:avax:43114',
    symbol: 'AVAX',
    chain: 'avalanche',
    chainId: 43114,
    decimals: 18,
  },
  USDC_AVAX: {
    id: 'ERC20:0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e:43114',
    symbol: 'USDC',
    chain: 'avalanche',
    chainId: 43114,
    decimals: 6,
    address: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
  },
  BLACK: {
    id: 'ERC20:0xcd94a87696fac69edae3a70fe5725307ae1c43f6:43114',
    symbol: 'BLACK',
    chain: 'avalanche',
    chainId: 43114,
    decimals: 18,
    address: '0xcd94a87696fac69edae3a70fe5725307ae1c43f6',
  },
  ETH: {
    id: 'NATIVE:eth:1',
    symbol: 'ETH',
    chain: 'ethereum',
    chainId: 1,
    decimals: 18,
  },
  LINK: {
    id: 'ERC20:0x514910771af9ca656af840dff83e8264ecf986ca:1',
    symbol: 'LINK',
    chain: 'ethereum',
    chainId: 1,
    decimals: 18,
    address: '0x514910771af9ca656af840dff83e8264ecf986ca',
  },
  USDC_ETH: {
    id: 'ERC20:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48:1',
    symbol: 'USDC',
    chain: 'ethereum',
    chainId: 1,
    decimals: 6,
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  },
  SOL: {
    id: 'NATIVE:SOL:4503599627369476',
    symbol: 'SOL',
    chain: 'solana',
    chainId: 4503599627369476,
    decimals: 9,
  },
  FARTCOIN: {
    id: 'SPL:9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump:4503599627369476',
    symbol: 'Fartcoin',
    chain: 'solana',
    chainId: 4503599627369476,
    decimals: 6,
    address: '9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump',
  },
  USDC_SOL: {
    id: 'SPL:EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v:4503599627369476',
    symbol: 'USDC',
    chain: 'solana',
    chainId: 4503599627369476,
    decimals: 6,
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  },
  BONK: {
    id: 'SPL:DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263:4503599627369476',
    symbol: 'BONK',
    chain: 'solana',
    chainId: 4503599627369476,
    decimals: 5,
    address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  },
  PENGU: {
    id: 'SPL:2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv:4503599627369476',
    symbol: 'PENGU',
    chain: 'solana',
    chainId: 4503599627369476,
    decimals: 6,
    address: '2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv',
  },
  ETH_BASE: {
    id: 'NATIVE:eth:8453',
    symbol: 'ETH',
    chain: 'base',
    chainId: 8453,
    decimals: 18,
  },
  USDC_BASE: {
    id: 'ERC20:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913:8453',
    symbol: 'USDC',
    chain: 'base',
    chainId: 8453,
    decimals: 6,
    address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  },
  AERO_BASE: {
    id: 'ERC20:0x940181a94a35a4569e4529a3cdfb74e38fd98631:8453',
    symbol: 'AERO',
    chain: 'base',
    chainId: 8453,
    decimals: 18,
    address: '0x940181a94a35a4569e4529a3cdfb74e38fd98631',
  },
} as const;

export interface SwapPair {
  from: SwapToken;
  to: SwapToken;
  amount: string;
  fixture: string;
  chain: SwapChain;
}

export const SWAP_PAIRS: Record<string, SwapPair> = {
  AVAX_USDC: {
    from: SWAP_TOKENS.AVAX,
    to: SWAP_TOKENS.USDC_AVAX,
    amount: '0.01',
    fixture: 'avax-usdc',
    chain: 'avalanche',
  },
  BLACK_AVAX: {
    from: SWAP_TOKENS.BLACK,
    to: SWAP_TOKENS.AVAX,
    amount: '50',
    fixture: 'black-avax',
    chain: 'avalanche',
  },
  // SWP-003 mock: the `usdc-black` fixture is a hand-crafted USDC → BLACK
  // quote (amount rate ≈ 1 USDC = 154 BLACK, derived from the live
  // BLACK → USDC fixture). Re-record with `RECORD_FIXTURES=1` if the rate
  // drifts enough that the displayed quote looks unrealistic in QA.
  USDC_BLACK: {
    from: SWAP_TOKENS.USDC_AVAX,
    to: SWAP_TOKENS.BLACK,
    amount: '0.3',
    fixture: 'usdc-black',
    chain: 'avalanche',
  },
  ETH_LINK: {
    from: SWAP_TOKENS.ETH,
    to: SWAP_TOKENS.LINK,
    amount: '0.001',
    fixture: 'eth-link',
    chain: 'ethereum',
  },
  LINK_ETH: {
    from: SWAP_TOKENS.LINK,
    to: SWAP_TOKENS.ETH,
    amount: '0.1',
    fixture: 'link-eth',
    chain: 'ethereum',
  },
  LINK_USDC: {
    from: SWAP_TOKENS.LINK,
    to: SWAP_TOKENS.USDC_ETH,
    amount: '0.1',
    fixture: 'link-usdc',
    chain: 'ethereum',
  },
  SOL_FARTCOIN: {
    from: SWAP_TOKENS.SOL,
    to: SWAP_TOKENS.FARTCOIN,
    amount: '0.001',
    fixture: 'sol-fartcoin',
    chain: 'solana',
  },
  FARTCOIN_SOL: {
    from: SWAP_TOKENS.FARTCOIN,
    to: SWAP_TOKENS.SOL,
    amount: '0.1',
    fixture: 'fartcoin-sol',
    chain: 'solana',
  },
  ETH_BASE_USDC: {
    from: SWAP_TOKENS.ETH_BASE,
    to: SWAP_TOKENS.USDC_BASE,
    amount: '0.0001',
    fixture: 'eth-base-usdc',
    chain: 'base',
  },
  AERO_BASE_ETH: {
    from: SWAP_TOKENS.AERO_BASE,
    to: SWAP_TOKENS.ETH_BASE,
    amount: '0.1',
    fixture: 'aero-eth-base',
    chain: 'base',
  },
};

export const SWAP_TIMEOUTS = {
  QUOTE: 20_000,
  APPROVAL: 30_000,
  TRANSACTION: 60_000,
  TEST: 120_000,
  /**
   * Per-test budget for live cross-chain swaps. Bridges (Markr Solana ↔ EVM,
   * EVM ↔ EVM) can take 5-10 minutes end-to-end, so we allow 20 minutes per
   * test. Mirrors Core Web's `UNIFIED_CROSS_CHAIN_SWAP_TEST_TIMEOUT_MS`.
   */
  CROSS_CHAIN_TEST: 1_200_000,
  /**
   * Outer poll for source + target status to reach Complete. Slightly shorter
   * than `CROSS_CHAIN_TEST` so the test fails on the assertion rather than the
   * test-level timeout. Mirrors Core Web's `waitForSwapSuccessOrFail` default.
   */
  CROSS_CHAIN_SUCCESS: 900_000,
} as const;

/**
 * Cross-chain swap pairs covered by the live regression suite. Twelve pairs
 * mirroring Core Web's `unifiedSwaps.spec.ts` cross-chain set (PR #1655); see
 * `e2e/tests/swap-cross-chain-live.spec.ts` for the test body.
 *
 * Skipped intentionally (Core Web parity):
 *   - Any `Ethereum-source` pair: long finality + tx times out
 *   - Any `L2-source` pair: same reason
 *   - Any subnet/L1 pair (JUICE/BLAZE): no quotes + UI bug (CP-13945)
 *   - Lombard BTC ↔ BTC.b: 6h SLA, not viable in CI
 *
 * Amounts and pair shape are copied verbatim from Core Web; adjust only if a
 * pair starts failing on liquidity / fee coverage in our test wallet.
 */
export const CROSS_CHAIN_SWAP_PAIRS = {
  AVAX_TO_ETH: {
    from: SWAP_TOKENS.AVAX,
    to: SWAP_TOKENS.ETH,
    amount: '0.03',
    fixture: 'cross-chain-avax-to-eth',
    chain: 'avalanche',
  },
  AVAX_TO_ETH_BASE: {
    from: SWAP_TOKENS.AVAX,
    to: SWAP_TOKENS.ETH_BASE,
    amount: '0.01',
    fixture: 'cross-chain-avax-to-eth-base',
    chain: 'avalanche',
  },
  AVAX_TO_SOL: {
    from: SWAP_TOKENS.AVAX,
    to: SWAP_TOKENS.SOL,
    amount: '0.015',
    fixture: 'cross-chain-avax-to-sol',
    chain: 'avalanche',
  },
  USDC_AVAX_TO_ETH: {
    from: SWAP_TOKENS.USDC_AVAX,
    to: SWAP_TOKENS.ETH,
    amount: '0.05',
    fixture: 'cross-chain-usdc-avax-to-eth',
    chain: 'avalanche',
  },
  USDC_AVAX_TO_ETH_BASE: {
    from: SWAP_TOKENS.USDC_AVAX,
    to: SWAP_TOKENS.ETH_BASE,
    amount: '0.05',
    fixture: 'cross-chain-usdc-avax-to-eth-base',
    chain: 'avalanche',
  },
  USDC_AVAX_TO_SOL: {
    from: SWAP_TOKENS.USDC_AVAX,
    to: SWAP_TOKENS.SOL,
    amount: '0.1',
    fixture: 'cross-chain-usdc-avax-to-sol',
    chain: 'avalanche',
  },
  SOL_TO_AVAX: {
    from: SWAP_TOKENS.SOL,
    to: SWAP_TOKENS.AVAX,
    amount: '0.00015',
    fixture: 'cross-chain-sol-to-avax',
    chain: 'solana',
  },
  SOL_TO_ETH: {
    from: SWAP_TOKENS.SOL,
    to: SWAP_TOKENS.ETH,
    amount: '0.001',
    fixture: 'cross-chain-sol-to-eth',
    chain: 'solana',
  },
  SOL_TO_ETH_BASE: {
    from: SWAP_TOKENS.SOL,
    to: SWAP_TOKENS.ETH_BASE,
    amount: '0.0005',
    fixture: 'cross-chain-sol-to-eth-base',
    chain: 'solana',
  },
  USDC_SOL_TO_AVAX: {
    from: SWAP_TOKENS.USDC_SOL,
    to: SWAP_TOKENS.AVAX,
    amount: '0.05',
    fixture: 'cross-chain-usdc-sol-to-avax',
    chain: 'solana',
  },
  USDC_SOL_TO_ETH_BASE: {
    from: SWAP_TOKENS.USDC_SOL,
    to: SWAP_TOKENS.ETH_BASE,
    amount: '0.01',
    fixture: 'cross-chain-usdc-sol-to-eth-base',
    chain: 'solana',
  },
  USDC_SOL_TO_ETH: {
    from: SWAP_TOKENS.USDC_SOL,
    to: SWAP_TOKENS.ETH,
    amount: '0.05',
    fixture: 'cross-chain-usdc-sol-to-eth',
    chain: 'solana',
  },
} as const satisfies Record<string, SwapPair>;

export const MOCK_RPC_PORT = 18545;
export const MOCK_RPC_URL = `http://127.0.0.1:${MOCK_RPC_PORT}`;

/**
 * Markr aggregator endpoint. The extension's actual Markr URL is driven by
 * `MARKR_API_URL` at build time; in current dev/staging/prod builds this
 * resolves to `markr-helium` regardless of environment, so a single constant
 * is sufficient. If a future deployment forks this path, switch the mock
 * routes in `helpers/swapMocks.ts` to a host-agnostic glob/regex.
 */
export const MARKR_BASE_URL =
  'https://proxy-api.avax.network/proxy/markr-helium';
export const JUPITER_BASE_URL = 'https://lite-api.jup.ag/swap/v1';

export const SOL_MINT = 'So11111111111111111111111111111111111111112';

export interface SwapFixture {
  pair: SwapPair;
  quote: unknown;
  swapTx?: { to: string; data: string; value: string };
  spenderAddress?: string;
  jupiterSwapTx?: { swapTransaction: string; simulationError: null };
}
