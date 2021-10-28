export enum ThemeVariant {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}
export interface SettingsState {
  currency: string;
  showTokensWithoutBalances: boolean;
  theme: ThemeVariant;
}
