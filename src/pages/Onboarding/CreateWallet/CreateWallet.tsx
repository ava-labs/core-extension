import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { createNewMnemonic } from '@src/background/services/wallet/utils/createMnemonicPhrase';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { ConfirmPhrase } from './ConfirmPhrase';
import { CopyPhrase } from './CopyPhrase';

export function CreateWallet({ onCancel }: { onCancel(): void }) {
  const { setMnemonic } = useOnboardingContext();
  const [isCopied, setIsCopied] = useState(false);
  const [mnemonic, setMnemonicPhrase] = useState('');
  const [termsConfirmed, setTermsConfirmed] = useState(false);

  useEffect(() => {
    setMnemonicPhrase(createNewMnemonic());
  }, []);

  return isCopied ? (
    <ConfirmPhrase
      onNext={() => setMnemonic(mnemonic)}
      onCancel={() => setIsCopied(false)}
      mnemonic={mnemonic}
    />
  ) : (
    <CopyPhrase
      onNext={() => setIsCopied(true)}
      onCancel={onCancel}
      mnemonic={mnemonic}
    />
  );
}
