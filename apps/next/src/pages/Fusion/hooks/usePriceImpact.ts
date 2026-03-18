import { useMemo } from 'react';
import { Quote } from '@avalabs/fusion-sdk';

import { bigintToBig } from '@core/common';
import { FungibleTokenBalance } from '@core/types';

export type PriceImpactSeverity = 'low' | 'high' | 'critical';

const HIGH_IMPACT_THRESHOLD = 5;
const CRITICAL_IMPACT_THRESHOLD = 50;

type PriceImpactResult = {
  priceImpact: number | undefined;
  priceImpactSeverity: PriceImpactSeverity;
};

export function calculatePriceImpact(
  quote: Quote | null,
  sourceToken: FungibleTokenBalance | undefined,
  targetToken: FungibleTokenBalance | undefined,
): number | undefined {
  if (!quote || !sourceToken || !targetToken) {
    return undefined;
  }

  const sourcePrice = sourceToken.priceInCurrency;
  const targetPrice = targetToken.priceInCurrency;

  if (!sourcePrice || !targetPrice) {
    return undefined;
  }

  const { amountIn, amountOut, assetIn, assetOut } = quote;

  if (!amountIn || !amountOut || !assetIn.decimals || !assetOut.decimals) {
    return undefined;
  }

  const amountInNum = bigintToBig(amountIn, assetIn.decimals).toNumber();
  const amountOutNum = bigintToBig(amountOut, assetOut.decimals).toNumber();

  if (amountInNum === 0) {
    return undefined;
  }

  const inputValueInCurrency = amountInNum * sourcePrice;
  const outputValueInCurrency = amountOutNum * targetPrice;

  if (inputValueInCurrency === 0) {
    return undefined;
  }

  const impact =
    ((inputValueInCurrency - outputValueInCurrency) / inputValueInCurrency) *
    100;

  return Math.max(impact, 0);
}

export function getPriceImpactSeverity(
  priceImpact: number | undefined,
): PriceImpactSeverity {
  if (priceImpact === undefined || priceImpact < HIGH_IMPACT_THRESHOLD) {
    return 'low';
  }

  if (priceImpact >= CRITICAL_IMPACT_THRESHOLD) {
    return 'critical';
  }

  return 'high';
}

export function usePriceImpact(
  quote: Quote | null,
  sourceToken: FungibleTokenBalance | undefined,
  targetToken: FungibleTokenBalance | undefined,
): PriceImpactResult {
  return useMemo(() => {
    const priceImpact = calculatePriceImpact(quote, sourceToken, targetToken);
    const priceImpactSeverity = getPriceImpactSeverity(priceImpact);

    return { priceImpact, priceImpactSeverity };
  }, [quote, sourceToken, targetToken]);
}
