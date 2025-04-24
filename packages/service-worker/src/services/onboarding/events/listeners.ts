import { ExtensionConnectionEvent } from '../../../connections/models';
import { OnboardingState } from '@core/types/src/models';
import { OnboardingEvents } from '@core/types/src/models';

export function onboardingUpdatedEventListener(
  evt: ExtensionConnectionEvent<OnboardingState>,
) {
  return evt.name === OnboardingEvents.ONBOARDING_UPDATED_EVENT;
}
