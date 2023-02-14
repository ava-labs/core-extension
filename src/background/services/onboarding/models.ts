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
}

export enum OnboardingEvents {
  ONBOARDING_UPDATED_EVENT = 'ONBOARDING_UPDATED_EVENT',
}

export const ONBOARDING_STORAGE_KEY = 'onboarding';
