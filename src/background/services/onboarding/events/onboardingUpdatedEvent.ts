import { combineLatest, filter, map } from 'rxjs';
import { wallet$ } from '@avalabs/wallet-react-components';
import { onboardingState$ } from '../onboardingState';
import { OnboardingEvents } from './models';

export function onboardingUpdatedEvent() {
  return combineLatest([onboardingState$, wallet$]).pipe(
    filter(
      ([onboarded, wallet]) => !!(onboarded && onboarded.isOnBoarded && wallet)
    ),
    map(() => ({
      name: OnboardingEvents.ONBOARDING_UPDATED_EVENT,
      value: { isOnBoarded: true },
    }))
  );
}
