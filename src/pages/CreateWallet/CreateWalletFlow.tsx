import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@src/store/store';

import { CreatePassword } from '@src/pages/CreateWallet/CreatePassword';
import { AllDone } from '@src/pages/CreateWallet/AllDone';
import { KeyboardShortcut } from '@src/pages/CreateWallet/KeyboardShortcut';
import { OnboardStepPhase } from '@src/store/onboard/onboardStore';
import { CreateWallet } from './CreateWallet';

export const CreateWalletFlow = observer(() => {
  const { onboardStore } = useStore();
  const { currentPosition } = onboardStore;

  switch (currentPosition) {
    case OnboardStepPhase.MNEMONIC:
      return <CreateWallet />;
    case OnboardStepPhase.PASSWORD:
      return <CreatePassword />;
    case OnboardStepPhase.KEYBOARD_SHORTCUT:
      return <KeyboardShortcut />;
    case OnboardStepPhase.FINALIZE:
      return <AllDone />;
    default:
      return <CreateWallet />;
  }
});
