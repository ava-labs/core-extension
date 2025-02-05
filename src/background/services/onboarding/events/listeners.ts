import type { ExtensionConnectionEvent } from '@src/background/connections/models';
import type { OnboardingState } from '../models';
import { OnboardingEvents } from '../models';

export function onboardingUpdatedEventListener(
  evt: ExtensionConnectionEvent<OnboardingState>,
) {
  return evt.name === OnboardingEvents.ONBOARDING_UPDATED_EVENT;
}
