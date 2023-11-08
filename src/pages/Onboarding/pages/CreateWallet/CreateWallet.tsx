import { useState, useEffect, useCallback } from 'react';
import { createNewMnemonic } from '@src/background/services/wallet/utils/createMnemonicPhrase';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { ConfirmPhrase } from './ConfirmPhrase';
import { CopyPhrase } from './CopyPhrase';
import {
  ONBOARDING_EVENT_NAMES,
  OnboardingPhase,
  OnboardingURLs,
} from '@src/background/services/onboarding/models';
import { useHistory } from 'react-router-dom';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

export function CreateWallet() {
  const { setMnemonic, setOnboardingPhase } = useOnboardingContext();
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [mnemonic, setMnemonicPhrase] = useState<string>('');
  const { capture } = useAnalyticsContext();
  const history = useHistory();

  const onCancel = useCallback(() => {
    capture('OnboardingCancelled', {
      step: OnboardingPhase.CREATE_WALLET,
    });
    history.push(OnboardingURLs.ONBOARDING_HOME);
  }, [capture, history]);

  useEffect(() => {
    setMnemonicPhrase(createNewMnemonic());
    setOnboardingPhase(OnboardingPhase.CREATE_WALLET);
    capture(ONBOARDING_EVENT_NAMES.create_wallet);
  }, [capture, setOnboardingPhase]);

  return isCopied ? (
    <ConfirmPhrase
      onBack={() => setIsCopied(false)}
      onNext={() => {
        setMnemonic(mnemonic);
        history.push(OnboardingURLs.CREATE_PASSWORD);
      }}
      onCancel={onCancel}
      mnemonic={mnemonic}
    />
  ) : (
    <CopyPhrase
      onNext={() => setIsCopied(true)}
      onCancel={onCancel}
      mnemonic={mnemonic}
      onBack={onCancel}
    />
  );
}
