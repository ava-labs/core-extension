import React from 'react';
import { useState } from 'react';
import {
  VerticalFlex,
  Typography,
  Mnemonic,
  PrimaryButton,
  ProgressIndicator,
  TextButton,
  Checkbox,
} from '@avalabs/react-components';

interface CopyPhraseProps {
  mnemonic: string;
  onCancel: () => void;
  onNext: () => void;
}

export function CopyPhrase({ onCancel, onNext, mnemonic }: CopyPhraseProps) {
  const [termsConfirmed, setTermsConfirmed] = useState(false);

  return (
    <VerticalFlex
      width="100%"
      align="center"
      padding="22px 0 36px"
      justify="space-between"
    >
      <VerticalFlex align="center">
        <ProgressIndicator steps={3} current={1} />
        <Typography as="h1" size={24} weight="bold" margin="28px 0 8px">
          Secret Recovery Phrase
        </Typography>
        <Typography align="center" margin="0 0 24px" height="24px">
          This is your recovery phrase. Write it down
          <br />
          and store it in a secure location
        </Typography>
        <Mnemonic
          phrase={mnemonic}
          confirmMnemonic={false}
          onConfirmed={() => {}}
        />
      </VerticalFlex>
      <VerticalFlex align="center">
        <Checkbox
          label={`I understand losing this phrase will result in LOST funds\n- I have stored it in a secure location`}
          onChange={setTermsConfirmed}
        />
        <PrimaryButton
          margin="24px 0"
          disabled={!termsConfirmed}
          onClick={() => onNext()}
        >
          I wrote it down
        </PrimaryButton>
        <TextButton onClick={() => onCancel()}>Back</TextButton>
      </VerticalFlex>
    </VerticalFlex>
  );
}
