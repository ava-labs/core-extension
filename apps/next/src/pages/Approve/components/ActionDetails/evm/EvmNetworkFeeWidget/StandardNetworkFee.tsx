import { useEffect } from 'react';
import { DisplayData } from '@avalabs/vm-module-types';
import { Stack } from '@avalabs/k2-alpine';

import { Action, EvmNetwork } from '@core/types';
import { useNetworkFeeContext } from '@core/ui';

import { DetailsSection } from '../../generic/DetailsSection';

import { InsufficientFeeWarning, ManualFeeControls } from './components';
import { useEvmTransactionFee } from './hooks/useEvmTransactionFee';

type StandardNetworkFeeProps = {
  action: Action<DisplayData>;
  network: EvmNetwork;
};

export const StandardNetworkFee = ({
  action,
  network,
}: StandardNetworkFeeProps) => {
  const feeResult = useEvmTransactionFee({ action, network });
  const { isLoading, nativeToken, hasEnoughForNetworkFee } = feeResult;

  // Gasless state lives in the shared NetworkFeeContext and persists across
  // approval screens, so clear any inherited eligibility/phase/toggle to keep
  // gasless fully disabled here.
  const { setGaslessDefaultValues } = useNetworkFeeContext();
  useEffect(() => {
    setGaslessDefaultValues();
  }, [setGaslessDefaultValues]);

  return (
    <Stack gap={1}>
      <DetailsSection>
        <ManualFeeControls feeResult={feeResult} />
      </DetailsSection>
      <InsufficientFeeWarning
        visible={!isLoading && Boolean(nativeToken) && !hasEnoughForNetworkFee}
      />
    </Stack>
  );
};
