import { MenuItem, Select, toast } from '@avalabs/k2-alpine';
import { ColorScheme } from '@core/types';
import { useAnalyticsContext, useSettingsContext } from '@core/ui';
import { useTranslation } from 'react-i18next';

const isColorScheme = (value: string): value is ColorScheme => {
  return ['LIGHT', 'DARK', 'SYSTEM'].includes(value);
};

export const ThemeSelector = () => {
  const { theme, updateTheme } = useSettingsContext();
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  return (
    <Select
      label="Theme"
      value={theme}
      onChange={async (e) => {
        const value = e.target.value;
        if (!value || typeof value !== 'string' || !isColorScheme(value)) {
          toast.error(t('Invalid theme value'));
          return;
        }
        try {
          await updateTheme(value as ColorScheme);
          capture('ThemeSettingChanged', { theme: value });

          toast.success(t('Theme updated successfully'));
        } catch {
          toast.error(t('Failed to update theme'));
        }
      }}
    >
      <MenuItem key={'LIGHT'} value={'LIGHT'} style={{ minHeight: 'unset' }}>
        {t('Light')}
      </MenuItem>
      <MenuItem key={'DARK'} value={'DARK'} style={{ minHeight: 'unset' }}>
        {t('Dark')}
      </MenuItem>
      <MenuItem key={'SYSTEM'} value={'SYSTEM'} style={{ minHeight: 'unset' }}>
        {t('System')}
      </MenuItem>
    </Select>
  );
};
