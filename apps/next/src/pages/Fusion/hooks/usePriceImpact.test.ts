import { renderHook, waitFor } from '@testing-library/react';
import {
  type Quote,
  type Chain,
  type Asset,
  TokenType,
  ServiceType,
} from '@avalabs/fusion-sdk';

import { FungibleTokenBalance } from '@core/types';

import { usePriceImpact, getPriceImpactSeverity } from './usePriceImpact';

const MOCK_CHAIN: Chain = {
  chainId: 'eip155:43114',
  chainName: 'Avalanche',
  networkToken: {
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18,
    type: TokenType.NATIVE,
  },
  rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
};

const MOCK_ASSET_IN: Asset = {
  name: 'TokenA',
  symbol: 'TKA',
  decimals: 18,
  type: TokenType.NATIVE,
};

const MOCK_ASSET_OUT: Asset = {
  name: 'TokenB',
  symbol: 'TKB',
  decimals: 6,
  type: TokenType.NATIVE,
};

function createMockQuote(overrides: Partial<Quote> = {}): Quote {
  return {
    aggregator: { id: 'test', name: 'Test' },
    amountIn: 1000000000000000000n,
    amountOut: 1000000n,
    assetIn: MOCK_ASSET_IN,
    assetOut: MOCK_ASSET_OUT,
    expiresAt: Date.now() + 60_000,
    fees: [],
    fromAddress: '0x0000000000000000000000000000000000000001',
    id: 'test-quote-id',
    partnerFeeBps: null,
    serviceType: ServiceType.MARKR,
    slippageBps: 100,
    sourceChain: MOCK_CHAIN,
    targetChain: MOCK_CHAIN,
    toAddress: '0x0000000000000000000000000000000000000002',
    ...overrides,
  };
}

function createMockToken(
  overrides: Partial<FungibleTokenBalance> = {},
): FungibleTokenBalance {
  return {
    priceInCurrency: 100,
    decimals: 18,
    balance: 1000000000000000000n,
    ...overrides,
  } as FungibleTokenBalance;
}

