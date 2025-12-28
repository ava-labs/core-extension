import { FC } from 'react';
import { Stack } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { FeeSetting } from '@core/types';
import { FeePresetButton } from '@/pages/Approve/components/ActionDetails/generic/NetworkFee';

type FeeSettingsSelectorProps = {
  value: FeeSetting;
  onChange: (value: FeeSetting) => void;
};

const feeSettings: { value: FeeSetting; label: string }[] = [
  { value: 'low', label: 'Slow' },
  { value: 'medium', label: 'Normal' },
  { value: 'high', label: 'Fast' },
];

export const FeeSettingsSelector: FC<FeeSettingsSelectorProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <Stack
      direction="row"
      alignItems="center"
      py={1}
      gap={0.75}
      sx={{ width: '100%', px: 0 }}
    >
      {feeSettings.map((fee) => (
        <FeePresetButton
          key={fee.value}
          color={value === fee.value ? 'primary' : 'secondary'}
          onClick={() => onChange(fee.value)}
          fullWidth={false}
          sx={{ flex: 1, minWidth: 0, width: 'auto' }}
        >
          {t(fee.label)}
        </FeePresetButton>
      ))}
    </Stack>
  );
};
