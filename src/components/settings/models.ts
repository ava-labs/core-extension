export enum SettingsPages {
  ADD_CONTACT = 'ADD_CONTACT',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  CONTACT_LIST = 'CONTACT_LIST',
  CONTACT_PROFILE = 'CONTACT_PROFILE',
  CURRENCIES = 'CURRENCIES',
  MAIN_PAGE = 'MAIN_PAGE',
  RECOVERY_PHRASE = 'RECOVERY_PHRASE',
  SECURITY_AND_PRIVACY = 'SECURITY_AND_PRIVACY',
  CONNECTED_SITES = 'CONNECTED_SITES',
  LEDGER = 'LEDGER',
  LEGAL = 'LEGAL',
  ADVANCED = 'ADVANCED',
  LANGUAGE = 'LANGUAGE',
}

export interface SettingsPageProps {
  width: string;
  navigateTo: (page: SettingsPages) => void;
  goBack: () => void;
  onClose?: () => void;
}
