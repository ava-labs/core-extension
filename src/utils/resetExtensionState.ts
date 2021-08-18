import { removeOnboardingFromStorage } from '@src/background/services/onboarding/storage';
import { removeAllPermissionsFromStorage } from '@src/background/services/permissions/storage';
import { removeAllTranscationsFromStorage } from '@src/background/services/transactions/storage';
import { removeWalletFromStorage } from '@src/background/services/wallet/storage';
import browser from 'extensionizer';

export function resetExtensionState() {
  return Promise.all([
    removeAllTranscationsFromStorage(),
    removeWalletFromStorage(),
    removeAllPermissionsFromStorage(),
    removeOnboardingFromStorage(),
  ]).then(() => browser.runtime.reload());
}
