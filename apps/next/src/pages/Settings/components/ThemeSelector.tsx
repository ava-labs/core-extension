import { ButtonProps, Typography } from '@avalabs/k2-alpine';
import { ColorTheme } from '@core/types';
import { useAnalyticsContext, useSettingsContext } from '@core/ui';
import { useTranslation } from 'react-i18next';
import { SelectButton } from '../../../components/SelectButton';

const colorSchemeOptions: ColorTheme[] = ['LIGHT', 'DARK', 'SYSTEM'];

export const ThemeSelector = (props: ButtonProps) => {
  const { theme: selectedColorScheme, updateTheme } = useSettingsContext();
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();

  const getThemeLabel = (scheme: ColorTheme) => {
    switch (scheme) {
      case 'LIGHT':
        return t('Light');
      case 'DARK':
        return t('Dark');
      case 'SYSTEM':
        return t('System');
    }
  };

  const clickHandler = async (scheme: ColorTheme) => {
    await updateTheme(scheme);
    capture(`ThemeSettingChanged`, {
      theme: scheme,
    });
  };

  return (
    <SelectButton
      renderValue={
        <Typography variant="subtitle2" color="text.secondary">
          {getThemeLabel(selectedColorScheme)}
        </Typography>
      }
      options={colorSchemeOptions.map((scheme) => ({
        key: scheme,
        label: getThemeLabel(scheme),
        value: scheme,
        dataTestId: `theme-selector-menu-item-${scheme}`,
        selected: scheme === selectedColorScheme,
        selectValue: scheme,
      }))}
      onOptionSelect={clickHandler}
      {...props}
    />
  );
};
