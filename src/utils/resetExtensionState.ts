import {
  messageService,
  permissionsService,
  transactionService,
} from '@src/background/services';
import { removeOnboardingFromStorage } from '@src/background/services/onboarding/storage';
import { removeWalletFromStorage } from '@src/background/services/wallet/storage';
import browser from 'extensionizer';

export function resetExtensionState() {
  return Promise.all([
    transactionService.removeAll(),
    messageService.removeAll(),
    removeWalletFromStorage(),
    permissionsService.removeAll(),
    removeOnboardingFromStorage(),
  ]).then(() => browser.runtime.reload());
}
