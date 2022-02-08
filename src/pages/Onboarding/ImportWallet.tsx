import { useState } from 'react';
import {
  VerticalFlex,
  Typography,
  TextArea,
  PrimaryButton,
  ComponentSize,
} from '@avalabs/react-components';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import * as bip39 from 'bip39';
import { OnboardingPhase } from '@src/background/services/onboarding/models';
import { OnboardingStepHeader } from './components/OnboardingStepHeader';

interface ImportProps {
  onCancel(): void;
  onBack(): void;
}

export const Import = ({ onCancel, onBack }: ImportProps) => {
  const { setMnemonic, setNextPhase } = useOnboardingContext();
  const [recoveryPhrase, setRecoveryPhrase] = useState<string>('');
  const [error, setError] = useState<string>('');

  const isPhraseCorrectLength = (phrase) => {
    return [12, 24].includes(phrase.split(' ').length);
  };

  const onPhraseChanged = (e) => {
    const phrase = e.currentTarget.value;
    setRecoveryPhrase(phrase);
    if (
      phrase &&
      !isPhraseCorrectLength(phrase) &&
      !bip39.validateMnemonic(phrase)
    ) {
      setError('Invalid mnemonic phrase');
    } else {
      setError('');
    }
  };

  const nextButtonDisabled =
    !(recoveryPhrase && isPhraseCorrectLength(recoveryPhrase)) || !!error;

  return (
    <VerticalFlex width="100%" align="center">
      <OnboardingStepHeader
        title="Secret Recovery Phrase"
        onBack={onBack}
        onClose={onCancel}
      />
      <VerticalFlex align="center" grow="1">
        <Typography align="center" margin="8px 0 0" size={14} height="17px">
          Access an existing wallet with your secret
          <br />
          recovery phrase.
        </Typography>
        <TextArea
          autoFocus
          margin="32px 0 0 0"
          error={!!error}
          errorMessage={error}
          placeholder="Type your recovery phrase"
          onChange={onPhraseChanged}
        ></TextArea>
      </VerticalFlex>
      <PrimaryButton
        size={ComponentSize.LARGE}
        width="343px"
        disabled={nextButtonDisabled}
        onClick={async () => {
          setMnemonic(recoveryPhrase).then(() =>
            setNextPhase(OnboardingPhase.PASSWORD)
          );
        }}
      >
        Next
      </PrimaryButton>
    </VerticalFlex>
  );
};
