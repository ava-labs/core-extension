import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { OnboardingPhase, OnboardingState } from '../models';
import { OnboardingEvents } from './models';

export function onboardingUpdatedEventListener(
  evt: ExtensionConnectionEvent<OnboardingState>
) {
  return evt.name === OnboardingEvents.ONBOARDING_UPDATED_EVENT;
}

export function onboardingPhaseUpdatedEventListener(
  evt: ExtensionConnectionEvent<OnboardingPhase>
) {
  return evt.name === OnboardingEvents.ONBOARDING_PHASE_UPDATED_EVENT;
}
