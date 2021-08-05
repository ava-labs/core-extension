import React from 'react';
import { CreatePassword } from '@src/pages/Onboarding/CreatePassword';
import { AllDone } from '@src/pages/Onboarding/AllDone';
import { CreateWallet } from './CreateWallet';
import { useState } from 'react';
import { OnboardingPhase } from '@src/background/services/onboarding/models';
import { useEffect } from 'react';
import { onboardingService } from '@src/background/services';
import { Import } from './ImportWallet';
import { Welcome } from './Welcome';

export function OnboardingFlow() {
  const [currentPhase, setCurrentPhase] = useState<OnboardingPhase>();

  function handleOnCancel() {
    setCurrentPhase(undefined);
  }

  useEffect(() => {
    const subscription = onboardingService.phase.subscribe(
      (phase: OnboardingPhase) => {
        if (currentPhase !== phase) {
          setCurrentPhase(phase);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  switch (currentPhase) {
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
