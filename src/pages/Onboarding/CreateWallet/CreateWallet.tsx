import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { createNewMnemonic } from '@src/background/services/wallet/utils/createMnemonicPhrase';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { ConfirmPhrase } from './ConfirmPhrase';
import { CopyPhrase } from './CopyPhrase';
import { OnboardingPhase } from '@src/background/services/onboarding/models';

export function CreateWallet({
  onCancel,
  onBack,
}: {
  onCancel(): void;
  onBack(): void;
}) {
  const { setMnemonic, setNextPhase } = useOnboardingContext();
  const [isCopied, setIsCopied] = useState(false);
  const [mnemonic, setMnemonicPhrase] = useState('');

  useEffect(() => {
    setMnemonicPhrase(createNewMnemonic());
  }, []);

  return isCopied ? (
    <ConfirmPhrase
      onBack={() => setIsCopied(false)}
      onNext={() =>
        setMnemonic(mnemonic).then(() => setNextPhase(OnboardingPhase.FINALIZE))
      }
      onCancel={onCancel}
      mnemonic={mnemonic}
    />
  ) : (
    <CopyPhrase
      onNext={() => setIsCopied(true)}
      onCancel={onCancel}
      mnemonic={mnemonic}
      onBack={onBack}
    />
  );
}
