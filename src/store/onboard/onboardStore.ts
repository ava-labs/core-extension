import { makeAutoObservable } from 'mobx';
import { clearPersist, stopPersist, startPersist } from 'mobx-persist-store';
import { persistStore } from '@src/utils/mobx';

export enum OnboardStepPhase {
  NOT_STARTED = 'not_started',
  MNEMONIC = 'mnemonic',
  PASSWORD = 'password',
  KEYBOARD_SHORTCUT = 'keyboard_shortcut',
  FINALIZE = 'finalize',
}

export interface OnboardStep {
  step: OnboardStepPhase;
  next?: OnboardStep;
  back?: OnboardStep;
}

/**
 * Creating a thin doubly linked list to contain the steps logic and
 * steps hierarchy. Dont change order of array or will change order of steps.
 */
const steps = [
  OnboardStepPhase.MNEMONIC,
  OnboardStepPhase.PASSWORD,
  OnboardStepPhase.KEYBOARD_SHORTCUT,
  OnboardStepPhase.FINALIZE,
].reduce((acc: OnboardStep[], step) => {
  const [lastStep] = acc.slice(-1);

  const nextStep = {
    step,
    ...(lastStep ? { back: lastStep } : {}),
  };

  if (lastStep) lastStep.next = nextStep;

  return [...acc, nextStep];
}, []);

const createWalletOnboardSteps = new Map<OnboardStep['step'], OnboardStep>(
  steps.map((nextStep) => [nextStep.step, nextStep])
);

class OnboardStore {
  isOnboarded = false;
  currentPosition = OnboardStepPhase.NOT_STARTED;
  password = '';

  constructor() {
    makeAutoObservable(this);
    persistStore(this, ['currentPosition', 'isOnboarded'], 'OnboardStore');
  }

  setPosition(position: OnboardStepPhase) {
    this.currentPosition = position;
  }

  setPassword(password: string) {
    this.password = password;
  }

  getStepForPhase(phase: OnboardStepPhase) {
    return createWalletOnboardSteps.get(phase);
  }

  getCurrentStep() {
    return createWalletOnboardSteps.get(this.currentPosition);
  }

  clearPassword() {
    this.password = '';
  }

  markOnboarded() {
    this.isOnboarded = true;
    this.currentPosition = OnboardStepPhase.FINALIZE;
  }

  onboardIsInProgress() {
    return (
      !this.isOnboarded &&
      this.currentPosition !== OnboardStepPhase.NOT_STARTED &&
      this.currentPosition !== OnboardStepPhase.FINALIZE
    );
  }

  async clearStore() {
    await clearPersist(this);
  }

  stopPersist() {
    stopPersist(this);
  }

  startPersist() {
    startPersist(this);
  }
}

export default OnboardStore;
