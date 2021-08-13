import {
  VerticalFlex,
  HorizontalFlex,
  PrimaryButton,
} from '@avalabs/react-components';
import {
  messageService,
  permissionsService,
  transactionService,
} from '@src/background/services';
import { removeOnboardingFromStorage } from '@src/background/services/onboarding/storage';
import { removeWalletFromStorage } from '@src/background/services/wallet/storage';
import browser from 'extensionizer';
import React from 'react';

export function SettingsPage() {
  return (
    <VerticalFlex>
      <PrimaryButton
        onClick={() =>
          Promise.all([
            transactionService.removeAll(),
            messageService.removeAll(),
            removeWalletFromStorage(),
            permissionsService.removeAll(),
            removeOnboardingFromStorage(),
          ]).then(() => browser.runtime.reload())
        }
      >
        Logout and Reload
      </PrimaryButton>
    </VerticalFlex>
  );
}

export default SettingsPage;
