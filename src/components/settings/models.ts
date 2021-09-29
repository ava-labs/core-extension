export enum SettingsPages {
  MAIN_PAGE = 'MAIN_PAGE',
  CURRENCIES = 'CURRENCIES',
}

export interface SettingsPageProps {
  navigateTo: (page: SettingsPages) => void;
  goBack: () => void;
}
