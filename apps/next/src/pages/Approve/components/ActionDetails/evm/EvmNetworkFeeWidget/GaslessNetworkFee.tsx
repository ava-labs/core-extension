import { useCallback } from 'react';
import { DisplayData } from '@avalabs/vm-module-types';
import { useTranslation } from 'react-i18next';
import { Collapse, Stack } from '@avalabs/k2-alpine';

import { Action, EvmNetwork, GaslessPhase } from '@core/types';

import { useGasless } from '../../../../hooks';
import { DetailsSection } from '../../generic/DetailsSection';

import {
  GaslessSwitchRow,
  InsufficientFeeWarning,
  ManualFeeControls,
} from './components';
import { useEvmTransactionFee } from './hooks/useEvmTransactionFee';

type GaslessNetworkFeeProps = {
  action: Action<DisplayData>;
  network: EvmNetwork;
};

export const GaslessNetworkFee = ({
  action,
  network,
}: GaslessNetworkFeeProps) => {
  const { t } = useTranslation();
  const feeResult = useEvmTransactionFee({ action, network });
  const { isLoading, nativeToken, hasEnoughForNetworkFee, choosePreset } =
    feeResult;

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
          <ManualFeeControls feeResult={feeResult} />
        </Collapse>
      </DetailsSection>
      <InsufficientFeeWarning
        visible={
          !isLoading &&
          Boolean(nativeToken) &&
          !hasEnoughForNetworkFee &&
          !isGaslessOn
        }
      />
    </Stack>
  );
};
