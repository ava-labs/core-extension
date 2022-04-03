import { useState } from 'react';
import {
  VerticalFlex,
  Typography,
  PrimaryButton,
  ComponentSize,
  Input,
} from '@avalabs/react-components';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { OnboardingPhase } from '@src/background/services/onboarding/models';
import { OnboardingStepHeader } from './components/OnboardingStepHeader';
import { MnemonicWallet } from '@avalabs/avalanche-wallet-sdk';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

interface ImportProps {
  onCancel(): void;
  onBack(): void;
}

export const Import = ({ onCancel, onBack }: ImportProps) => {
  const { capture } = useAnalyticsContext();
  const { setMnemonic, setNextPhase } = useOnboardingContext();
  const [recoveryPhrase, setRecoveryPhrase] = useState<string>('');
  const [error, setError] = useState<string>('');

  const isPhraseCorrectLength = (phrase: string) => {
    return [12, 24].includes(phrase.trim().split(' ').length);
  };

  const isPhraseValid = (phrase: string) => {
    return (
      phrase &&
      isPhraseCorrectLength(phrase) &&
      MnemonicWallet.validateMnemonic(phrase)
    );
  };

  const onPhraseChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phrase = e.currentTarget.value;
    setRecoveryPhrase(phrase);

    if (!isPhraseValid(phrase)) {
      setError('Invalid mnemonic phrase');
    } else {
      setError('');
    }
  };

  const nextButtonDisabled = !isPhraseValid(recoveryPhrase) || !!error;

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
        <Input
          type="password"
          autoFocus
          margin="32px 0 0 0"
          error={!!error}
          errorMessage={error}
          placeholder="Type your recovery phrase"
          onChange={onPhraseChanged}
        />
      </VerticalFlex>
      <PrimaryButton
        size={ComponentSize.LARGE}
        width="343px"
        disabled={nextButtonDisabled}
        onClick={async () => {
          capture('OnboardingMnemonicImported');
          setMnemonic(recoveryPhrase).then(() =>
            setNextPhase(OnboardingPhase.ANALYTICS_CONSENT)
          );
        }}
      >
        Next
      </PrimaryButton>
    </VerticalFlex>
  );
};