describe('usePriceImpact', () => {
  it('returns undefined when quote is null', () => {
    const source = createMockToken({ priceInCurrency: 100 });
    const target = createMockToken({ priceInCurrency: 100 });

    const { result } = renderHook(() => usePriceImpact(null, source, target));

    expect(result.current.priceImpact).toBeUndefined();
    expect(result.current.priceImpactSeverity).toBe('low');
  });

  it('returns undefined when sourceToken is undefined', () => {
    const quote = createMockQuote();
    const target = createMockToken();

    const { result } = renderHook(() =>
      usePriceImpact(quote, undefined, target),
    );

    expect(result.current.priceImpact).toBeUndefined();
  });

  it('returns undefined when targetToken is undefined', () => {
    const quote = createMockQuote();
    const source = createMockToken();

    const { result } = renderHook(() =>
      usePriceImpact(quote, source, undefined),
    );

    expect(result.current.priceImpact).toBeUndefined();
  });

  it('returns undefined when sourceToken has no price', () => {
    const quote = createMockQuote();
    const source = createMockToken({ priceInCurrency: undefined });
    const target = createMockToken({ priceInCurrency: 1 });

    const { result } = renderHook(() => usePriceImpact(quote, source, target));

    expect(result.current.priceImpact).toBeUndefined();
  });

  it('returns undefined when targetToken has no price', () => {
    const quote = createMockQuote();
    const source = createMockToken({ priceInCurrency: 100 });
    const target = createMockToken({ priceInCurrency: undefined });

    const { result } = renderHook(() => usePriceImpact(quote, source, target));

    expect(result.current.priceImpact).toBeUndefined();
  });

  it('calculates 0% impact when market and quote rates match', async () => {
    // source: 1 token at $100 = $100 input
    // target: 100 tokens at $1 = $100 output → 0% impact
    const quote = createMockQuote({
      amountIn: 1000000000000000000n,
      amountOut: 100000000n,
      assetIn: { ...MOCK_ASSET_IN, decimals: 18 },
      assetOut: { ...MOCK_ASSET_OUT, decimals: 6 },
    });
    const source = createMockToken({ priceInCurrency: 100 });
    const target = createMockToken({ priceInCurrency: 1 });

    const { result } = renderHook(() => usePriceImpact(quote, source, target));

    await waitFor(() => {
      expect(result.current.priceImpact).toBe(0);
    });
  });

  it('calculates positive price impact when output value is less than input', async () => {
    // source: 1 token at $100 = $100 input
    // target: 90 tokens at $1 = $90 output → 10% impact
    const quote = createMockQuote({
      amountIn: 1000000000000000000n,
      amountOut: 90000000n,
      assetIn: { ...MOCK_ASSET_IN, decimals: 18 },
      assetOut: { ...MOCK_ASSET_OUT, decimals: 6 },
    });
    const source = createMockToken({ priceInCurrency: 100 });
    const target = createMockToken({ priceInCurrency: 1 });

    const { result } = renderHook(() => usePriceImpact(quote, source, target));

    await waitFor(() => {
      expect(result.current.priceImpact).toBeCloseTo(10, 5);
      expect(result.current.priceImpactSeverity).toBe('high');
    });
  });

  it('clamps favorable impact (negative) to 0', async () => {
    // source: 1 token at $100 = $100 input
    // target: 110 tokens at $1 = $110 output → -10% (favorable)
    const quote = createMockQuote({
      amountIn: 1000000000000000000n,
      amountOut: 110000000n,
      assetIn: { ...MOCK_ASSET_IN, decimals: 18 },
      assetOut: { ...MOCK_ASSET_OUT, decimals: 6 },
    });
    const source = createMockToken({ priceInCurrency: 100 });
    const target = createMockToken({ priceInCurrency: 1 });

    const { result } = renderHook(() => usePriceImpact(quote, source, target));

    await waitFor(() => {
      expect(result.current.priceImpact).toBe(0);
    });
  });

  it('handles large price impact (> 50%) as critical', async () => {
    // source: 1 token at $100 = $100 input
    // target: 40 tokens at $1 = $40 output → 60% impact
    const quote = createMockQuote({
      amountIn: 1000000000000000000n,
      amountOut: 40000000n,
      assetIn: { ...MOCK_ASSET_IN, decimals: 18 },
      assetOut: { ...MOCK_ASSET_OUT, decimals: 6 },
    });
    const source = createMockToken({ priceInCurrency: 100 });
    const target = createMockToken({ priceInCurrency: 1 });

    const { result } = renderHook(() => usePriceImpact(quote, source, target));

    await waitFor(() => {
      expect(result.current.priceImpact).toBeCloseTo(60, 5);
      expect(result.current.priceImpactSeverity).toBe('critical');
    });
  });
});

describe('getPriceImpactSeverity', () => {
  it('returns "low" when priceImpact is undefined', () => {
    expect(getPriceImpactSeverity(undefined)).toBe('low');
  });

  it('returns "low" when priceImpact is 0', () => {
    expect(getPriceImpactSeverity(0)).toBe('low');
  });

  it('returns "low" when priceImpact is below 5%', () => {
    expect(getPriceImpactSeverity(4.99)).toBe('low');
    expect(getPriceImpactSeverity(1)).toBe('low');
  });

  it('returns "high" when priceImpact is between 5% and 50%', () => {
    expect(getPriceImpactSeverity(5)).toBe('high');
    expect(getPriceImpactSeverity(23.47)).toBe('high');
    expect(getPriceImpactSeverity(49.99)).toBe('high');
  });

  it('returns "critical" when priceImpact is >= 50%', () => {
    expect(getPriceImpactSeverity(50)).toBe('critical');
    expect(getPriceImpactSeverity(75)).toBe('critical');
    expect(getPriceImpactSeverity(100)).toBe('critical');
  });
});
