import { getFromStorage, saveToStorage } from '@src/utils/storage';
import { Signal, ValueCache } from 'micro-signals';
import { OnboardingStepper, OnboardingPhase, OnboardingState } from './models';

/**
 * Creating a thin doubly linked list to contain the steps logic and
 * steps hierarchy. Dont change order of array or will change order of steps.
 */
const steps = [
  OnboardingPhase.MNEMONIC,
  OnboardingPhase.PASSWORD,
  OnboardingPhase.KEYBOARD_SHORTCUT,
  OnboardingPhase.FINALIZE,
].reduce((acc: OnboardingStepper[], phase) => {
  const [lastStep] = acc.slice(-1);

  const nextStep = {
    phase,
    ...(lastStep ? { back: lastStep } : {}),
  };

  if (lastStep) lastStep.next = nextStep;

  return [...acc, nextStep];
}, []);

const ONBOARDING_STORAGE_KEY = 'onboarding';
const ONBOARDING_DEFAULT_STATE: OnboardingState = {
  password: '',
  phase: OnboardingPhase.NOT_STARTED,
  isOnBoarded: false,
};

const createWalletOnboardSteps = new Map<
  OnboardingStepper['phase'],
  OnboardingStepper
>(steps.map((nextStep) => [nextStep.phase, nextStep]));

const _onboarding = new Signal<OnboardingState>();

class OnboardingService {
  onboarding = _onboarding.cache(new ValueCache()).readOnly();

  constructor() {
    getFromStorage(ONBOARDING_STORAGE_KEY).then((store) => {
      if (store && store[ONBOARDING_STORAGE_KEY]) {
        _onboarding.dispatch(store[ONBOARDING_STORAGE_KEY]);
      } else {
        _onboarding.dispatch(ONBOARDING_DEFAULT_STATE);
      }
    });
  }

  private async update(newOnboardingState: OnboardingState) {
    const saved = await saveToStorage<{ onboarding: OnboardingState }>({
      onboarding: newOnboardingState,
    });
    _onboarding.dispatch(newOnboardingState);
    return saved;
  }

  async setPassword(password: string) {
    const onboarding = await this.onboarding.promisify();
    return this.update({
      ...onboarding,
      password,
    });
  }

  async clearPassword() {
    const onboarding = await this.onboarding.promisify();
    return this.update({
      ...onboarding,
      password: '',
    });
  }

  async setPhase(phase: OnboardingPhase) {
    const onboarding = await this.onboarding.promisify();
    return this.update({ ...onboarding, phase });
  }

  getStepperForPhase(phase: OnboardingPhase) {
    return createWalletOnboardSteps.get(phase);
  }

  async getCurrentStep() {
    const onboarding = await this.onboarding.promisify();
    return createWalletOnboardSteps.get(onboarding.phase);
  }

  async markOnboarded() {
    const onboarding = await this.onboarding.promisify();
    return this.update({
      ...onboarding,
      isOnBoarded: true,
      phase: OnboardingPhase.FINALIZE,
    });
  }

  async onboardIsInProgress() {
    const onboarding = await this.onboarding.promisify();
    return (
      !onboarding.isOnBoarded &&
      onboarding.phase !== OnboardingPhase.NOT_STARTED &&
      onboarding.phase !== OnboardingPhase.FINALIZE
    );
  }
}

export const onboardingService = new OnboardingService();
