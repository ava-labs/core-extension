export enum SettingsPages {
  MAIN_PAGE = 'MAIN_PAGE',
  CURRENCIES = 'CURRENCIES',
  SECURITY_AND_PRIVACY = 'SECURITY_AND_PRIVACY',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  RECOVERY_PHRASE = 'RECOVERY_PHRASE',
}

export interface SettingsPageProps {
  navigateTo: (page: SettingsPages) => void;
  goBack: () => void;
}
