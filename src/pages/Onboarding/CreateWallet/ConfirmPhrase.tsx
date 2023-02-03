import { useState } from 'react';
import { OnboardingStepHeader } from '../components/OnboardingStepHeader';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { Trans, useTranslation } from 'react-i18next';
import { Stack, Typography } from '@avalabs/k2-components';
import { Mnemonic } from './Mnemonic';
import { PageNav } from '../components/PageNav';

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
  const { t } = useTranslation();

  return (
    <Stack
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      <OnboardingStepHeader
        testId="confirm-phrase"
        title={t('Verify Secret Recovery Phrase')}
        onClose={onCancel}
      />
      <Stack
        data-testid="confirm-phrase-section"
        sx={{
          flexGrow: 1,
          pt: 1,
          px: 6,
        }}
      >
        <Typography variant="body2" sx={{ mb: 5 }}>
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
        activeStep={3}
      />
    </Stack>
  );
}
