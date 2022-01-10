import { TokenListDict } from '@avalabs/wallet-react-components';

export enum ThemeVariant {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

type TokensVisibility = {
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
}
