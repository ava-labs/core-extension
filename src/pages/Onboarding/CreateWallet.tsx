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
import { onboardingService } from '@src/background/services';
import { useEffect } from 'react';

export function CreateWallet({ onCancel }: { onCancel(): void }) {
  const [isCopied, setIsCopied] = useState(false);
  const [mnemonic, setMnemonic] = useState('');
  const [mnemonicConfirmed, setmnemonicConfirmed] = useState(false);

  useEffect(() => {
    const subscription = onboardingService.mnemonic.subscribe((mnemonic) => {
      setMnemonic(mnemonic);
    });
    return () => subscription.unsubscribe();
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
              onClick={() => onboardingService.setMnemonicConfirmed()}
            >
              Next
            </PrimaryButton>
          </HorizontalFlex>
        </VerticalFlex>
      </SecondaryCard>
    </VerticalFlex>
  );
}
