import { TokenListDict } from '@avalabs/wallet-react-components';

export enum ThemeVariant {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

export type TokensVisibility = {
  [key: string]: boolean;
};

type CustomTokens = {
  [chain: string]: TokenListDict;
};

export interface SettingsState {
  currency: string;
  customTokens: CustomTokens;
  showTokensWithoutBalances: boolean;
  theme: ThemeVariant;
  tokensVisibility: TokensVisibility;
  isDefaultExtension: boolean;
  analyticsConsent: boolean;
}

export const SETTINGS_STORAGE_KEY = 'settings';

export enum SettingsEvents {
  SETTINGS_UPDATED = 'SettingsEvents: SETTINGS_UPDATED',
}
