import { useEffect } from 'react';
import { bigIntToString, bigToBigInt } from '@avalabs/core-utils-sdk';
import { bigintToBig } from '@core/common';
import { useFeatureFlagContext } from '@core/ui';
import { FeatureVars, isCrossChainTransfer, isNativeToken } from '@core/types';

import { getNativeBridgeFee } from './lib/extractBridgeFee';
import { useFusionState } from '../../contexts';
import { getBufferMultiplierFromBps } from '../../lib/getBufferMultiplierFromBps';
import { QuoteFee } from '@avalabs/fusion-sdk';
import { sumAdditiveFees } from '../../lib/sumAdditiveFees';

/**
 * Observes the `useMaxAmount` state and the `fee` state,
 * and updates the `userAmount` state to the maximum amount available.
 */
export const useUpdateToMaxAmount = (
  fee: bigint | undefined,
  isFeeLoading: boolean,
  feeError: Error | null,
  additiveFees: QuoteFee[],
) => {
  const { selectFeatureFlag } = useFeatureFlagContext();
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
    if (!useMaxAmount || !isFeeReady || !sourceToken || !selectedQuote) {
      return;
    }

    const bridgeFee =
      isNativeToken(sourceToken) && isCrossChainTransfer(selectedQuote)
        ? getNativeBridgeFee(
            selectedQuote,
            selectFeatureFlag(FeatureVars.FUSION_BRIDGE_FEE_SAFETY_BPS),
          )
        : 0n;

    const additiveFeesAmount = sumAdditiveFees(
      sourceToken,
      additiveFees,
      getBufferMultiplierFromBps(
        selectFeatureFlag(FeatureVars.FUSION_ADDITIVE_FEES_BUFFER_BPS),
      ),
    );

    const feePaddingFactor = getBufferMultiplierFromBps(
      selectFeatureFlag(FeatureVars.FUSION_MAX_AMOUNT_GAS_SAFETY_BPS),
    );
    const paddedFee = bigToBigInt(
      bigintToBig(fee, sourceToken.decimals).mul(feePaddingFactor),
      sourceToken.decimals,
    );

    const maxAmount =
      sourceToken.balance -
      additiveFeesAmount -
      (isNativeToken(sourceToken) ? bridgeFee + paddedFee : 0n);

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
    selectFeatureFlag,
    additiveFees,
  ]);
};
