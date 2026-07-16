import { FC } from 'react';
import { Stack } from '@avalabs/k2-alpine';

import { TotalFeeAmount } from '../../../generic/NetworkFee';
import { UseEvmTransactionFeeResult } from '../hooks/useEvmTransactionFee/types';
import { FeePresetSelector } from './FeePresetSelector';

type ManualFeeControlsProps = {
  feeResult: UseEvmTransactionFeeResult;
};

export const ManualFeeControls: FC<ManualFeeControlsProps> = ({
  feeResult,
}) => {
  if (feeResult.isLoading) {
    return null;
  }

  const {
    feePreset,
    customPreset,
    choosePreset,
    nativeToken,
    gasLimit,
    feeDecimals,
    fee,
  } = feeResult;

  return (
    <Stack gap={1}>
      <FeePresetSelector
        feePreset={feePreset}
        customPreset={customPreset}
        choosePreset={choosePreset}
        nativeToken={nativeToken}
        gasLimit={gasLimit}
        feeDecimals={feeDecimals}
      />
      <TotalFeeAmount
        fee={fee.feeUnit.toString()}
        symbol={nativeToken?.symbol || ''}
        currencyValue={fee.feeUSD ?? 0}
      />
    </Stack>
  );
};
