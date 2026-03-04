import { useEffect } from 'react';
import { useFusionState } from '../contexts';
import { isNativeToken } from '@core/types';
import { bigIntToString, bigToBigInt } from '@avalabs/core-utils-sdk';
import { bigintToBig } from '@core/common';

/**
 * Additional buffer for the "Max" button to account for fee fluctuations.
 * This prevents the quote from being invalidated when easily invalidated.
 */
const FEE_PADDING_FACTOR = 1.5; // Additional 50%

/**
 * Observes the `useMaxAmount` state and the `fee` state,
 * and updates the `userAmount` state to the maximum amount available.
 */
export const useUpdateToMaxAmount = (
  fee: bigint | undefined,
  isFeeLoading: boolean,
  feeError: Error | null,
) => {
  const { useMaxAmount, sourceToken, updateQuery } = useFusionState();

  useEffect(() => {
    const isFeeReady = !isFeeLoading && !feeError && typeof fee === 'bigint';

    if (!useMaxAmount || !isFeeReady || !sourceToken) {
      return;
    }

    const paddedFee = bigintToBig(fee, sourceToken.decimals).mul(
      FEE_PADDING_FACTOR,
    );
    const maxAmount = isNativeToken(sourceToken)
      ? sourceToken.balance - bigToBigInt(paddedFee, sourceToken.decimals)
      : sourceToken.balance;
    const fromAmount = bigIntToString(
      maxAmount < 0n ? 0n : maxAmount,
      sourceToken.decimals,
    );

    updateQuery({ userAmount: fromAmount, useMaxAmount: true });
  }, [useMaxAmount, isFeeLoading, feeError, sourceToken, fee, updateQuery]);
};
