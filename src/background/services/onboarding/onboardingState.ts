import { ContextContainer } from '@src/hooks/useIsSpecificContextContainer';
import { BehaviorSubject } from 'rxjs';
import { browser } from 'webextension-polyfill-ts';
import { OnboardingState } from './models';
import {
  getOnboardingFromStorage,
  saveReImportStateToStorage,
} from './storage';

export const onboardingState$ = new BehaviorSubject<
  OnboardingState | undefined
>(undefined);

getOnboardingFromStorage().then((onboarding) => {
  if (onboarding.reImportMnemonic) {
    // Reopen onboarding flow after the the user hit the "forgot password flow"
    // Need to open the page here since the extension gets reset after
    // wiping it's storage as the first step to ensure a clean state.
    browser.tabs.create({ url: ContextContainer.HOME });
    saveReImportStateToStorage(false);
  }
  onboardingState$.next(onboarding);
});
