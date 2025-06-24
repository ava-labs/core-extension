import { useHistory } from 'react-router-dom';
import { FC, useEffect, useState } from 'react';
import { WalletType } from '@avalabs/types';

import { useOnboardingContext } from '@core/ui';

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

  useEffect(() => {
    setOnboardingWalletType(WalletType.Ledger);
  }, [setOnboardingWalletType]);

  return (
    <>
      {phase === 'connect-avax' && (
        <ConnectAvalanche
          onNext={({ addressPublicKeys, extendedPublicKeys }) => {
            setAddressPublicKeys(addressPublicKeys.map(({ key }) => key));
            setExtendedPublicKeys(extendedPublicKeys ?? []);
            setPhase('prompt-solana');
          }}
          onTroubleshoot={() => setPhase('troubleshooting-avalanche')}
        />
      )}
      {phase === 'prompt-solana' && (
        <PromptSolana
          onBack={() => setPhase('connect-avax')}
          onNext={() => setPhase('connect-solana')}
          onSkip={() => history.push(nextScreenPath)}
        />
      )}
      {phase === 'connect-solana' && (
        <ConnectSolana
          onBack={() => setPhase('prompt-solana')}
          onNext={({ addressPublicKeys }) => {
            setAddressPublicKeys((prev) => [
              ...prev,
              ...addressPublicKeys.map(({ key }) => key),
            ]);
            history.push(nextScreenPath);
          }}
          onTroubleshoot={() => setPhase('troubleshooting-solana')}
        />
      )}
      {phase === 'troubleshooting-avalanche' && (
        <Troubleshooting
          appName="Avalanche"
          onClose={() => setPhase('connect-avax')}
        />
      )}
      {phase === 'troubleshooting-solana' && (
        <Troubleshooting
          appName="Solana"
          onClose={() => setPhase('connect-solana')}
        />
      )}
    </>
  );
};
