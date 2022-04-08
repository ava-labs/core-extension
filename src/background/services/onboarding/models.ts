export interface OnboardingState {
  isOnBoarded: boolean;
  reImportMnemonic?: boolean;
  initialOpen: boolean;
}

export enum OnboardingPhase {
  CREATE_WALLET = 'create_wallet',
  IMPORT_WALLET = 'import_wallet',
  PASSWORD = 'password',
  CONFIRM = 'confirm',
  FINALIZE = 'finalize',
  RESTART = 'restart',
  LEDGER = 'ledger',
  EXISTING = 'existing',
  LEDGER_TROUBLE = 'ledger_trouble',
  ANALYTICS_CONSENT = 'analytics_consent',
}
