import { NetworkContractToken } from '@avalabs/chains-sdk';

export enum ThemeVariant {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

export enum Languages {
  EN = 'en',
  DE = 'de-DE',
  ES = 'es-EM',
  JA = 'ja-JP',
  HI = 'hi-IN',
  KO = 'ko-KR',
  RU = 'ru-RU',
  TR = 'tr-TR',
  ZHZN = 'zh-ZN',
  ZHTW = 'zh-TW',
}

export type TokensVisibility = {
  [key: string]: boolean;
};

type CustomTokens = {
  [chain: string]: NetworkContractToken;
};

export interface SettingsState {
  currency: string;
  customTokens: CustomTokens;
  showTokensWithoutBalances: boolean;
  theme: ThemeVariant;
  tokensVisibility: TokensVisibility;
  isDefaultExtension: boolean;
  analyticsConsent: boolean;
  language: Languages;
}

export const SETTINGS_STORAGE_KEY = 'settings';
export const SETTINGS_UNENCRYPTED_STORAGE_KEY = 'setting_unencrypted';

export enum SettingsEvents {
  SETTINGS_UPDATED = 'SettingsEvents: SETTINGS_UPDATED',
}

// TODO: bring back the commented currenies when the glacier supports them
export const CURRENCIES: {
  name: string;
  symbol: string;
}[] = [
  { name: 'United States Dollar', symbol: 'USD' },
  { name: 'Euro', symbol: 'EUR' },
  // { name: 'Japanese Yen', symbol: 'JPY' },
  { name: 'Pound Sterling', symbol: 'GBP' },
  { name: 'Australian Dollar', symbol: 'AUD' },
  { name: 'Canadian Dollar', symbol: 'CAD' },
  { name: 'Swiss Franc', symbol: 'CHF' },
  // { name: 'Chinese Renminbi', symbol: 'CNH' },
  { name: 'Hong Kong Dollar', symbol: 'HKD' },
  // { name: 'New Zealand Dollar', symbol: 'NZD' },
];
