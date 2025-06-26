import { FC } from 'react';
import QRCodeSVG from 'qrcode.react';
import { useTranslation } from 'react-i18next';
import { Button, Stack, StackProps, Typography } from '@avalabs/k2-alpine';

import {
  OnboardingStepActions,
  OnboardingStepContent,
  OnboardingStepDescription,
  OnboardingStepTitle,
} from '@/components/OnboardingModal';

type ScanAuthenticatorCodeProps = StackProps & {
  code: string;
  onNext: () => void;
};

export const ScanAuthenticatorCode: FC<ScanAuthenticatorCodeProps> = ({
  code,
  onNext,
  ...stackProps
}) => {
  const { t } = useTranslation();

  return (
    <Stack height="100%" width="100%" {...stackProps}>
      <OnboardingStepTitle>{t(`Scan QR code`)}</OnboardingStepTitle>
      <OnboardingStepDescription>
        {t(
          `Install or open your authenticator app to scan the QR code. If you prefer, you can manually copy the code by clicking the link below.`,
        )}
      </OnboardingStepDescription>
      <OnboardingStepContent>
        <QRCodeSVG renderAs="svg" value={code ?? ''} level="Q" size={160} />
        <Typography variant="subtitle1" color="text.secondary">
          {t('Copy code')}
        </Typography>
        <Typography variant="body2" color="text.primary">
          {code}
        </Typography>
      </OnboardingStepContent>
      <OnboardingStepActions>
        <Button
          sx={{ minWidth: 150, alignSelf: 'flex-end' }}
          variant="contained"
          color="primary"
          onClick={onNext}
        >
          {t('Skip')}
        </Button>
      </OnboardingStepActions>
    </Stack>
  );
};
