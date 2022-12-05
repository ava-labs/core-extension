import { useState } from 'react';
import {
  VerticalFlex,
  Typography,
  PrimaryButton,
  ComponentSize,
} from '@avalabs/react-components';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { OnboardingPhase } from '@src/background/services/onboarding/models';
import { OnboardingStepHeader } from './components/OnboardingStepHeader';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { isValidMnemonic } from 'ethers/lib/utils';
import { Trans, useTranslation } from 'react-i18next';
import { PasswordInput } from '@src/components/common/PasswordInput';

interface ImportProps {
  onCancel(): void;
  onBack(): void;
}

export const Import = ({ onCancel, onBack }: ImportProps) => {
  const { capture } = useAnalyticsContext();
  const { setMnemonic, setNextPhase } = useOnboardingContext();
  const [recoveryPhrase, setRecoveryPhrase] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { t } = useTranslation();

  const isPhraseCorrectLength = (phrase: string) => {
    return [12, 24].includes(phrase.trim().split(' ').length);
  };

  const isPhraseValid = (phrase: string) => {
    return phrase && isPhraseCorrectLength(phrase) && isValidMnemonic(phrase);
  };

  const onPhraseChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phrase = e.currentTarget.value;
    setRecoveryPhrase(phrase);

    if (!isPhraseValid(phrase)) {
      setError(t('Invalid mnemonic phrase'));
    } else {
      setError('');
    }
  };

  const nextButtonDisabled = !isPhraseValid(recoveryPhrase) || !!error;

  return (
    <VerticalFlex width="100%" align="center">
      <OnboardingStepHeader
        testId="enter-recovery-phrase"
        title={t('Enter Secret Recovery Phrase')}
        onBack={onBack}
        onClose={onCancel}
      />
      <VerticalFlex align="center" grow="1">
        <Typography align="center" margin="8px 0 0" size={14} height="17px">
          <Trans i18nKey="Access an existing wallet with your secret <br/>recovery phrase." />
        </Typography>
        <PasswordInput
          data-testid="recovery-phrase-input"
          autoFocus
          margin="32px 0 0 0"
          error={!!error}
          errorMessage={error}
          placeholder={t('Type your recovery phrase')}
          onChange={onPhraseChanged}
        />
      </VerticalFlex>
      <PrimaryButton
        data-testid="recovery-phrase-next-button"
        size={ComponentSize.LARGE}
        width="343px"
        disabled={nextButtonDisabled}
        onClick={async () => {
          capture('OnboardingMnemonicImported');
          setMnemonic(recoveryPhrase);
          setNextPhase(OnboardingPhase.ANALYTICS_CONSENT);
        }}
      >
        {t('Next')}
      </PrimaryButton>
    </VerticalFlex>
  );
};
