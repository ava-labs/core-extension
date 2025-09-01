import { FC } from 'react';
import { Stack } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

import { FeePresetButton } from '../../../../generic/NetworkFee';
import { BtcFeePreset } from '../types';

type FeePresetSelectorProps = {
  feePreset: BtcFeePreset;
  choosePreset: (preset: BtcFeePreset) => void;
};

export const FeePresetSelector: FC<FeePresetSelectorProps> = ({
  feePreset,
  choosePreset,
}) => {
  const { t } = useTranslation();

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
        color={feePreset === 'slow' ? 'primary' : 'secondary'}
        onClick={() => choosePreset('slow')}
      >
        {t('Slow')}
      </FeePresetButton>
      <FeePresetButton
        color={feePreset === 'normal' ? 'primary' : 'secondary'}
        onClick={() => choosePreset('normal')}
      >
        {t('Normal')}
      </FeePresetButton>
      <FeePresetButton
        color={feePreset === 'fast' ? 'primary' : 'secondary'}
        onClick={() => choosePreset('fast')}
      >
        {t('Fast')}
      </FeePresetButton>
    </Stack>
  );
};
