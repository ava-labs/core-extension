import { bigIntToString } from '@avalabs/core-utils-sdk';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import {
  FungibleTokenBalance,
  getUniqueTokenId,
  isBtcToken,
} from '@core/types';

import { useFusionState } from '../contexts';
import { RequiredTokenAmounts } from '../types';
import { calculateMaxAmount } from '../lib/calculateMaxAmount';

// Throttle adjustments to a maximum of once per 10 seconds to prevent feedback loops from fee recalculations.
const THROTTLE_MS = 10_000;

/**
 * Manages "Max" button behavior for swap amount input.
 *
 * When pinned, the user amount stays at the maximum available. If fees increase
 * and the max drops below the pinned amount, we adjust down to keep the amount
 * valid. If fees decrease, we don't auto-increase to avoid unexpected changes.
 *
 * Uses a ref instead of state to prevent quote refetch loops — only triggers
 * updateQuery when the amount actually needs to decrease. Throttles adjustments
 * to once per THROTTLE_MS to prevent feedback loops from fee recalculations.
 */
export const usePinnedMaxAmount = (
  sourceToken: FungibleTokenBalance | undefined,
  tokenRequirements: RequiredTokenAmounts,
) => {
  const { updateQuery } = useFusionState();
  const pinnedAmount = useRef<bigint | undefined>(undefined);
  const lastAdjustmentTime = useRef(0);

  const sourceTokenId = sourceToken ? getUniqueTokenId(sourceToken) : undefined;
  const sourceTokenBalance = sourceToken ? sourceToken.balance : 0n;
  const isBitcoin = sourceToken ? isBtcToken(sourceToken) : false;
  const maxAmount = useMemo(() => {
    if (
      !sourceTokenId ||
      !sourceTokenBalance ||
      tokenRequirements.state !== 'complete'
    ) {
      return undefined;
    }

    return calculateMaxAmount(
      sourceTokenId,
      sourceTokenBalance,
      tokenRequirements,
    );
  }, [sourceTokenId, sourceTokenBalance, tokenRequirements]);

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastAdjustment = now - lastAdjustmentTime.current;

    if (
      pinnedAmount.current !== undefined &&
      maxAmount !== undefined &&
      maxAmount < pinnedAmount.current &&
      (isBitcoin || timeSinceLastAdjustment >= THROTTLE_MS)
    ) {
      pinnedAmount.current = maxAmount;
      lastAdjustmentTime.current = now;
      updateQuery({
        userAmount: bigIntToString(maxAmount, sourceToken?.decimals ?? 0),
      });
    }
  }, [updateQuery, maxAmount, sourceToken?.decimals, isBitcoin]);

  const pin = useCallback(() => {
    pinnedAmount.current = maxAmount;
  }, [maxAmount]);

  const unpin = useCallback(() => {
    pinnedAmount.current = undefined;
    lastAdjustmentTime.current = 0;
  }, []);

  return {
    pin,
    unpin,
    maxAmount,
  };
};
