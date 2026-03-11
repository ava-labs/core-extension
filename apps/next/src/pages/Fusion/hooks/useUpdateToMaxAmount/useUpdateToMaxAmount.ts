import { useEffect } from 'react';
import { useFusionState } from '../../contexts';
import { isNativeToken } from '@core/types';
import { bigIntToString, bigToBigInt } from '@avalabs/core-utils-sdk';
import { bigintToBig } from '@core/common';
import { getNativeBridgeFee } from './lib/extractBridgeFee';

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
  const { useMaxAmount, sourceToken, updateQuery, selectedQuote } =
    useFusionState();

  useEffect(() => {
    if (feeError) {
      // If we encountered an error while estimating the gas fee, reset the `useMaxAmount` state to false
      // so the user can still swap.
      updateQuery({ useMaxAmount: false });
      return;
    }

    const isFeeReady = !isFeeLoading && typeof fee === 'bigint';
    if (!useMaxAmount || !isFeeReady || !sourceToken) {
      return;
    }

    const bridgeFee = getNativeBridgeFee(
      isNativeToken(sourceToken),
      selectedQuote,
    );

    const paddedFee = bigintToBig(fee, sourceToken.decimals).mul(
      FEE_PADDING_FACTOR,
    );
    const maxAmount = isNativeToken(sourceToken)
      ? sourceToken.balance -
        bigToBigInt(paddedFee, sourceToken.decimals) -
        bridgeFee
      : sourceToken.balance;
    const fromAmount = bigIntToString(
      maxAmount < 0n ? 0n : maxAmount,
      sourceToken.decimals,
    );

    updateQuery({ userAmount: fromAmount, useMaxAmount: false });
  }, [
    useMaxAmount,
    isFeeLoading,
    feeError,
    sourceToken,
    fee,
    updateQuery,
    selectedQuote,
  ]);
};
