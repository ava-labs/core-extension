import { useEffect, useState } from 'react';
import { calculatePriceImpactFromQuote, Quote } from '@avalabs/fusion-sdk';

import { bigintToBig } from '@core/common';
import { FungibleTokenBalance } from '@core/types';

export type PriceImpactSeverity = 'low' | 'high' | 'critical';

const HIGH_IMPACT_THRESHOLD = 5;
const CRITICAL_IMPACT_THRESHOLD = 50;

type PriceImpactResult = {
  priceImpact: number | undefined;
  priceImpactSeverity: PriceImpactSeverity;
};

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
  const [priceImpact, setPriceImpact] = useState<number | undefined>(undefined);

  useEffect(() => {
    const sourcePrice = sourceToken?.priceInCurrency;
    const targetPrice = targetToken?.priceInCurrency;

    if (!quote || !sourcePrice || !targetPrice) {
      setPriceImpact(undefined);
      return;
    }

    let cancelled = false;

    calculatePriceImpactFromQuote(quote, async (input, output) => {
      const inputAmount = bigintToBig(
        input.amount,
        input.asset.decimals,
      ).toNumber();
      const outputAmount = bigintToBig(
        output.amount,
        output.asset.decimals,
      ).toNumber();

      return [inputAmount * sourcePrice, outputAmount * targetPrice];
    }).then((bps) => {
      if (cancelled) {
        return;
      }

      if (bps === null) {
        setPriceImpact(undefined);
      } else {
        // SDK returns basis points; convert to percentage and clamp favorable impact to 0
        setPriceImpact(Math.max(bps / 100, 0));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [quote, sourceToken, targetToken]);

  return {
    priceImpact,
    priceImpactSeverity: getPriceImpactSeverity(priceImpact),
  };
}
