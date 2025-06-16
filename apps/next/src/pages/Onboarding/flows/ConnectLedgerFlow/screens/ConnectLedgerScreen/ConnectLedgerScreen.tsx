import { useHistory } from 'react-router-dom';
import { FC, useEffect, useState } from 'react';
import { WalletType } from '@avalabs/types';

import { useKeyboardShortcuts, useOnboardingContext } from '@core/ui';

import { useModalPageControl } from '@/components/OnboardingModal';
import { OnboardingScreenProps } from '@/pages/Onboarding/types';
import { ConnectAvalanche, ConnectSolana, PromptSolana } from './components';

type ConnectionStatus = 'connect-avax' | 'prompt-solana' | 'connect-solana';

type PathSpec = 'bip44' | 'ledger-live';

export const ConnectLedgerScreen: FC<OnboardingScreenProps> = ({
  step,
  totalSteps,
  nextScreenPath,
}) => {
  // const { t } = useTranslation();
  const { setOnboardingWalletType } = useOnboardingContext();
  const history = useHistory();
  const { setCurrent, setTotal } = useModalPageControl();

  useEffect(() => {
    setCurrent(step);
    setTotal(totalSteps);
  }, [setCurrent, setTotal, step, totalSteps]);

  const [status, setStatus] = useState<ConnectionStatus>('connect-avax');
  const [pathSpec, setPathSpec] = useState<PathSpec>('bip44');

  useEffect(() => {
    // TODO: move to callback?
    setOnboardingWalletType(
      pathSpec === 'bip44' ? WalletType.Ledger : WalletType.LedgerLive,
    );
  }, [pathSpec, setOnboardingWalletType]);

  const isValid = true; // TODO

  const onNext = () => {
    if (!isValid) {
      return;
    }

    // TODO: save public keys
    history.push(nextScreenPath);
  };

  const keyboardHandlers = useKeyboardShortcuts({
    Enter: onNext,
  });

  return (
    <>
      {status === 'connect-avax' && (
        <ConnectAvalanche onNext={() => setStatus('prompt-solana')} />
      )}
      {status === 'prompt-solana' && (
        <PromptSolana
          onBack={() => setStatus('connect-avax')}
          onNext={() => setStatus('connect-solana')}
          onSkip={onNext}
        />
      )}
      {status === 'connect-solana' && <ConnectSolana onNext={onNext} />}
    </>
  );
};
