import { skipToken, useQuery } from '@tanstack/react-query';
import { TransferManager, Quote } from '@avalabs/fusion-sdk';

import { FUSION_HYPERCORE_CAIP_ID, fromFusionCaipId } from '@core/common';
import { FeatureVars } from '@core/types';
import { useFeatureFlagContext, useNetworkFeeContext } from '@core/ui';

import { EstimatedFeeResult } from '../../types';

const isHypercoreFusionSource = (quote: Quote) =>
  quote.sourceChain.chainId === FUSION_HYPERCORE_CAIP_ID;

export const useNativeFeeEstimate = (
  manager: TransferManager | undefined,
  selectedQuote: Quote | null,
): EstimatedFeeResult => {
  const { getNetworkFee } = useNetworkFeeContext();
  const { selectFeatureFlag } = useFeatureFlagContext();

  // HyperCore is a read-only module — no EVM gas rates. Skip entirely so we
  // don't hit `getNetworkFee` (throws) or block Max / presets on feeError.
  const canEstimate =
    selectedQuote !== null &&
    manager !== undefined &&
    !isHypercoreFusionSource(selectedQuote);

  const {
    data: fee,
    error: feeError,
    isLoading: isFeeLoading,
  } = useQuery({
    queryKey: ['useNativeFeeEstimate', selectedQuote?.id],
    queryFn:
      canEstimate && selectedQuote && manager
        ? async () => {
            try {
              const fees = await getNetworkFee(
                fromFusionCaipId(selectedQuote.sourceChain.chainId),
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

              const estimate = await manager.estimateNativeFee(selectedQuote, {
                feeUnitsMarginBps: Number(
                  selectFeatureFlag(FeatureVars.FUSION_FEE_UNITS_MARGIN_BPS),
                ),
                overrides: {
                  feeRateTier: 'fast',
                  ...fees,
                },
              });

              return estimate;
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
    isFeeLoading: canEstimate && isFeeLoading,
    feeError: canEstimate ? feeError : null,
  };
};
