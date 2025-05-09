import {
  ExtensionConnectionEvent,
  OnboardingEvents,
  OnboardingState,
} from '@core/types';

export function onboardingUpdatedEventListener(
  evt: ExtensionConnectionEvent<OnboardingState>,
) {
  return evt.name === OnboardingEvents.ONBOARDING_UPDATED_EVENT;
}
