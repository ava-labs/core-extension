import { DisplayData } from '@avalabs/vm-module-types';
import { Fade, Stack, Typography } from '@avalabs/k2-alpine';

import { Action, EvmNetwork } from '@core/types';

import { DetailsSection } from '../../generic/DetailsSection';
import { TotalFeeAmount } from '../../generic/NetworkFee';

import { GaslessSwitchRow } from './components/GaslessSwitch';
import { useEvmTransactionFee } from './hooks/useEvmTransactionFee';
import { FeePresetSelector } from './components';
import { useTranslation } from 'react-i18next';

type EvmNetworkFeeWidgetProps = {
  action: Action<DisplayData>;
  network: EvmNetwork;
};

export const EvmNetworkFeeWidget = ({
  action,
  network,
}: EvmNetworkFeeWidgetProps) => {
  const { t } = useTranslation();
  const {
    gasLimit,
    feePreset,
    choosePreset,
    fee,
    nativeToken,
    customPreset,
    feeDecimals,
    isLoading,
    hasEnoughForNetworkFee,
  } = useEvmTransactionFee({
    action,
    network,
  });

  return (
    <Stack gap={1}>
      <DetailsSection>
        <GaslessSwitchRow />
        <Stack gap={1}>
          {!isLoading && (
            <>
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
            </>
          )}
        </Stack>
      </DetailsSection>
      <Fade in={!isLoading && Boolean(nativeToken) && !hasEnoughForNetworkFee}>
        <Stack textAlign="center">
          <Typography variant="caption" color="error.main">
            {t('Insufficient balance for fee')}
          </Typography>
        </Stack>
      </Fade>
    </Stack>
  );
};
