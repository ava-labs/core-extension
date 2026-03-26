import { Quote } from '@avalabs/fusion-sdk';
import { bigToBigInt } from '@avalabs/core-utils-sdk';

import { bigintToBig } from '@core/common';
import { useFeatureFlagContext } from '@core/ui';
import { FeatureVars, FungibleTokenBalance, isNativeToken } from '@core/types';

import { getBufferMultiplierFromBps } from '../../lib/getBufferMultiplierFromBps';
import { sumAdditiveFees } from '../../lib/sumAdditiveFees';
import { getAdditiveFees } from '../../lib/getAdditiveFees';

type UseMaxSwapAmountProps = {
  fee: bigint | undefined;
  sourceToken: FungibleTokenBalance | undefined;
  minimalQuote: Quote | null;
};

export const useMaxSwapAmount = ({
  fee,
  sourceToken,
  minimalQuote,
}: UseMaxSwapAmountProps) => {
  const { selectFeatureFlag } = useFeatureFlagContext();

  if (typeof fee !== 'bigint' || !sourceToken || !minimalQuote) {
    return {
      isLoading: true,
      maxAmount: 0n,
      maxAmountFees: 0n,
    };
  }

  const additiveFeesAmount = sumAdditiveFees(
    sourceToken,
    getAdditiveFees(minimalQuote),
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

  const allFees =
    additiveFeesAmount + (isNativeToken(sourceToken) ? paddedFee : 0n);
  const maxAmount = sourceToken.balance - allFees;

  // Specifically allow negative amounts here so we can determine when
  // it's fees that are causing
  return {
    isLoading: false,
    maxAmountFees: allFees,
    maxAmount: maxAmount < 0n ? 0n : maxAmount,
  };
};
