import React from 'react';
import { observer } from 'mobx-react-lite';

import { CreatePassword } from '@src/pages/CreateWallet/CreatePassword';
import { AllDone } from '@src/pages/CreateWallet/AllDone';
import { KeyboardShortcut } from '@src/pages/CreateWallet/KeyboardShortcut';
import { CreateWallet } from './CreateWallet';
import { useState } from 'react';
import {
  OnboardingPhase,
  OnboardingState,
} from '@src/background/services/onboarding/models';
import { LoadingIcon } from '@avalabs/react-components';
import { useEffect } from 'react';
import { onboardingService } from '@src/background/services';

export const CreateWalletFlow = observer(() => {
  const [currentPhase, setCurrentPhase] = useState<OnboardingPhase>();

  useEffect(() => {
    function listenForPhaseChanges(onboarding: OnboardingState) {
      currentPhase !== onboarding.phase && setCurrentPhase(onboarding.phase);
    }

    onboardingService.onboarding.add(listenForPhaseChanges);

    return () => onboardingService.onboarding.remove(listenForPhaseChanges);
  }, []);

  if (!currentPhase) {
    return <LoadingIcon />;
  }

  switch (currentPhase) {
    case OnboardingPhase.MNEMONIC:
      return <CreateWallet />;
    case OnboardingPhase.PASSWORD:
      return <CreatePassword />;
    case OnboardingPhase.KEYBOARD_SHORTCUT:
      return <KeyboardShortcut />;
    case OnboardingPhase.FINALIZE:
      return <AllDone />;
    default:
      return <CreateWallet />;
  }
});
