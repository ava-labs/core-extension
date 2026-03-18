import { Quote } from '@avalabs/fusion-sdk';

import { FungibleTokenBalance } from '@core/types';
import { calculatePriceImpact, getPriceImpactSeverity } from './usePriceImpact';

function createMockQuote(overrides: Partial<Quote> = {}): Quote {
  return {
    amountIn: 1000000000000000000n, // 1 token (18 decimals)
    amountOut: 1000000n, // 1 token (6 decimals)
    assetIn: { decimals: 18 } as Quote['assetIn'],
    assetOut: { decimals: 6 } as Quote['assetOut'],
    ...overrides,
  } as Quote;
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

describe('calculatePriceImpact', () => {
  it('returns undefined when quote is null', () => {
    const source = createMockToken({ priceInCurrency: 100 });
    const target = createMockToken({ priceInCurrency: 100 });

    expect(calculatePriceImpact(null, source, target)).toBeUndefined();
  });

  it('returns undefined when sourceToken is undefined', () => {
    const quote = createMockQuote();
    const target = createMockToken();

    expect(calculatePriceImpact(quote, undefined, target)).toBeUndefined();
  });

  it('returns undefined when targetToken is undefined', () => {
    const quote = createMockQuote();
    const source = createMockToken();

    expect(calculatePriceImpact(quote, source, undefined)).toBeUndefined();
  });

  it('returns undefined when sourceToken has no price', () => {
    const quote = createMockQuote();
    const source = createMockToken({ priceInCurrency: undefined });
    const target = createMockToken({ priceInCurrency: 1 });

    expect(calculatePriceImpact(quote, source, target)).toBeUndefined();
  });

  it('returns undefined when targetToken has no price', () => {
    const quote = createMockQuote();
    const source = createMockToken({ priceInCurrency: 100 });
    const target = createMockToken({ priceInCurrency: undefined });

    expect(calculatePriceImpact(quote, source, target)).toBeUndefined();
  });

  it('returns undefined when amountIn is 0', () => {
    const quote = createMockQuote({ amountIn: 0n });
    const source = createMockToken({ priceInCurrency: 100 });
    const target = createMockToken({ priceInCurrency: 1 });

    expect(calculatePriceImpact(quote, source, target)).toBeUndefined();
  });

  it('returns 0 when market and quote rates match (no impact)', () => {
    // source: 1 token at $100 = $100 input
    // target: 100 tokens at $1 = $100 output
    const quote = createMockQuote({
      amountIn: 1000000000000000000n, // 1 token (18 decimals)
      amountOut: 100000000n, // 100 tokens (6 decimals)
      assetIn: { decimals: 18 } as Quote['assetIn'],
      assetOut: { decimals: 6 } as Quote['assetOut'],
    });
    const source = createMockToken({ priceInCurrency: 100 });
    const target = createMockToken({ priceInCurrency: 1 });

    expect(calculatePriceImpact(quote, source, target)).toBe(0);
  });

  it('calculates positive price impact when output value is less than input', () => {
    // source: 1 token at $100 = $100 input
    // target: 90 tokens at $1 = $90 output → 10% impact
    const quote = createMockQuote({
      amountIn: 1000000000000000000n,
      amountOut: 90000000n, // 90 tokens (6 decimals)
      assetIn: { decimals: 18 } as Quote['assetIn'],
      assetOut: { decimals: 6 } as Quote['assetOut'],
    });
    const source = createMockToken({ priceInCurrency: 100 });
    const target = createMockToken({ priceInCurrency: 1 });

    const result = calculatePriceImpact(quote, source, target);
    expect(result).toBeCloseTo(10, 5);
  });

  it('clamps favorable impact (negative) to 0', () => {
    // source: 1 token at $100 = $100 input
    // target: 110 tokens at $1 = $110 output → -10% (favorable)
    const quote = createMockQuote({
      amountIn: 1000000000000000000n,
      amountOut: 110000000n, // 110 tokens (6 decimals)
      assetIn: { decimals: 18 } as Quote['assetIn'],
      assetOut: { decimals: 6 } as Quote['assetOut'],
    });
    const source = createMockToken({ priceInCurrency: 100 });
    const target = createMockToken({ priceInCurrency: 1 });

    expect(calculatePriceImpact(quote, source, target)).toBe(0);
  });

  it('handles large price impact (> 50%)', () => {
    // source: 1 token at $100 = $100 input
    // target: 40 tokens at $1 = $40 output → 60% impact
    const quote = createMockQuote({
      amountIn: 1000000000000000000n,
      amountOut: 40000000n,
      assetIn: { decimals: 18 } as Quote['assetIn'],
      assetOut: { decimals: 6 } as Quote['assetOut'],
    });
    const source = createMockToken({ priceInCurrency: 100 });
    const target = createMockToken({ priceInCurrency: 1 });

    const result = calculatePriceImpact(quote, source, target);
    expect(result).toBeCloseTo(60, 5);
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
