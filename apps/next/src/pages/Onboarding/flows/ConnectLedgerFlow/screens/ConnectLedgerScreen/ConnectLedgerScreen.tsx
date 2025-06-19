import { useHistory } from 'react-router-dom';
import { FC, useCallback, useEffect, useState } from 'react';

import { useOnboardingContext } from '@core/ui';

import { useModalPageControl } from '@/components/OnboardingModal';
import { OnboardingScreenProps } from '@/pages/Onboarding/types';
import {
  ConnectAvalanche,
  ConnectSolana,
  PromptSolana,
  Troubleshooting,
} from './components';
import { DerivedKeys } from './components/LedgerConnector/types';
import { WalletType } from '@avalabs/types';

type ImportPhase =
  | 'connect-avax'
  | 'prompt-solana'
  | 'connect-solana'
  | 'troubleshooting-avalanche'
  | 'troubleshooting-solana';

export const ConnectLedgerScreen: FC<OnboardingScreenProps> = ({
  step,
  totalSteps,
  nextScreenPath,
}) => {
  const history = useHistory();
  const { setCurrent, setTotal } = useModalPageControl();
  const {
    setAddressPublicKeys,
    setExtendedPublicKeys,
    setOnboardingWalletType,
  } = useOnboardingContext();

  useEffect(() => {
    setCurrent(step);
    setTotal(totalSteps);
  }, [setCurrent, setTotal, step, totalSteps]);

  const [phase, setPhase] = useState<ImportPhase>('connect-avax');

  const onNext = useCallback(() => {
    history.push(nextScreenPath);
  }, [history, nextScreenPath]);

  const goToAvalancheConnectScreen = useCallback(() => {
    setPhase('connect-avax');
  }, [setPhase]);

  const saveBaseKeysAndPromptForSolana = useCallback(
    (keys: DerivedKeys) => {
      setAddressPublicKeys(keys.addressPublicKeys.map(({ key }) => key));
      setExtendedPublicKeys(keys.extendedPublicKeys ?? []);
      setPhase('prompt-solana');
    },
    [setPhase, setAddressPublicKeys, setExtendedPublicKeys],
  );

  const goToSolanaConnectScreen = useCallback(
    () => setPhase('connect-solana'),
    [setPhase],
  );

  const goToAvalancheTroubleshootingScreen = useCallback(
    () => setPhase('troubleshooting-avalanche'),
    [setPhase],
  );

  const goToSolanaTroubleshootingScreen = useCallback(
    () => setPhase('troubleshooting-solana'),
    [setPhase],
  );

  const goToPromptSolanaScreen = useCallback(
    () => setPhase('prompt-solana'),
    [setPhase],
  );

  const saveSolanaKeysAndContinue = useCallback(
    (keys: DerivedKeys) => {
      setAddressPublicKeys((prev) => [
        ...prev,
        ...keys.addressPublicKeys.map(({ key }) => key),
      ]);
      onNext();
    },
    [onNext, setAddressPublicKeys],
  );

  useEffect(() => {
    setOnboardingWalletType(WalletType.Ledger);
  }, [setOnboardingWalletType]);

  return (
    <>
      {phase === 'connect-avax' && (
        <ConnectAvalanche
          onNext={saveBaseKeysAndPromptForSolana}
          onTroubleshoot={goToAvalancheTroubleshootingScreen}
        />
      )}
      {phase === 'prompt-solana' && (
        <PromptSolana
          onBack={goToAvalancheConnectScreen}
          onNext={goToSolanaConnectScreen}
          onSkip={onNext}
        />
      )}
      {phase === 'connect-solana' && (
        <ConnectSolana
          onBack={goToPromptSolanaScreen}
          onNext={saveSolanaKeysAndContinue}
          onTroubleshoot={goToSolanaTroubleshootingScreen}
        />
      )}
      {phase === 'troubleshooting-avalanche' && (
        <Troubleshooting
          appName="Avalanche"
          onClose={goToAvalancheConnectScreen}
        />
      )}
      {phase === 'troubleshooting-solana' && (
        <Troubleshooting appName="Solana" onClose={goToSolanaConnectScreen} />
      )}
    </>
  );
};
