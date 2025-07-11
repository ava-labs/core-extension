import { useHistory } from 'react-router-dom';
import { FC, useEffect, useMemo, useState } from 'react';
import { WalletType } from '@avalabs/types';

import { useAnalyticsContext, useOnboardingContext } from '@core/ui';

import { useModalPageControl } from '@/components/OnboardingModal';
import { OnboardingScreenProps } from '@/pages/Onboarding/types';
import {
  ConnectAvalanche,
  ConnectSolana,
  PromptSolana,
  Troubleshooting,
} from './components';

type ImportPhase =
  | 'connect-avax'
  | 'prompt-solana'
  | 'connect-solana'
  | 'troubleshooting-avalanche'
  | 'troubleshooting-solana';

type ConnectLedgerScreenProps = OnboardingScreenProps & {
  onNext: () => void;
};

export const ConnectLedgerScreen: FC<ConnectLedgerScreenProps> = ({
  step,
  totalSteps,
  onNext,
}) => {
  const history = useHistory();
  const { setCurrent, setTotal, registerBackButtonHandler } =
    useModalPageControl();
  const {
    setAddressPublicKeys,
    setExtendedPublicKeys,
    setOnboardingWalletType,
  } = useOnboardingContext();
  const { capture } = useAnalyticsContext();

  useEffect(() => {
    setCurrent(step);
    setTotal(totalSteps);
  }, [setCurrent, setTotal, step, totalSteps]);

  const [phase, setPhase] = useState<ImportPhase>('connect-avax');

  useEffect(() => {
    setOnboardingWalletType(WalletType.Ledger);
  }, [setOnboardingWalletType]);

  const avalancheConnectorCallbacks = useMemo(
    () => ({
      onConnectionSuccess: () => capture('OnboardingLedgerConnected'),
      onConnectionFailed: () => capture('OnboardingLedgerConnectionFailed'),
      onConnectionRetry: () => capture('OnboardingLedgerRetry'),
    }),
    [capture],
  );

  const solanaConnectorCallbacks = useMemo(
    () => ({
      onConnectionSuccess: () => capture('OnboardingLedgerSolanaKeysDerived'),
      onConnectionFailed: () => capture('OnboardingLedgerSolanaKeysFailed'),
      onConnectionRetry: () => capture('OnboardingLedgerSolanaKeysRetry'),
    }),
    [capture],
  );

  useEffect(() => {
    let previousScreen: ImportPhase | undefined;

    switch (phase) {
      case 'prompt-solana':
        previousScreen = 'connect-avax';
        break;
      case 'connect-solana':
        previousScreen = 'prompt-solana';
        break;
      case 'troubleshooting-solana':
        previousScreen = 'connect-solana';
        break;
      case 'troubleshooting-avalanche':
        previousScreen = 'connect-avax';
        break;
      case 'connect-avax':
        previousScreen = undefined;
        break;
    }
    return registerBackButtonHandler(
      previousScreen ? () => setPhase(previousScreen) : history.goBack,
    );
  }, [phase, registerBackButtonHandler, history.goBack]);

  return (
    <>
      {phase === 'connect-avax' && (
        <ConnectAvalanche
          connectorCallbacks={avalancheConnectorCallbacks}
          onNext={({ addressPublicKeys, extendedPublicKeys }) => {
            setAddressPublicKeys(addressPublicKeys.map(({ key }) => key));
            setExtendedPublicKeys(extendedPublicKeys ?? []);
            setPhase('prompt-solana');
          }}
          onTroubleshoot={() => {
            capture('OnboardingLedgerTroubleshootingAvalanche');
            setPhase('troubleshooting-avalanche');
          }}
        />
      )}
      {phase === 'prompt-solana' && (
        <PromptSolana
          onNext={() => {
            capture('OnboardingSolanaSupportConfirmed');
            setPhase('connect-solana');
          }}
          onSkip={() => {
            capture('OnboardingSolanaSupportDenied');
            onNext();
          }}
        />
      )}
      {phase === 'connect-solana' && (
        <ConnectSolana
          connectorCallbacks={solanaConnectorCallbacks}
          onNext={({ addressPublicKeys }) => {
            setAddressPublicKeys((prev) => [
              ...prev,
              ...addressPublicKeys.map(({ key }) => key),
            ]);
            onNext();
          }}
          onTroubleshoot={() => {
            capture('OnboardingLedgerTroubleshootingSolana');
            setPhase('troubleshooting-solana');
          }}
        />
      )}
      {phase === 'troubleshooting-avalanche' && (
        <Troubleshooting
          appName="Avalanche"
          onClose={() => {
            capture('OnboardingLedgerTroubleshootingAvalancheClosed');
            setPhase('connect-avax');
          }}
        />
      )}
      {phase === 'troubleshooting-solana' && (
        <Troubleshooting
          appName="Solana"
          onClose={() => {
            capture('OnboardingLedgerTroubleshootingSolanaClosed');
            setPhase('connect-solana');
          }}
        />
      )}
    </>
  );
};
