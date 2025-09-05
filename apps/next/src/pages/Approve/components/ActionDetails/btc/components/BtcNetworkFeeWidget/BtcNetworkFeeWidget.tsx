import { FC } from 'react';
import { DisplayData } from '@avalabs/vm-module-types';
import { useTranslation } from 'react-i18next';
import { Fade, Stack, Typography } from '@avalabs/k2-alpine';

import { Action, BtcNetwork } from '@core/types';

import { DetailsSection } from '../../../generic/DetailsSection';
import { TotalFeeAmount } from '../../../generic/NetworkFee';

import { useBtcTransactionFee } from './hooks/useBtcTransactionFee';
import { FeePresetSelector } from './components';

type BtcNetworkFeeWidget = {
  action: Action<DisplayData>;
  network: BtcNetwork;
};

export const BtcNetworkFeeWidget: FC<BtcNetworkFeeWidget> = ({
  action,
  network,
}) => {
  const { t } = useTranslation();
  const {
    fee,
    feePreset,
    choosePreset,
    nativeToken,
    isLoading,
    hasEnoughForNetworkFee,
  } = useBtcTransactionFee({
    action,
    network,
  });

  return (
    <Stack gap={1}>
      <DetailsSection>
        <Stack gap={1}>
          {!isLoading && (
            <>
              <FeePresetSelector
                feePreset={feePreset}
                choosePreset={choosePreset}
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
