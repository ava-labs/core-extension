import React from 'react';
import { CreatePassword } from '@src/pages/Onboarding/CreatePassword';
import { AllDone } from '@src/pages/Onboarding/AllDone';
import { CreateWallet } from './CreateWallet/CreateWallet';
import { OnboardingPhase } from '@src/background/services/onboarding/models';
import { Import } from './ImportWallet';
import { Welcome } from './Welcome';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { Card, HorizontalFlex, VerticalFlex } from '@avalabs/react-components';
import { Logo } from '@src/components/icons/Logo';

export function OnboardingFlow() {
  const { onboardingPhase, setNextPhase } = useOnboardingContext();
 
  async function handleOnCancel() {
    await setNextPhase(OnboardingPhase.RESTART);
  }

  let content = <Welcome />
  switch (onboardingPhase) {
    case OnboardingPhase.CREATE_WALLET:
      content = <CreateWallet onCancel={handleOnCancel} />;
      break;
    case OnboardingPhase.IMPORT_WALLET:
      content = <Import onCancel={handleOnCancel} />;
      break;
    case OnboardingPhase.PASSWORD:
      content = <CreatePassword onCancel={handleOnCancel} />;
      break;
    case OnboardingPhase.CONFIRM:
      content = <AllDone />;
      break;
  }

  return (
    <VerticalFlex align="center" style={{minHeight: `100%`}}>
      <HorizontalFlex style={{maxWidth: `90%`}} padding="24px 0" width="1200px" align="center">
        <Logo />
      </HorizontalFlex>
      <VerticalFlex align="center" justify="center" grow="1">
        <Card width="600px" height="744px">
          {content}
        </Card>
      </VerticalFlex>
    </VerticalFlex>
  )

}

export default OnboardingFlow;
