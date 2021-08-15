export interface OnboardingState {
  isOnBoarded: boolean;
}

export enum OnboardingPhase {
  CREATE_WALLET = 'create_wallet',
  IMPORT_WALLET = 'import_wallet',
  PASSWORD = 'password',
  CONFIRM = 'confirm',
  FINALIZE = 'finalize',
  RESTART = 'restart',
}
