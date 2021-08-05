import { filter, firstValueFrom, map, mergeMap, Observable, take } from 'rxjs';
import {
  ExtensionConnectionEvent,
  ExtensionConnectionMessage,
} from '../../connections/models';
import { OnboardingPhase, OnboardingState } from './models';
import { onboardingService } from './onboarding';

import { onboardingFromStorage } from './storage';

export async function getIsOnBoarded(request: ExtensionConnectionMessage) {
  const result = await firstValueFrom(onboardingFromStorage());
  return {
    ...request,
    result,
  };
}

const ONBOARDING_UPDATED_EVENT = 'onboarding_finalized';
export function onboardingUpdatedEvent(): Observable<
  ExtensionConnectionEvent<OnboardingState>
> {
  return onboardingService.phase.pipe(
    filter((phase) => OnboardingPhase.FINALIZE === phase),
    mergeMap(() => {
      return firstValueFrom(onboardingFromStorage());
    }),
    map((value) => ({
      name: ONBOARDING_UPDATED_EVENT,
      value,
    })),
    take(1)
  );
}

export function onboardingUpdatedEventListener(
  evt: ExtensionConnectionEvent<OnboardingState>
) {
  return evt.name === ONBOARDING_UPDATED_EVENT;
}
