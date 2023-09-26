import { useState } from 'react';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { OnboardingPhase } from '@src/background/services/onboarding/models';
import { OnboardingStepHeader } from './components/OnboardingStepHeader';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { Mnemonic } from 'ethers';
import { Trans, useTranslation } from 'react-i18next';
import { Stack, TextField, Typography, useTheme } from '@avalabs/k2-components';
import { PageNav } from './components/PageNav';

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
  const theme = useTheme();

  const isPhraseCorrectLength = (phrase: string) => {
    return [12, 24].includes(phrase.trim().split(' ').length);
  };

  const isPhraseValid = (phrase: string) => {
    return (
      phrase &&
      isPhraseCorrectLength(phrase) &&
      Mnemonic.isValidMnemonic(phrase)
    );
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
    <Stack
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      <OnboardingStepHeader
        testId="enter-recovery-phrase"
        title={t('Secret Recovery Phrase')}
        onClose={onCancel}
      />
      <Stack
        sx={{
          flexGrow: 1,
          pt: 1,
          px: 6,
        }}
      >
        <Typography variant="body2">
          <Trans i18nKey="Access an existing wallet with your secret recovery phrase" />
        </Typography>
        <Stack
          sx={{
            pt: 5,
            width: theme.spacing(44),
            alignSelf: 'center',
          }}
        >
          <TextField
            autoFocus
            placeholder={t('Input Secret Recovery Phrase')}
            type="password"
            label={t('Input Secret Recovery Phrase')}
            onChange={onPhraseChanged}
            error={!!error}
            helperText={error}
            fullWidth
          />
        </Stack>
      </Stack>
      <PageNav
        onBack={onBack}
        onNext={async () => {
          capture('OnboardingMnemonicImported');
          setMnemonic(recoveryPhrase);
          setNextPhase(OnboardingPhase.ANALYTICS_CONSENT);
        }}
        disableNext={nextButtonDisabled}
        expand={true}
        steps={3}
        activeStep={0}
      />
    </Stack>
  );
};
