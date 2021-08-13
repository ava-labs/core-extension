import React from 'react';
import { useState } from 'react';
import {
  VerticalFlex,
  Typography,
  Mnemonic,
  HorizontalSeparator,
  SecondaryCard,
  PrimaryButton,
  SecondaryButton,
  HorizontalFlex,
} from '@avalabs/react-components';
import { useEffect } from 'react';
import { createNewMnemonic } from '@src/background/services/wallet/utils/createMnemonicPhrase';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';

export function CreateWallet({ onCancel }: { onCancel(): void }) {
  const { setMnemonic } = useOnboardingContext();
  const [isCopied, setIsCopied] = useState(false);
  const [mnemonic, setMnemonicPhrase] = useState('');
  const [mnemonicConfirmed, setmnemonicConfirmed] = useState(false);

  useEffect(() => {
    setMnemonicPhrase(createNewMnemonic());
  }, []);

  return (
    <VerticalFlex width={'100%'} align={'center'}>
      <Typography>Your new wallet phrase</Typography>
      <HorizontalSeparator />
      <br />
      <br />
      <SecondaryCard>
        <VerticalFlex align={'center'}>
          <Typography size={14}>
            This is your Mnemonic phrase, this needs to be kept in a safe place.
          </Typography>
          <br />
          {!isCopied ? (
            <Mnemonic phrase={mnemonic} />
          ) : (
            <>
              <Mnemonic
                phrase={mnemonic}
                confirmMnemonic={true}
                onConfirmed={() => {
                  setmnemonicConfirmed(true);
                }}
              />
            </>
          )}
          <br />
          <HorizontalFlex>
            <SecondaryButton onClick={() => onCancel && onCancel()}>
              Cancel
            </SecondaryButton>
            <SecondaryButton
              onClick={() => {
                setIsCopied(true);
                navigator.clipboard.writeText(mnemonic);
              }}
            >
              {isCopied ? 'Phrase copied' : 'Copy Phrase'}
            </SecondaryButton>
            <PrimaryButton
              disabled={!mnemonicConfirmed}
              onClick={() => setMnemonic(mnemonic)}
            >
              Next
            </PrimaryButton>
          </HorizontalFlex>
        </VerticalFlex>
      </SecondaryCard>
    </VerticalFlex>
  );
}
