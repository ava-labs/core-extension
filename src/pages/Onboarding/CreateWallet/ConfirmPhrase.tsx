import React from 'react';
import { useState } from 'react';
import {
  VerticalFlex,
  Typography,
  Mnemonic,
  PrimaryButton,
  ProgressIndicator,
  TextButton,
  ComponentSize,
} from '@avalabs/react-components';

interface ConfirmPhraseProps {
  mnemonic: string;
  onCancel: () => void;
  onNext: () => void;
}

export function ConfirmPhrase({
  onCancel,
  onNext,
  mnemonic,
}: ConfirmPhraseProps) {
  const [termsConfirmed, setTermsConfirmed] = useState(false);

  return (
    <VerticalFlex
      width="100%"
      align="center"
      padding="22px 0 36px"
      justify="space-between"
    >
      <VerticalFlex align="center">
        <ProgressIndicator steps={3} current={2} />
        <Typography as="h1" size={24} weight="bold" margin="28px 0 8px">
          Confirm Recovery Phrase
        </Typography>
        <Typography align="center" margin="0 0 46px" height="24px">
          Fill in the missing words
        </Typography>
        <Mnemonic
          phrase={mnemonic}
          confirmMnemonic={true}
          onConfirmed={() => {
            setTermsConfirmed(true);
          }}
        />
      </VerticalFlex>
      <VerticalFlex align="center">
        <PrimaryButton
          size={ComponentSize.LARGE}
          margin="24px 0"
          disabled={!termsConfirmed}
          onClick={() => onNext()}
        >
          <Typography size={14} weight={600} color="inherit">
            Confirm
          </Typography>
        </PrimaryButton>
        <TextButton onClick={() => onCancel()}>Back</TextButton>
      </VerticalFlex>
    </VerticalFlex>
  );
}
