jest.mock('@avalabs/fusion-sdk', () => {
  const actual = jest.requireActual<typeof import('@avalabs/fusion-sdk')>(
    '@avalabs/fusion-sdk',
  );
  return {
    ...actual,
    calculatePriceImpactFromQuote: jest.fn(
      (...args: Parameters<typeof actual.calculatePriceImpactFromQuote>) =>
        actual.calculatePriceImpactFromQuote(...args),
    ),
  };
});

jest.mock('@core/ui', () => ({
  useNetworkContext: jest.fn(),
  useTokenPrice: jest.fn(),
}));

import { renderHook, waitFor } from '@testing-library/react';
import * as FusionSdk from '@avalabs/fusion-sdk';
import { useNetworkContext, useTokenPrice } from '@core/ui';

import { FungibleTokenBalance } from '@core/types';

import { usePriceImpact, getPriceImpactSeverity } from './usePriceImpact';

const mockUseNetworkContext = jest.mocked(useNetworkContext);
const mockUseTokenPrice = jest.mocked(useTokenPrice);

const mockCalculatePriceImpactFromQuote = jest.mocked(
  FusionSdk.calculatePriceImpactFromQuote,
);

const MOCK_CHAIN: FusionSdk.Chain = {
  chainId: 'eip155:43114',
  chainName: 'Avalanche',
  networkToken: {
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18,
    type: FusionSdk.TokenType.NATIVE,
  },
  rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
};

const MOCK_ASSET_IN: FusionSdk.Asset = {
  name: 'TokenA',
  symbol: 'TKA',
  decimals: 18,
  type: FusionSdk.TokenType.NATIVE,
};

const MOCK_ASSET_OUT: FusionSdk.Asset = {
  name: 'TokenB',
  symbol: 'TKB',
  decimals: 6,
  type: FusionSdk.TokenType.NATIVE,
};

function createMockQuote(
  overrides: Partial<FusionSdk.Quote> = {},
): FusionSdk.Quote {
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
    serviceType: FusionSdk.ServiceType.MARKR,
    slippageBps: 100,
    sourceChain: MOCK_CHAIN,
    targetChain: MOCK_CHAIN,
    toAddress: '0x0000000000000000000000000000000000000002',
    ...overrides,
  };
}

const SOURCE_TOKEN_ADDRESS = '0xSourceToken';
const TARGET_TOKEN_ADDRESS = '0xTargetToken';

function createMockSourceToken(
  overrides: Partial<FungibleTokenBalance> = {},
): FungibleTokenBalance {
  return {
    address: SOURCE_TOKEN_ADDRESS,
    decimals: 18,
    balance: 1000000000000000000n,
    chainCaipId: 'eip155:43114',
    ...overrides,
  } as FungibleTokenBalance;
}

function createMockTargetToken(
  overrides: Partial<FungibleTokenBalance> = {},
): FungibleTokenBalance {
  return {
    address: TARGET_TOKEN_ADDRESS,
    decimals: 6,
    balance: 1000000n,
    chainCaipId: 'eip155:43114',
    ...overrides,
  } as FungibleTokenBalance;
}

function setupTokenPriceMock(
  sourcePrice: number | null,
  targetPrice: number | null,
) {
  mockUseTokenPrice.mockImplementation((address) => {
    if (address === SOURCE_TOKEN_ADDRESS) return sourcePrice;
    if (address === TARGET_TOKEN_ADDRESS) return targetPrice;
    return null;
  });
}

