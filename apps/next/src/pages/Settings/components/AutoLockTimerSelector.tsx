import { ButtonProps, Typography } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { AutoLockTimer } from '@core/types';
import { useAnalyticsContext, useSettingsContext } from '@core/ui';
import { SelectButton } from '@/components/SelectButton';

const autoLockOptions: AutoLockTimer[] = [5, 10, 15, 20, 30];

export const AutoLockTimerSelector = (props: ButtonProps) => {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const { autoLockTimer, setAutoLockTimer } = useSettingsContext();

  const formatLabel = (minutes: AutoLockTimer) =>
    t('{{minutes}} minutes', { minutes });

  const selectedOption = autoLockOptions.find((o) => o === autoLockTimer);

  return (
    <SelectButton
      data-testid="settings-auto-lock-timer"
      renderValue={
        <Typography variant="subtitle2" color="text.secondary">
          {selectedOption ? formatLabel(selectedOption) : t('Select')}
        </Typography>
      }
      options={autoLockOptions.map((option) => ({
        key: `${option}`,
        label: formatLabel(option),
        value: `${option}`,
        dataTestId: `auto-lock-timer-selector-${option}`,
        selected: option === autoLockTimer,
        selectValue: option,
      }))}
      onOptionSelect={async (selectValue) => {
        await setAutoLockTimer(selectValue);
        capture('AutoLockTimerChanged', { autoLockTimer: selectValue });
      }}
      {...props}
    />
  );
};
