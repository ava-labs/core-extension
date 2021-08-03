export interface OnboardingState {
  password?: string;
  phase: OnboardingPhase;
  isOnBoarded: boolean;
}

export enum OnboardingPhase {
  NOT_STARTED = 'not_started',
  MNEMONIC = 'mnemonic',
  PASSWORD = 'password',
  KEYBOARD_SHORTCUT = 'keyboard_shortcut',
  FINALIZE = 'finalize',
}

export interface OnboardingStepper {
  phase: OnboardingPhase;
  next?: OnboardingStepper;
  back?: OnboardingStepper;
}
