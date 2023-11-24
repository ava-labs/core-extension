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
  LEDGER_TROUBLE = 'ledger_trouble',
  ANALYTICS_CONSENT = 'analytics_consent',
  KEYSTONE = 'keystone',
  KEYSTONE_TUTORIAL = 'keystone_tutorial',
  SEEDLESS_GOOGLE = 'seedless_google',
}

export enum OnboardingURLs {
  ONBOARDING_HOME = '/onboarding',
  CREATE_WALLET = '/onboarding/create-wallet',
  SEED_PHRASE = '/onboarding/seed-phrase',
  KEYSTONE = '/onboarding/keystone',
  LEDGER = '/onboarding/ledger',
  CREATE_PASSWORD = '/onboarding/create-password',
  ANALYTICS_CONSENT = '/onboarding/analytics-consent',
  LEDGER_TROUBLE = '/onboarding/ledger-trouble',
  SIGN_IN = '/onboarding/sign-in',
  RECOVERY_METHODS = '/onboarding/recovery-methods',
  RECOVERY_METHODS_LOGIN = '/onboarding/recovery-methods-login',
}

export const ONBOARDING_EVENT_NAMES = {
  [OnboardingPhase.CREATE_WALLET]: 'OnboardingCreateNewWalletSelected',
  [OnboardingPhase.IMPORT_WALLET]: 'OnboardingImportMnemonicSelected',
  [OnboardingPhase.LEDGER]: 'OnboardingImportLedgerSelected',
  [OnboardingPhase.KEYSTONE]: 'OnboardingKeystoneSelected',
  [OnboardingPhase.SEEDLESS_GOOGLE]: 'OnboardingSeedlessGoogleSelected',
};

export enum OnboardingEvents {
  ONBOARDING_UPDATED_EVENT = 'ONBOARDING_UPDATED_EVENT',
}

export const ONBOARDING_STORAGE_KEY = 'onboarding';
