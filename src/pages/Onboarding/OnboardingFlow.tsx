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
import { ChooseExistingType } from './ChooseExistingType';
import { LedgerConnect } from './LedgerConnect';
import { LedgerTrouble } from './LedgerTrouble';
import { BrandName } from '@src/components/icons/BrandName';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { BetaLabel } from '@src/components/icons/BetaLabel';

const ECOSYSTEM_URL = 'https://ecosystem.avax.network?wallet-installed';

export function OnboardingFlow() {
  const { onboardingPhase, onboardingState, setNextPhase, setFinalized } =
    useOnboardingContext();
  const { initAnalyticsIds, capture } = useAnalyticsContext();
  const [isImportFlow, setIsImportFlow] = useState<boolean>(false);
  const [isLedgerFlow, setIsLedgerFlow] = useState<boolean>(false);

  async function handleOnCancel() {
    capture('OnboardingCancelled', { step: onboardingPhase });
    setIsImportFlow(false);
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
    initAnalyticsIds();
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
      onNext={(isExisting) => {
        capture(
          isExisting
            ? 'OnboardingImportWalletSelected'
            : 'OnboardingCreateNewWalletSelected'
        );
        setNextPhase(
          isExisting ? OnboardingPhase.EXISTING : OnboardingPhase.PASSWORD
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
    case OnboardingPhase.EXISTING:
      content = (
        <ChooseExistingType
          onNext={(isRecovery) => {
            capture(
              isRecovery
                ? 'OnboardingImportMnemonicSelected'
                : 'OnboardingImportLedgertSelected'
            );
            setIsImportFlow(isRecovery);
            setNextPhase(
              isRecovery
                ? OnboardingPhase.IMPORT_WALLET
                : OnboardingPhase.LEDGER
            );
            setIsLedgerFlow(!isRecovery);
          }}
          onBack={handleOnCancel}
          onCancel={handleOnCancel}
        />
      );
      break;
    case OnboardingPhase.IMPORT_WALLET:
      content = (
        <Import
          onCancel={handleOnCancel}
          onBack={() => setNextPhase(OnboardingPhase.EXISTING)}
        />
      );
      break;
    case OnboardingPhase.PASSWORD:
      content = (
        <CreatePassword
          onCancel={handleOnCancel}
          onBack={handleOnCancel}
          isImportFlow={isImportFlow || isLedgerFlow}
        />
      );
      break;
    case OnboardingPhase.LEDGER:
      content = (
        <LedgerConnect
          onCancel={handleOnCancel}
          onBack={() => setNextPhase(OnboardingPhase.EXISTING)}
          onNext={() => setNextPhase(OnboardingPhase.PASSWORD)}
          onError={() => setNextPhase(OnboardingPhase.LEDGER_TROUBLE)}
        />
      );
      break;
    // Temporary - where does this get displayed?
    case OnboardingPhase.LEDGER_TROUBLE:
      content = (
        <LedgerTrouble onBack={() => setNextPhase(OnboardingPhase.LEDGER)} />
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
        padding="16px 0"
        width="1200px"
        align="center"
      >
        <Logo height={29} />
        <BrandName height={15} margin="0 0 0 8px" />
        <HorizontalFlex width="auto" margin="0 0 0 16px">
          <BetaLabel />
        </HorizontalFlex>
      </HorizontalFlex>
      <VerticalFlex align="center" justify="center" grow="1">
        <Card width="568px" minHeight="540px" height="639px" padding="40px">
          {content}
        </Card>
      </VerticalFlex>
    </VerticalFlex>
  );
}
