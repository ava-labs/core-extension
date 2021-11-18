export enum SettingsPages {
  ADVANCED = 'ADVANCED',
  MAIN_PAGE = 'MAIN_PAGE',
  NETWORK = 'NETWORK',
  CURRENCIES = 'CURRENCIES',
  SECURITY_AND_PRIVACY = 'SECURITY_AND_PRIVACY',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  RECOVERY_PHRASE = 'RECOVERY_PHRASE',
}

export interface SettingsPageProps {
  width: string;
  navigateTo: (page: SettingsPages) => void;
  goBack: () => void;
}
