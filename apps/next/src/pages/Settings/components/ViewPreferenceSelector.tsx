import { SelectButton } from '@/components/SelectButton';
import { useOpenApp } from '@/hooks/useOpenApp';
import { ButtonProps, Typography } from '@avalabs/k2-alpine';
import { ViewMode } from '@core/types';
import { useAnalyticsContext, useSettingsContext } from '@core/ui';
import { useTranslation } from 'react-i18next';

export const ViewPreferenceSelector = (props: ButtonProps) => {
  const { preferredView, setPreferredView } = useSettingsContext();
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const openApp = useOpenApp();

  const selectedView =
    preferredView === 'floating' ? t('Floating') : t('Sidebar');

  const clickHandler = async (view: ViewMode) => {
    await setPreferredView(view);
    capture('ViewModeSwitched', {
      viewMode: view,
    });
    openApp({ closeWindow: true, viewMode: view });
  };

  return (
    <SelectButton
      renderValue={
        <Typography variant="subtitle2" color="text.secondary">
          {selectedView}
        </Typography>
      }
      options={[
        {
          key: 'floating',
          label: t('Floating'),
          value: 'floating',
          dataTestId: 'view-preference-selector-floating',
          selected: preferredView === 'floating',
          selectValue: 'floating',
        },
        {
          key: 'sidebar',
          label: t('Sidebar'),
          value: 'sidebar',
          dataTestId: 'view-preference-selector-sidebar',
          selected: preferredView === 'sidebar',
          selectValue: 'sidebar',
        },
      ]}
      onOptionSelect={clickHandler}
      {...props}
    />
  );
};
