import { useState } from 'react';
import {
  VerticalFlex,
  Typography,
  Mnemonic,
  PrimaryButton,
  ComponentSize,
} from '@avalabs/react-components';
import { OnboardingStepHeader } from '../components/OnboardingStepHeader';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

interface ConfirmPhraseProps {
  mnemonic: string;
  onCancel: () => void;
  onNext: () => void;
  onBack: () => void;
}

export function ConfirmPhrase({
  onCancel,
  onNext,
  onBack,
  mnemonic,
}: ConfirmPhraseProps) {
  const { capture } = useAnalyticsContext();
  const [termsConfirmed, setTermsConfirmed] = useState<boolean>(false);

  return (
    <VerticalFlex width="100%" align="center">
      <OnboardingStepHeader
        title="Verify Secret Recovery Phrase"
        onBack={onBack}
        onClose={onCancel}
      />
      <VerticalFlex align="center" grow="1">
        <Typography align="center" margin="8px 0 32px" size={14} height="17px">
          Select the words below to verify your
          <br />
          secret recovery phrase.
        </Typography>
        <Mnemonic
          phrase={mnemonic}
          confirmMnemonic={true}
          onConfirmedChange={(confirmed) => {
            setTermsConfirmed(confirmed);
          }}
        />
      </VerticalFlex>
      <VerticalFlex align="center">
        <PrimaryButton
          width="343px"
          size={ComponentSize.LARGE}
          disabled={!termsConfirmed}
          onClick={() => {
            capture('OnboardingMnemonicVerified');
            onNext();
          }}
        >
          Next
        </PrimaryButton>
      </VerticalFlex>
    </VerticalFlex>
  );
}
