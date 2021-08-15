import { messageService } from '@src/background/services/messages/messages';
import { removeOnboardingFromStorage } from '@src/background/services/onboarding/storage';
import { permissionsService } from '@src/background/services/permissions/permissions';
import { transactionService } from '@src/background/services/transactions/transactions';
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
