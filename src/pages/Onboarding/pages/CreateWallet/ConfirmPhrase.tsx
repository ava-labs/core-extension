import { useState } from 'react';
import { OnboardingStepHeader } from '../../components/OnboardingStepHeader';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { Trans, useTranslation } from 'react-i18next';
import { Stack, Typography, useTheme } from '@avalabs/k2-components';
import { Mnemonic } from './Mnemonic';
import { PageNav } from '../../components/PageNav';

interface ConfirmPhraseProps {
  mnemonic: string;
  onCancel: () => void;
  onNext: () => void;
  onBack: () => void;
}

export function ConfirmPhrase({
  onNext,
  onBack,
  mnemonic,
}: ConfirmPhraseProps) {
  const { capture } = useAnalyticsContext();
  const [termsConfirmed, setTermsConfirmed] = useState<boolean>(false);
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Stack
      sx={{
        height: '100%',
      }}
    >
      <OnboardingStepHeader
        testId="confirm-phrase"
        title={t('Verify Phrase')}
      />
      <Stack
        data-testid="confirm-phrase-section"
        sx={{
          flexGrow: 1,
          pt: 1,
          px: 6,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="body2"
          sx={{ mb: 5 }}
          color={theme.palette.text.secondary}
        >
          <Trans i18nKey="Select the words below to verify your secret recovery phrase." />
        </Typography>
        <Stack alignSelf="center">
          <Mnemonic
            phrase={mnemonic}
            confirmMnemonic={true}
            onConfirmedChange={(confirmed) => {
              setTermsConfirmed(confirmed);
            }}
          />
        </Stack>
      </Stack>

      <PageNav
        onBack={onBack}
        onNext={() => {
          capture('OnboardingMnemonicVerified');
          onNext();
        }}
        nextText={t('Save')}
        disableNext={!termsConfirmed}
        expand={false}
        steps={4}
        activeStep={1}
      />
    </Stack>
  );
}