describe('usePriceImpact', () => {
  beforeEach(() => {
    mockUseNetworkContext.mockReturnValue({
      getNetwork: jest.fn().mockReturnValue({ chainId: 43114 }),
    } as unknown as ReturnType<typeof useNetworkContext>);
  });

  afterEach(() => {
    jest.clearAllMocks();
    const actual = jest.requireActual<typeof import('@avalabs/fusion-sdk')>(
      '@avalabs/fusion-sdk',
    );
    mockCalculatePriceImpactFromQuote.mockImplementation((...args) =>
      actual.calculatePriceImpactFromQuote(...args),
    );
  });

  it('returns undefined when quote is null', () => {
    setupTokenPriceMock(100, 100);
    const source = createMockSourceToken();
    const target = createMockTargetToken();

    const { result } = renderHook(() => usePriceImpact(null, source, target));

    expect(result.current.priceImpact).toBeUndefined();
    expect(result.current.priceImpactSeverity).toBe('low');
    expect(result.current.priceImpactAvailability).toBe('hidden');
  });

  it('returns undefined when sourceToken is undefined', () => {
    setupTokenPriceMock(100, 100);
    const quote = createMockQuote();
    const target = createMockTargetToken();

    const { result } = renderHook(() =>
      usePriceImpact(quote, undefined, target),
    );

    expect(result.current.priceImpact).toBeUndefined();
    expect(result.current.priceImpactAvailability).toBe('hidden');
  });

  it('returns undefined when targetToken is undefined', () => {
    setupTokenPriceMock(100, 100);
    const quote = createMockQuote();
    const source = createMockSourceToken();

    const { result } = renderHook(() =>
      usePriceImpact(quote, source, undefined),
    );

    expect(result.current.priceImpact).toBeUndefined();
    expect(result.current.priceImpactAvailability).toBe('hidden');
  });

  it('returns undefined when sourceToken has no price', () => {
    setupTokenPriceMock(null, 1);
    const quote = createMockQuote();
    const source = createMockSourceToken();
    const target = createMockTargetToken();

    const { result } = renderHook(() => usePriceImpact(quote, source, target));

    expect(result.current.priceImpact).toBeUndefined();
    expect(result.current.priceImpactAvailability).toBe('unavailable');
  });

  it('returns undefined when targetToken has no price', () => {
    setupTokenPriceMock(100, null);
    const quote = createMockQuote();
    const source = createMockSourceToken();
    const target = createMockTargetToken();

    const { result } = renderHook(() => usePriceImpact(quote, source, target));

    expect(result.current.priceImpact).toBeUndefined();
    expect(result.current.priceImpactAvailability).toBe('unavailable');
  });

  it('is calculating until the SDK resolves', async () => {
    setupTokenPriceMock(100, 1);

    let resolveBps!: (value: number | null) => void;
    const pendingPromise = new Promise<number | null>((resolve) => {
      resolveBps = resolve;
    });
    mockCalculatePriceImpactFromQuote.mockReturnValueOnce(pendingPromise);

    const quote = createMockQuote({
      amountIn: 1000000000000000000n,
      amountOut: 100000000n,
      assetIn: { ...MOCK_ASSET_IN, decimals: 18 },
      assetOut: { ...MOCK_ASSET_OUT, decimals: 6 },
    });
    const source = createMockSourceToken();
    const target = createMockTargetToken();

    const { result } = renderHook(() => usePriceImpact(quote, source, target));

    await waitFor(() => {
      expect(result.current.priceImpactAvailability).toBe('calculating');
    });

    resolveBps(0);

    await waitFor(() => {
      expect(result.current.priceImpactAvailability).toBe('ready');
      expect(result.current.priceImpact).toBe(0);
    });
  });

  it('sets unavailable when the SDK returns null basis points', async () => {
    setupTokenPriceMock(100, 1);
    mockCalculatePriceImpactFromQuote.mockResolvedValueOnce(null);

    const quote = createMockQuote({
      amountIn: 1000000000000000000n,
      amountOut: 100000000n,
      assetIn: { ...MOCK_ASSET_IN, decimals: 18 },
      assetOut: { ...MOCK_ASSET_OUT, decimals: 6 },
    });
    const source = createMockSourceToken();
    const target = createMockTargetToken();

    const { result } = renderHook(() => usePriceImpact(quote, source, target));

    await waitFor(() => {
      expect(result.current.priceImpactAvailability).toBe('unavailable');
      expect(result.current.priceImpact).toBeUndefined();
    });
  });

  it('calculates 0% impact when market and quote rates match', async () => {
    // source: 1 token at $100 = $100 input
    // target: 100 tokens at $1 = $100 output → 0% impact
    setupTokenPriceMock(100, 1);

    const quote = createMockQuote({
      amountIn: 1000000000000000000n,
      amountOut: 100000000n,
      assetIn: { ...MOCK_ASSET_IN, decimals: 18 },
      assetOut: { ...MOCK_ASSET_OUT, decimals: 6 },
    });
    const source = createMockSourceToken();
    const target = createMockTargetToken();

    const { result } = renderHook(() => usePriceImpact(quote, source, target));

    await waitFor(() => {
      expect(result.current.priceImpact).toBe(0);
      expect(result.current.priceImpactAvailability).toBe('ready');
    });
  });

  it('calculates positive price impact when output value is less than input', async () => {
    // source: 1 token at $100 = $100 input
    // target: 90 tokens at $1 = $90 output → 10% impact
    setupTokenPriceMock(100, 1);

    const quote = createMockQuote({
      amountIn: 1000000000000000000n,
      amountOut: 90000000n,
      assetIn: { ...MOCK_ASSET_IN, decimals: 18 },
      assetOut: { ...MOCK_ASSET_OUT, decimals: 6 },
    });
    const source = createMockSourceToken();
    const target = createMockTargetToken();

    const { result } = renderHook(() => usePriceImpact(quote, source, target));

    await waitFor(() => {
      expect(result.current.priceImpact).toBeCloseTo(10, 5);
      expect(result.current.priceImpactSeverity).toBe('high');
      expect(result.current.priceImpactAvailability).toBe('ready');
    });
  });

  it('clamps favorable impact (negative) to 0', async () => {
    // source: 1 token at $100 = $100 input
    // target: 110 tokens at $1 = $110 output → -10% (favorable)
    setupTokenPriceMock(100, 1);

    const quote = createMockQuote({
      amountIn: 1000000000000000000n,
      amountOut: 110000000n,
      assetIn: { ...MOCK_ASSET_IN, decimals: 18 },
      assetOut: { ...MOCK_ASSET_OUT, decimals: 6 },
    });
    const source = createMockSourceToken();
    const target = createMockTargetToken();

    const { result } = renderHook(() => usePriceImpact(quote, source, target));

    await waitFor(() => {
      expect(result.current.priceImpact).toBe(0);
      expect(result.current.priceImpactAvailability).toBe('ready');
    });
  });

  it('handles large price impact (> 50%) as critical', async () => {
    // source: 1 token at $100 = $100 input
    // target: 40 tokens at $1 = $40 output → 60% impact
    setupTokenPriceMock(100, 1);

    const quote = createMockQuote({
      amountIn: 1000000000000000000n,
      amountOut: 40000000n,
      assetIn: { ...MOCK_ASSET_IN, decimals: 18 },
      assetOut: { ...MOCK_ASSET_OUT, decimals: 6 },
    });
    const source = createMockSourceToken();
    const target = createMockTargetToken();

    const { result } = renderHook(() => usePriceImpact(quote, source, target));

    await waitFor(() => {
      expect(result.current.priceImpact).toBeCloseTo(60, 5);
      expect(result.current.priceImpactSeverity).toBe('critical');
      expect(result.current.priceImpactAvailability).toBe('ready');
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
