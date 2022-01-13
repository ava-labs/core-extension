import { useEffect, useState } from 'react';
import { CreatePassword } from '@src/pages/Onboarding/CreatePassword';
import { CreateWallet } from './CreateWallet/CreateWallet';
import { OnboardingPhase } from '@src/background/services/onboarding/models';
import { Import } from './ImportWallet';
import { Welcome } from './Welcome';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { Card, HorizontalFlex, VerticalFlex } from '@avalabs/react-components';
import { Logo } from '@src/components/icons/Logo';
import { LoadingOverlay } from '@src/components/common/LoadingOverlay';

const ECOSYSTEM_URL = 'https://ecosystem.avax.network?wallet-installed';

export function OnboardingFlow() {
  const { onboardingPhase, onboardingState, setNextPhase, setFinalized } =
    useOnboardingContext();
  const [isImportFlow, setIsImportFlow] = useState<boolean>(false);

  async function handleOnCancel() {
    await setNextPhase(OnboardingPhase.RESTART);
  }
  useEffect(() => {
    if (
      onboardingPhase === OnboardingPhase.FINALIZE &&
      !onboardingState.isOnBoarded
    ) {
      setFinalized();
      window.location.href = ECOSYSTEM_URL;
    }
  }, [onboardingPhase, onboardingState.isOnBoarded, setFinalized]);

  useEffect(() => {
    if (onboardingState.isOnBoarded) {
      window.location.href = ECOSYSTEM_URL;
    } else if (onboardingState.reImportMnemonic) {
      setIsImportFlow(true);
      setNextPhase(OnboardingPhase.IMPORT_WALLET);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let content = (
    <Welcome
      onNext={(isImport) => {
        setIsImportFlow(isImport);
        setNextPhase(
          isImport ? OnboardingPhase.IMPORT_WALLET : OnboardingPhase.PASSWORD
        );
      }}
    />
  );

  switch (onboardingPhase) {
    case OnboardingPhase.CREATE_WALLET:
      content = (
        <CreateWallet
          onCancel={handleOnCancel}
          onBack={() => setNextPhase(OnboardingPhase.PASSWORD)}
        />
      );
      break;
    case OnboardingPhase.IMPORT_WALLET:
      content = <Import onCancel={handleOnCancel} onBack={handleOnCancel} />;
      break;
    case OnboardingPhase.PASSWORD:
      content = (
        <CreatePassword
          onCancel={handleOnCancel}
          onBack={handleOnCancel}
          isImportFlow={isImportFlow}
        />
      );
      break;
    case OnboardingPhase.FINALIZE:
    case OnboardingPhase.CONFIRM:
      content = <LoadingOverlay />;
      break;
  }

  return (
    <VerticalFlex align="center" style={{ minHeight: `100%` }}>
      <HorizontalFlex
        style={{ maxWidth: `90%` }}
        padding="24px 0"
        width="1200px"
        align="center"
      >
        <Logo />
      </HorizontalFlex>
      <VerticalFlex align="center" justify="center" grow="1">
        <Card
          width="600px"
          minHeight="540px"
          height="calc(100vh - 130px)"
          maxHeight="800px"
        >
          {content}
        </Card>
      </VerticalFlex>
    </VerticalFlex>
  );
}
