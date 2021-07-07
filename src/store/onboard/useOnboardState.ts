import { useStore } from '../store';
import { OnboardStepPhase } from './onboardStore';

export function useOnboardState(phase: OnboardStepPhase) {
  const { onboardStore } = useStore();
  const step = onboardStore.getStepForPhase(phase);

  if (!step) {
    throw new Error(`useOnboardState called with a non state ${phase}`);
  }

  const goToNext = () => {
    step.next?.step && onboardStore.setPosition(step.next?.step);
  };

  const goBack = () => {
    step.back?.step && onboardStore.setPosition(step.back?.step);
  };

  return {
    goToNextOnboardingStep: step.next ? goToNext : undefined,
    goBackToPreviousOnboardingStep: step.back ? goBack : undefined,
    step,
  };
}
