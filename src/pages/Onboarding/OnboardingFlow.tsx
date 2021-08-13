import React from 'react';
import { CreatePassword } from '@src/pages/Onboarding/CreatePassword';
import { AllDone } from '@src/pages/Onboarding/AllDone';
import { CreateWallet } from './CreateWallet';
import { OnboardingPhase } from '@src/background/services/onboarding/models';
import { Import } from './ImportWallet';
import { Welcome } from './Welcome';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';

export function OnboardingFlow() {
  const { onboardingPhase, setNextPhase } = useOnboardingContext();

  function handleOnCancel() {
    setNextPhase(OnboardingPhase.RESTART);
  }

  switch (onboardingPhase) {
    case OnboardingPhase.CREATE_WALLET:
      return <CreateWallet onCancel={handleOnCancel} />;
    case OnboardingPhase.IMPORT_WALLET:
      return <Import onCancel={handleOnCancel} />;
    case OnboardingPhase.PASSWORD:
      return <CreatePassword onCancel={handleOnCancel} />;
    case OnboardingPhase.FINALIZE:
      return <AllDone onCancel={handleOnCancel} />;
    default:
      return <Welcome />;
  }
}

export default OnboardingFlow;
