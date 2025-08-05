import { NetworkContractToken } from '@avalabs/core-chains-sdk';
import { EnsureDefined } from './util-types';

/**
 * @deprecated Use ColorScheme instead
 * This is used in an old migration.
 */
export enum ThemeVariant {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

export type ColorTheme = 'DARK' | 'LIGHT' | 'SYSTEM';

export enum Languages {
  EN = 'en',
  DE = 'de-DE',
  ES = 'es-EM',
  FR = 'fr-FR',
  JA = 'ja-JP',
  HI = 'hi-IN',
  KO = 'ko-KR',
  RU = 'ru-RU',
  TR = 'tr-TR',
  ZHCN = 'zh-CN',
  ZHTW = 'zh-TW',
}

export enum LanguageLinks {
  EN = 'en',
  DE = 'de',
  ES = 'es',
  FR = 'fr',
  JA = 'ja',
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  HI = 'en', // does not have translated pages in HelpCenter TODO: modify if we are having more external pages with HI language set up
  KO = 'ko',
  RU = 'ru',
  TR = 'tr',
  ZHCN = 'zh-CN',
  ZHTW = 'zh-TW',
}

export type TokensVisibility = {
  [key: string]: boolean;
};

export type CollectiblesVisibility = {
  [key: string]: boolean;
};

export type AddCustomTokenData = {
  token: EnsureDefined<NetworkContractToken, 'chainId'>;
};

type CustomTokens = {
  [chain: string]: {
    [tokenAddress: string]: NetworkContractToken;
  };
};

export type ViewMode = 'floating' | 'sidebar';
export interface SettingsState {
  currency: string;
  customTokens: CustomTokens;
  showTokensWithoutBalances: boolean;
  theme: ColorTheme;
  tokensVisibility: TokensVisibility;
  collectiblesVisibility: CollectiblesVisibility;
  analyticsConsent: AnalyticsConsent;
  language: Languages;
  coreAssistant: boolean;
  preferredView: ViewMode;
  showTrendingTokens: boolean;
}

export const SETTINGS_STORAGE_KEY = 'settings';
export const SETTINGS_UNENCRYPTED_STORAGE_KEY = 'setting_unencrypted';

export enum SettingsEvents {
  SETTINGS_UPDATED = 'SettingsEvents: SETTINGS_UPDATED',
}

// TODO: bring back the commented currencies when the glacier supports them
export enum CURRENCIES {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  AUD = 'AUD',
  CAD = 'CAD',
  CHF = 'CHF',
  HKD = 'HKD',
  // JPY: 'JPY',
  // CNH: 'CNH',
  // NZD: 'NZD'
}

interface Currency {
  symbol: CURRENCIES;
  label: string;
  countryCode: string;
}

export const currencies: Currency[] = [
  {
    symbol: CURRENCIES.USD,
    label: 'United States Dollar',
    countryCode: 'us',
  },
  {
    symbol: CURRENCIES.EUR,
    label: 'Euro',
    countryCode: 'eu',
  },
  {
    symbol: CURRENCIES.GBP,
    label: 'Pound Sterling',
    countryCode: 'gb',
  },
  {
    symbol: CURRENCIES.AUD,
    label: 'Australian Dollar',
    countryCode: 'au',
  },
  {
    symbol: CURRENCIES.CAD,
    label: 'Canadian Dollar',
    countryCode: 'ca',
  },
  {
    symbol: CURRENCIES.CHF,
    label: 'Swiss Franc',
    countryCode: 'ch',
  },
  {
    symbol: CURRENCIES.HKD,
    label: 'Hong Kong Dollar',
    countryCode: 'hk',
  },
];

export enum AnalyticsConsent {
  Pending = 'pending',
  Approved = 'approved',
  Denied = 'denied',
}
