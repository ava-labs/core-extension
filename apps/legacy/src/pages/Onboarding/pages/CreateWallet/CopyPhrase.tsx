import { useState } from 'react';
import { OnboardingStepHeader } from '../../components/OnboardingStepHeader';
import { useAnalyticsContext } from '@core/ui';
import { Trans, useTranslation } from 'react-i18next';
import {
  Checkbox,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';
import { Mnemonic } from './Mnemonic';
import { PageNav } from '../../components/PageNav';

interface CopyPhraseProps {
  mnemonic: string;
  onCancel: () => void;
  onBack: () => void;
  onNext: () => void;
}

export function CopyPhrase({ onBack, onNext, mnemonic }: CopyPhraseProps) {
  const { capture } = useAnalyticsContext();
  const [termsConfirmed, setTermsConfirmed] = useState<boolean>(false);
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Stack
      sx={{
        width: '410px',
        height: '100%',
      }}
    >
      <OnboardingStepHeader
        testId="copy-phrase"
        title={t('Write Down Recovery Phrase')}
      />
      <Stack
        data-testid="copy-phrase-section"
        sx={{
          flexGrow: 1,
          textAlign: 'center',
          mb: 3,
        }}
      >
        <Typography
          variant="body2"
          sx={{ mb: 5 }}
          color={theme.palette.text.secondary}
        >
          <Trans i18nKey="This is your secret recovery phrase. Write it down, and store it in a secure location." />
        </Typography>
        <Stack alignItems="center" sx={{ rowGap: 1 }}>
          <Stack sx={{ width: theme.spacing(44), mb: 4 }}>
            <Mnemonic phrase={mnemonic} confirmMnemonic={false} />
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
                <Stack sx={{ textAlign: 'left' }}>
                  <Typography variant="caption">
                    <Trans i18nKey="I understand losing this phrase will result in lost funds. I have stored it in a secure location." />
                  </Typography>
                </Stack>
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
        activeStep={0}
      />
    </Stack>
  );
}
