import { skipToken, useQuery } from '@tanstack/react-query';
import { TransferManager, Quote } from '@avalabs/fusion-sdk';

import { FeatureVars } from '@core/types';
import { useFeatureFlagContext, useNetworkFeeContext } from '@core/ui';

import { EstimatedFeeResult } from '../../types';

export const useNativeFeeEstimate = (
  manager: TransferManager | undefined,
  selectedQuote: Quote | null,
): EstimatedFeeResult => {
  const { getNetworkFee } = useNetworkFeeContext();
  const { selectFeatureFlag } = useFeatureFlagContext();
  const {
    data: fee,
    error: feeError,
    isLoading: isFeeLoading,
  } = useQuery({
    queryKey: ['useNativeFeeEstimate', selectedQuote?.id],
    queryFn:
      selectedQuote && manager
        ? async () => {
            try {
              const fees = await getNetworkFee(
                selectedQuote?.sourceChain.chainId,
              )
                .then((presets) => ({
                  maxFeePerGas: presets?.high.maxFeePerGas,
                  maxPriorityFeePerGas: presets?.high.maxPriorityFeePerGas,
                }))
                .catch((error) => {
                  console.error('[useNativeFeeEstimate]', {
                    error,
                    message: 'Unable to fetch the fee rates',
                  });

                  // Not throwing an error here, this won't necessarily cause the tranaction to fail.
                  return null;
                });

              return await manager.estimateNativeFee(selectedQuote, {
                feeUnitsMarginBps: Number(
                  selectFeatureFlag(FeatureVars.FUSION_FEE_UNITS_MARGIN_BPS),
                ),
                overrides: {
                  feeRateTier: 'fast',
                  ...fees,
                },
              });
            } catch (error) {
              console.error('[useNativeFeeEstimate]', {
                error,
                message: 'Error estimating native fee',
              });
              throw error;
            }
          }
        : skipToken,
    retry: false,
    select: (estimate) => estimate.totalFee,
  });

  return {
    fee,
    isFeeLoading,
    feeError,
  };
};
