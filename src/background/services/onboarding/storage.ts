import {
  getFromStorage,
  removeFromStorage,
  saveToStorage,
} from '@src/utils/storage/chrome-storage';
import { from, Observable } from 'rxjs';
import { OnboardingState } from './models';

export const ONBOARDING_STORAGE_KEY = 'onboarding';
export async function onboardingFromStorage() {
  const store = await getFromStorage(ONBOARDING_STORAGE_KEY);
  return (
    store && store[ONBOARDING_STORAGE_KEY]
      ? store[ONBOARDING_STORAGE_KEY]
      : { isOnBoarded: false }
  ) as OnboardingState;
}

export async function saveOnboardingToStorage(isOnBoarded: boolean) {
  return saveToStorage({ [ONBOARDING_STORAGE_KEY]: { isOnBoarded } });
}

export function removeOnboardingFromStorage() {
  return removeFromStorage(ONBOARDING_STORAGE_KEY);
}
