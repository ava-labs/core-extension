import {
  getFromStorage,
  saveToStorage,
} from '@src/utils/storage/chrome-storage';
import { OnboardingState } from './models';

export const ONBOARDING_STORAGE_KEY = 'onboarding';

const defaultState = {
  isOnBoarded: false,
  reImportMnemonic: false,
  initialOpen: true,
};

export async function getOnboardingFromStorage() {
  const store = await getFromStorage(ONBOARDING_STORAGE_KEY);
  return (
    store && store[ONBOARDING_STORAGE_KEY]
      ? store[ONBOARDING_STORAGE_KEY]
      : defaultState
  ) as OnboardingState;
}

export async function saveOnboardingToStorage(isOnBoarded: boolean) {
  const state = await getOnboardingFromStorage();
  await saveToStorage({ [ONBOARDING_STORAGE_KEY]: { ...state, isOnBoarded } });
}

export async function saveReImportStateToStorage(reImportMnemonic: boolean) {
  const state = await getOnboardingFromStorage();
  await saveToStorage({
    [ONBOARDING_STORAGE_KEY]: { ...state, reImportMnemonic },
  });
}

export async function saveInitialOpenToStorage(initialOpen: boolean) {
  const state = await getOnboardingFromStorage();
  await saveToStorage({ [ONBOARDING_STORAGE_KEY]: { ...state, initialOpen } });
}

export function removeOnboardingFromStorage(reImportMnemonic?: boolean) {
  return saveToStorage({
    [ONBOARDING_STORAGE_KEY]: { ...defaultState, reImportMnemonic },
  });
}
