export interface OnboardingState {
  isOnBoarded: boolean;
}

export enum OnboardingPhase {
  CREATE_WALLET = 'create_wallet',
  IMPORT_WALLET = 'import_wallet',
  PASSWORD = 'password',
  FINALIZE = 'finalize',
  RESTART = 'restart',
}

export interface OnboardingStepper {
  phase: OnboardingPhase;
  next?: OnboardingStepper;
  back?: OnboardingStepper;
}
