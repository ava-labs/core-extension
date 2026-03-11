import { skipToken, useQuery } from '@tanstack/react-query';
import { TransferManager, Quote } from '@avalabs/fusion-sdk';

import { EstimatedFeeResult } from '../../types';
import { NATIVE_FEE_UNITS_MARGIN_BPS } from '../../fusion-config';

export const useNativeFeeEstimate = (
  manager: TransferManager | undefined,
  selectedQuote: Quote | null,
): EstimatedFeeResult => {
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
              return await manager.estimateNativeFee(selectedQuote, {
                feeUnitsMarginBps: NATIVE_FEE_UNITS_MARGIN_BPS,
                overrides: {
                  feeRateTier: 'fast',
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
