import { saveReImportStateToStorage } from '@src/background/services/onboarding/storage';
import browser from 'extensionizer';
import { clearStorage } from './storage/chrome-storage';

// openOnboarding true will open the onboarding flow after the extension was reset
export async function resetExtensionState(openOnboarding?: boolean) {
  // clear everything from the chrome.stoage.local
  await clearStorage();

  // make sure we arrive to the correct step of the onboarding
  await saveReImportStateToStorage(!!openOnboarding);

  // reload kills everyhing in memory and clears the chrome.stoage.session storage
  browser.runtime.reload();
}
