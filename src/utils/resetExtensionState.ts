import { removeAllAccountsFromStorage } from '@src/background/services/accounts/storage';
import { removeOnboardingFromStorage } from '@src/background/services/onboarding/storage';
import { removeAllPermissionsFromStorage } from '@src/background/services/permissions/storage';
import { removeAllTranscationsFromStorage } from '@src/background/services/transactions/storage';
import { removeWalletFromStorage } from '@src/background/services/wallet/storage';
import browser from 'extensionizer';

// openOnboarding true will open the onboarding flow after the extension was reset
export function resetExtensionState(openOnboarding?: boolean) {
  return Promise.all([
    removeAllTranscationsFromStorage(),
    removeWalletFromStorage(),
    removeAllPermissionsFromStorage(),
    removeOnboardingFromStorage(openOnboarding),
    removeAllAccountsFromStorage(),
  ]).then(() => browser.runtime.reload());
}
