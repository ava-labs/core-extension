import { FC, useState } from 'react';
import { Stack } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

import { FeeRate, NativeTokenBalance } from '@core/types';

import { SlideUpDialog } from '@/components/Dialog';

import { FeePresetButton } from '../../../generic/NetworkFee';
import { CustomGasSettings } from './CustomGasSettings';
import { EvmFeePreset } from '../types';

type FeePresetSelectorProps = {
  gasLimit: number;
  feePreset: EvmFeePreset;
  customPreset?: FeeRate;
  nativeToken: NativeTokenBalance;
  choosePreset: (preset: EvmFeePreset, feeRate?: FeeRate) => void;
  feeDecimals: number;
};

export const FeePresetSelector: FC<FeePresetSelectorProps> = ({
  gasLimit,
  feePreset,
  nativeToken,
  choosePreset,
  customPreset,
  feeDecimals,
}) => {
  const { t } = useTranslation();

  const [dialogAnchor, setDialogAnchor] = useState<HTMLButtonElement | null>(
    null,
  );

  const customGasOpen = Boolean(dialogAnchor);
  const closeDialog = () => setDialogAnchor(null);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      py={1}
      gap={0.75}
      px={2}
    >
      <FeePresetButton
        color={feePreset === 'low' ? 'primary' : 'secondary'}
        onClick={() => choosePreset('low')}
      >
        {t('Slow')}
      </FeePresetButton>
      <FeePresetButton
        color={feePreset === 'medium' ? 'primary' : 'secondary'}
        onClick={() => choosePreset('medium')}
      >
        {t('Normal')}
      </FeePresetButton>
      <FeePresetButton
        color={feePreset === 'high' ? 'primary' : 'secondary'}
        onClick={() => choosePreset('high')}
      >
        {t('Fast')}
      </FeePresetButton>
      <FeePresetButton
        color={feePreset === 'custom' ? 'primary' : 'secondary'}
        onClick={(ev) => setDialogAnchor(ev.currentTarget)}
      >
        {t('Custom')}
      </FeePresetButton>

      {customPreset && (
        <SlideUpDialog open={customGasOpen} onClose={closeDialog}>
          <CustomGasSettings
            customPreset={customPreset}
            nativeToken={nativeToken}
            gasLimit={gasLimit}
            onSave={(feeRate) => {
              choosePreset('custom', feeRate);
              closeDialog();
            }}
            onBack={closeDialog}
            feeDecimals={feeDecimals}
          />
        </SlideUpDialog>
      )}
    </Stack>
  );
};
