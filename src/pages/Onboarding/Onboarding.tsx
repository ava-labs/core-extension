import { useEffect, useState } from 'react';
import { CreatePassword } from '@src/pages/Onboarding/CreatePassword';
import { CreateWallet } from './CreateWallet/CreateWallet';
import { OnboardingPhase } from '@src/background/services/onboarding/models';
import { Import } from './ImportWallet';
import { Welcome } from './Welcome';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { Logo } from '@src/components/icons/Logo';
import { LoadingOverlay } from '@src/components/common/LoadingOverlay';
import { LedgerConnect } from './LedgerConnect';
import { LedgerTrouble } from './LedgerTrouble';
import { BrandName } from '@src/components/icons/BrandName';
import { AnalyticsConsent } from './AnalyticsConsent';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { BetaLabel } from '@src/components/icons/BetaLabel';
import { LanguageSelector } from './components/LanguageSelector';
import { Card, Stack, useTheme } from '@avalabs/k2-components';

export enum OnboardingPath {
  NEW_WALLET = 'new-wallet',
  RECOVERY = 'recovery',
  LEDGER = 'ledger',
}

export function Onboarding() {
  const { nextPhase, onboardingState, setNextPhase, submit, submitInProgress } =
    useOnboardingContext();
  const { initAnalyticsIds, capture } = useAnalyticsContext();
  const [isImportFlow, setIsImportFlow] = useState<boolean>(false);
  const [isLedgerFlow, setIsLedgerFlow] = useState<boolean>(false);
  const [onboardingPath, setOnboardingPath] = useState<OnboardingPath>();
  const theme = useTheme();

  async function handleOnCancel() {
    capture('OnboardingCancelled', { step: nextPhase });
    setIsImportFlow(false);
    setNextPhase(OnboardingPhase.RESTART);
  }
  useEffect(() => {
    if (
      nextPhase === OnboardingPhase.FINALIZE &&
      !onboardingState.isOnBoarded &&
      !submitInProgress
    ) {
      submit();
    }
  }, [nextPhase, onboardingState.isOnBoarded, submit, submitInProgress]);

  useEffect(() => {
    initAnalyticsIds(false);
    if (onboardingState.isOnBoarded) {
      setNextPhase(OnboardingPhase.FINALIZE);
    } else if (onboardingState.reImportMnemonic) {
      setIsImportFlow(true);
      setNextPhase(OnboardingPhase.IMPORT_WALLET);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let content = (
    <Welcome
      onNext={(nextPhase) => {
        const eventNames = {
          [OnboardingPhase.ANALYTICS_CONSENT]:
            'OnboardingCreateNewWalletSelected',
          [OnboardingPhase.IMPORT_WALLET]: 'OnboardingImportMnemonicSelected',
          [OnboardingPhase.LEDGER]: 'OnboardingImportLedgerSelected',
        };
        capture(eventNames[nextPhase]);
        setNextPhase(nextPhase);
        if (nextPhase === OnboardingPhase.ANALYTICS_CONSENT) {
          setOnboardingPath(OnboardingPath.NEW_WALLET);
          setIsImportFlow(false);
          setIsLedgerFlow(false);
          return;
        }
        if (nextPhase === OnboardingPhase.LEDGER) {
          setOnboardingPath(OnboardingPath.LEDGER);
          setIsLedgerFlow(true);
          setIsImportFlow(false);
          return;
        }
        setOnboardingPath(OnboardingPath.RECOVERY);
        setIsLedgerFlow(false);
        setIsImportFlow(true);
      }}
    />
  );

  switch (nextPhase) {
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
          onBack={() => setNextPhase(OnboardingPhase.ANALYTICS_CONSENT)}
          isImportFlow={isImportFlow || isLedgerFlow}
          onboardingPath={onboardingPath}
        />
      );
      break;
    case OnboardingPhase.LEDGER:
      content = (
        <LedgerConnect
          onCancel={handleOnCancel}
          onNext={() => setNextPhase(OnboardingPhase.ANALYTICS_CONSENT)}
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
    case OnboardingPhase.ANALYTICS_CONSENT:
      content = (
        <AnalyticsConsent
          onCancel={handleOnCancel}
          onboardingPath={onboardingPath}
        />
      );
      break;
    case OnboardingPhase.FINALIZE:
    case OnboardingPhase.CONFIRM:
      content = <LoadingOverlay />;
      break;
  }

  if (nextPhase === OnboardingPhase.FINALIZE) {
    window.location.replace(
      `${process.env.CORE_EXTENSION_LANDING_URL}/welcome`
    );
  }

  return (
    <Stack sx={{ height: `100%`, alignItems: 'center' }}>
      <Stack
        sx={{
          flexDirection: 'row',
          maxWidth: '90%',
          width: theme.spacing(150),
          py: 2,
        }}
      >
        <Stack
          onClick={handleOnCancel}
          sx={{
            cursor: 'pointer',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
            <Logo height={29} />
            <BrandName height={15} margin={`0 0 0 ${theme.spacing(1)}`} />
            <Stack
              sx={{
                flexDirection: 'row',
                width: 'auto',
                ml: 1,
              }}
            >
              <BetaLabel />
            </Stack>
          </Stack>
        </Stack>

        <LanguageSelector />
      </Stack>
      <Stack sx={{ justifyContent: 'center', flexGrow: 1 }}>
        <Card
          sx={(theme) => ({
            width: theme.spacing(73),
            height: theme.spacing(82),
          })}
        >
          {content}
        </Card>
      </Stack>
    </Stack>
  );
}
