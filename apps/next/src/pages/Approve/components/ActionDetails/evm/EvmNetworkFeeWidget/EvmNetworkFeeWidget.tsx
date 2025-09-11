import { useCallback } from 'react';
import { DisplayData } from '@avalabs/vm-module-types';
import { useTranslation } from 'react-i18next';
import { Collapse, Fade, Stack, Typography } from '@avalabs/k2-alpine';

import { Action, EvmNetwork, GaslessPhase } from '@core/types';

import { useGasless } from '../../../../hooks';
import { DetailsSection } from '../../generic/DetailsSection';
import { TotalFeeAmount } from '../../generic/NetworkFee';

import { GaslessSwitchRow } from './components/GaslessSwitch';
import { useEvmTransactionFee } from './hooks/useEvmTransactionFee';
import { FeePresetSelector } from './components';

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

  const { isGaslessOn, setIsGaslessOn, gaslessPhase, isGaslessEligible } =
    useGasless({ action });

  const onGaslessChange = useCallback(
    (_, checked: boolean) => {
      // Do not allow changing the gasless switch if the gasless funding failed already
      if (gaslessPhase === GaslessPhase.ERROR) {
        return;
      }
      choosePreset?.('high');
      setIsGaslessOn(checked);
    },
    [choosePreset, setIsGaslessOn, gaslessPhase],
  );

  return (
    <Stack gap={1}>
      <DetailsSection>
        <Collapse in={isGaslessEligible} mountOnEnter unmountOnExit>
          <GaslessSwitchRow
            checked={isGaslessOn}
            onChange={onGaslessChange}
            tooltip={
              gaslessPhase === GaslessPhase.ERROR
                ? t(
                    `We're unable to cover the gas fees for your transaction at this time. As a result, this feature has been disabled.`,
                  )
                : ''
            }
          />
        </Collapse>
        <Collapse in={!isGaslessOn} mountOnEnter unmountOnExit>
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
        </Collapse>
      </DetailsSection>
      <Fade
        in={!isLoading && Boolean(nativeToken) && !hasEnoughForNetworkFee}
        mountOnEnter
        unmountOnExit
      >
        <Stack textAlign="center">
          <Typography variant="caption" color="error.main">
            {t('Insufficient balance for fee')}
          </Typography>
        </Stack>
      </Fade>
    </Stack>
  );
};
