import { SettingsPages } from '@core/ui';

export interface SettingsPageProps {
  width: string;
  navigateTo: (page: SettingsPages) => void;
  goBack: () => void;
  onClose?: () => void;
  showNotificationDotOn?: SettingsPages[];
}
