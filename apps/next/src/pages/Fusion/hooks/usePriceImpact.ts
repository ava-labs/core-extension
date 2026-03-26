import { useEffect, useState } from 'react';
import { calculatePriceImpactFromQuote, Quote } from '@avalabs/fusion-sdk';

import { bigintToBig } from '@core/common';
import { FungibleTokenBalance, isNativeToken } from '@core/types';
import { useNetworkContext, useTokenPrice } from '@core/ui';

export type PriceImpactSeverity = 'low' | 'high' | 'critical';

export type PriceImpactAvailability =
  | 'hidden'
  | 'calculating'
  | 'unavailable'
  | 'ready';

const HIGH_IMPACT_THRESHOLD = 5;
const CRITICAL_IMPACT_THRESHOLD = 50;

type PriceImpactResult = {
  priceImpact: number | undefined;
  priceImpactSeverity: PriceImpactSeverity;
  priceImpactAvailability: PriceImpactAvailability;
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
  const [priceImpactAvailability, setPriceImpactAvailability] =
    useState<PriceImpactAvailability>('hidden');

  const { getNetwork } = useNetworkContext();

  const sourcePrice = useTokenPrice(
    sourceToken && isNativeToken(sourceToken)
      ? sourceToken.symbol
      : sourceToken?.address,
    sourceToken && getNetwork(sourceToken?.chainCaipId),
  );

  const targetPrice = useTokenPrice(
    targetToken && isNativeToken(targetToken)
      ? targetToken.symbol
      : targetToken?.address,
    targetToken && getNetwork(targetToken?.chainCaipId),
  );

  useEffect(() => {
    if (!quote || !sourceToken || !targetToken) {
      setPriceImpact(undefined);
      setPriceImpactAvailability('hidden');
      return;
    }

    if (!sourcePrice || !targetPrice) {
      setPriceImpact(undefined);
      setPriceImpactAvailability('unavailable');
      return;
    }

    setPriceImpact(undefined);
    setPriceImpactAvailability('calculating');

    let cancelled = false;

    const sourcePriceSnapshot = sourcePrice;
    const targetPriceSnapshot = targetPrice;

    calculatePriceImpactFromQuote(quote, async (input, output) => {
      if (cancelled) {
        return [0, 0];
      }

      const inputAmount = bigintToBig(
        input.amount,
        input.asset.decimals,
      ).toNumber();
      const outputAmount = bigintToBig(
        output.amount,
        output.asset.decimals,
      ).toNumber();

      return [
        inputAmount * sourcePriceSnapshot,
        outputAmount * targetPriceSnapshot,
      ];
    }).then((bps) => {
      if (cancelled) {
        return;
      }

      if (bps === null) {
        setPriceImpact(undefined);
        setPriceImpactAvailability('unavailable');
      } else {
        // SDK returns basis points; convert to percentage and clamp favorable impact to 0
        setPriceImpact(Math.max(bps / 100, 0));
        setPriceImpactAvailability('ready');
      }
    });

    return () => {
      cancelled = true;
    };
  }, [quote, sourceToken, targetToken, sourcePrice, targetPrice]);

  return {
    priceImpact,
    priceImpactSeverity: getPriceImpactSeverity(priceImpact),
    priceImpactAvailability,
  };
}
