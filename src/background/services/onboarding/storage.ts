import {
  getFromStorage,
  removeFromStorage,
} from '@src/utils/storage/chrome-storage';
import { from, Observable } from 'rxjs';
import { OnboardingState } from './models';

export const ONBOARDING_STORAGE_KEY = 'onboarding';
export function onboardingFromStorage() {
  return from(
    getFromStorage(ONBOARDING_STORAGE_KEY).then((store) => {
      if (store && store[ONBOARDING_STORAGE_KEY]) {
        return store[ONBOARDING_STORAGE_KEY];
      } else {
        return { isOnBoarded: true };
      }
    })
  ) as Observable<OnboardingState>;
}

export function removeOnboardingFromStorage() {
  return removeFromStorage(ONBOARDING_STORAGE_KEY);
}
