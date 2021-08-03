import { onboardingService } from '@src/background/services';
import { OnboardingPhase } from '@src/background/services/onboarding/models';
import { useStore } from '../store';
import { OnboardStepPhase } from './onboardStore';

export function useOnboardState(phase: OnboardingPhase) {
  const step = onboardingService.getStepperForPhase(phase);

  if (!step) {
    throw new Error(`useOnboardState called with a non state ${phase}`);
  }

  const goToNext = () => {
    step.next?.phase && onboardingService.setPhase(step.next?.phase);
  };

  const goBack = () => {
    step.back?.phase && onboardingService.setPhase(step.back?.phase);
  };

  return {
    goToNextOnboardingStep: step.next ? goToNext : undefined,
    goBackToPreviousOnboardingStep: step.back ? goBack : undefined,
    step,
  };
}
