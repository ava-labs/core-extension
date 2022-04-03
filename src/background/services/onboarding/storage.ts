import {
  getFromStorage,
  saveToStorage,
} from '@src/utils/storage/chrome-storage';
import { OnboardingState } from './models';

export const ONBOARDING_STORAGE_KEY = 'onboarding';
/**
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * Onboarding data is not encrypted in storage to provide a quicker onboarding experience
 * DO NOT STORE ANYTHING REMOTELY SENSITIVE DATA
 * IF THE DATA MODIFIED BY AN ATTACKER WILL CAUSE ANY ISSUES, DO NOT STORE IT HERE
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */
const defaultState = {
  isOnBoarded: false,
  reImportMnemonic: false,
  initialOpen: true,
};

export async function getOnboardingFromStorage(): Promise<OnboardingState> {
  const state = await getFromStorage<OnboardingState>(ONBOARDING_STORAGE_KEY);
  return state || defaultState;
}

export async function saveOnboardingToStorage(isOnBoarded: boolean) {
  const state = await getOnboardingFromStorage();
  // onboarding info is not encrypted in order load it prior wallet initialization
  // and provide quicker onboarding experience
  await saveToStorage(ONBOARDING_STORAGE_KEY, { ...state, isOnBoarded }, false);
}

export async function saveReImportStateToStorage(reImportMnemonic: boolean) {
  const state = await getOnboardingFromStorage();
  // onboarding info is not encrypted in order load it prior wallet initialization
  // and provide quicker onboarding experience
  await saveToStorage(
    ONBOARDING_STORAGE_KEY,
    { ...state, reImportMnemonic },
    false
  );
}

export async function saveInitialOpenToStorage(initialOpen: boolean) {
  const state = await getOnboardingFromStorage();
  // onboarding info is not encrypted in order load it prior wallet initialization
  // and provide quicker onboarding experience
  await saveToStorage(ONBOARDING_STORAGE_KEY, { ...state, initialOpen }, false);
}
