import { useState } from 'react';
import { OnboardingStepHeader } from '../components/OnboardingStepHeader';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { Trans, useTranslation } from 'react-i18next';
import { Checkbox, Stack, Typography, useTheme } from '@avalabs/k2-components';
import { Mnemonic } from './Mnemonic';
import { PageNav } from '../components/PageNav';

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
  const { capture } = useAnalyticsContext();
  const [termsConfirmed, setTermsConfirmed] = useState<boolean>(false);
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Stack
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      <OnboardingStepHeader
        testId="copy-phrase"
        title={t('Secret Recovery Phrase')}
        onClose={onCancel}
      />
      <Stack
        data-testid="copy-phrase-section"
        sx={{
          pt: 1,
          px: 6,
          flexGrow: 1,
        }}
      >
        <Typography variant="body2" sx={{ mb: 5 }}>
          <Trans i18nKey="This is your secret recovery phrase. Write it down, and store it in a secure location." />
        </Typography>
        <Stack alignItems="center" sx={{ rowGap: 1 }}>
          <Stack sx={{ width: theme.spacing(44) }}>
            <Mnemonic
              phrase={mnemonic}
              confirmMnemonic={false}
              onConfirmedChange={() => {
                //noop, confirmation is next step
              }}
            />
          </Stack>
          <Stack sx={{ width: theme.spacing(44) }}>
            <Checkbox
              data-testid="privacy-policy-checkbox"
              onChange={(e) => {
                setTermsConfirmed(e.target.checked);
              }}
              disableRipple
              style={{
                height: theme.spacing(2.5),
                color: termsConfirmed
                  ? theme.palette.secondary.main
                  : theme.palette.primary.main,
              }}
              label={
                <Typography variant="caption">
                  <Trans i18nKey="I understand losing this phrase will result in lost funds. I have stored it in a secure location." />
                </Typography>
              }
            />
          </Stack>
        </Stack>
      </Stack>

      <PageNav
        onBack={onBack}
        onNext={() => {
          capture('OnboardingMnemonicCreated');
          onNext();
        }}
        disableNext={!termsConfirmed}
        expand={false}
        steps={4}
        activeStep={2}
      />
    </Stack>
  );
}
