import { filter, map, OperatorFunction } from 'rxjs';
import { OnboardingPhase } from '../models';
import { onboardingCurrentPhase } from '../onboardingFlows';
import { OnboardingEvents } from './models';

export function onboardingPhaseUpdatedEvent() {
  return onboardingCurrentPhase.pipe(
    filter((value) => value !== undefined) as OperatorFunction<
      OnboardingPhase | undefined,
      OnboardingPhase
    >,
    map((value) => ({
      name: OnboardingEvents.ONBOARDING_PHASE_UPDATED_EVENT,
      value,
    }))
  );
}
