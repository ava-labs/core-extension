import { removeOnboardingFromStorage } from '@src/background/services/onboarding/storage';
import { removeAllPermissionsFromStorage } from '@src/background/services/permissions/storage';
import { transactionService } from '@src/background/services/transactions/transactions';
import { removeWalletFromStorage } from '@src/background/services/wallet/storage';
import browser from 'extensionizer';

export function resetExtensionState() {
  return Promise.all([
    transactionService.removeAll(),
    removeWalletFromStorage(),
    removeAllPermissionsFromStorage(),
    removeOnboardingFromStorage(),
  ]).then(() => browser.runtime.reload());
}
