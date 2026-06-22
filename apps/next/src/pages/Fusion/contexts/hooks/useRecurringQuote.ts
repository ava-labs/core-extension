import { useMemo } from 'react';
import { skipToken, useQuery } from '@tanstack/react-query';
import { bigIntToString } from '@avalabs/core-utils-sdk';
import {
  type Asset,
  type Chain,
  type RecurringFrequency,
  type TransferManager,
} from '@avalabs/fusion-sdk';

import { useNetworkContext } from '@core/ui';
import { caipToChainId } from '@core/common';

import { MIN_NUMBER_OF_ORDERS } from '../RecurringSwapContext';
import { getRecurringTokenAddress } from '../../lib/getRecurringTokenAddress';

// Markr tags the one-time native schedule fee with `type: 'recurring'`
// (additive `extra` charge) on the quote's `fees` array.
const SCHEDULE_FEE_TYPE = 'recurring';

type UseRecurringQuoteProps = {
  manager: TransferManager | undefined;
  sourceAsset: Asset | undefined;
  targetAsset: Asset | undefined;
  sourceChain: Chain | undefined;
  amount: bigint;
  /** Basis points; omit to let Markr apply its recommended slippage. */
  slippageBps?: number;
  frequency: RecurringFrequency;
  numberOfOrders: number;
  /** Caller gates fetching on recurring being active + the pair being eligible. */
  enabled: boolean;
};

export const useRecurringQuote = ({
  manager,
  sourceAsset,
  targetAsset,
  sourceChain,
  amount,
  slippageBps,
  frequency,
  numberOfOrders,
  enabled,
}: UseRecurringQuoteProps) => {
  const { getNetwork } = useNetworkContext();

  const tokenIn = sourceAsset
    ? getRecurringTokenAddress(sourceAsset)
    : undefined;
  const tokenOut = targetAsset
    ? getRecurringTokenAddress(targetAsset)
    : undefined;
  const chainId = sourceChain?.chainId
    ? caipToChainId(sourceChain.chainId)
    : undefined;

  const canQuote =
    enabled &&
    Boolean(manager) &&
    Boolean(sourceAsset) &&
    Boolean(targetAsset) &&
    Boolean(tokenIn) &&
    Boolean(tokenOut) &&
    chainId !== undefined &&
    amount > 0n &&
    numberOfOrders >= MIN_NUMBER_OF_ORDERS;

  const { data: recurringQuote } = useQuery({
    queryKey: [
      'recurringQuote',
      chainId,
      tokenIn,
      tokenOut,
      amount.toString(),
      numberOfOrders,
      frequency.unit,
      frequency.value,
      slippageBps,
    ],
    enabled: canQuote,
    queryFn:
      manager &&
      sourceAsset &&
      targetAsset &&
      tokenIn &&
      tokenOut &&
      chainId !== undefined
        ? () =>
            manager.recurring.quote({
              chainId,
              tokenIn,
              tokenInDecimals: sourceAsset.decimals,
              tokenOut,
              tokenOutDecimals: targetAsset.decimals,
              amount,
              numberOfOrders,
              frequency,
              slippage: slippageBps,
            })
        : skipToken,
    staleTime: 30_000,
  });

  const scheduleFee = useMemo(() => {
    const fee = recurringQuote?.fees.find((f) => f.type === SCHEDULE_FEE_TYPE);
    if (!fee) {
      return undefined;
    }

    const network = getNetwork(fee.token.chainId);
    const decimals = network?.networkToken.decimals ?? 18;
    const symbol = network?.networkToken.symbol ?? '';
    const amountLabel = bigIntToString(fee.amount, decimals);

    return symbol ? `${amountLabel} ${symbol}` : amountLabel;
  }, [recurringQuote, getNetwork]);

  return { recurringQuote, scheduleFee };
};
