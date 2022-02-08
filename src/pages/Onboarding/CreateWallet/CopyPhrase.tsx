import { useState } from 'react';
import {
  VerticalFlex,
  Typography,
  Mnemonic,
  PrimaryButton,
  Checkbox,
  ComponentSize,
} from '@avalabs/react-components';
import { OnboardingStepHeader } from '../components/OnboardingStepHeader';

interface CopyPhraseProps {
  mnemonic: string;
  onCancel: () => void;
  onBack: () => void;
  onNext: () => void;
}

export function CopyPhrase({
  onCancel,
  onBack,
  onNext,
  mnemonic,
}: CopyPhraseProps) {
  const [termsConfirmed, setTermsConfirmed] = useState<boolean>(false);

  return (
    <VerticalFlex width="100%" align="center">
      <OnboardingStepHeader
        title="Secret Recovery Phrase"
        onBack={onBack}
        onClose={onCancel}
      />
      <VerticalFlex align="center" grow="1">
        <Typography align="center" margin="8px 0 32px" size={14} height="17px">
          This is your recovery phrase. Write it down and
          <br />
          store it in a secure location.
        </Typography>
        <Mnemonic
          phrase={mnemonic}
          confirmMnemonic={false}
          onConfirmedChange={() => {
            //noop, confirmation is next step
          }}
        />
      </VerticalFlex>
      <VerticalFlex align="center">
        <Checkbox
          label={`I understand losing this phrase will result in lost funds.\nI have stored it in a secure location`}
          onChange={setTermsConfirmed}
        />
        <PrimaryButton
          width="343px"
          margin="16px 0 0 0"
          size={ComponentSize.LARGE}
          disabled={!termsConfirmed}
          onClick={() => onNext()}
        >
          Next
        </PrimaryButton>
      </VerticalFlex>
    </VerticalFlex>
  );
}
