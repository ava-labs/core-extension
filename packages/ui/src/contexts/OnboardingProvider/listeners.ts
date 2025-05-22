import {
  ExtensionConnectionEvent,
  OnboardingEvents,
  OnboardingState,
} from '@core/types';

export function onboardingUpdatedEventListener(
  evt: ExtensionConnectionEvent,
): evt is ExtensionConnectionEvent<OnboardingState> {
  return evt.name === OnboardingEvents.ONBOARDING_UPDATED_EVENT;
}
