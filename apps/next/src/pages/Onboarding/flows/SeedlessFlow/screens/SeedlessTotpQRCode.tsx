import { FC } from 'react';
import QRCodeSVG from 'qrcode.react';
import { useTranslation } from 'react-i18next';
import { Stack, toast, Typography, useTheme } from '@avalabs/k2-alpine';

import {
  OnboardingStepActions,
  OnboardingStepContent,
  OnboardingStepDescription,
  OnboardingStepTitle,
} from '@/components/OnboardingModal';
import { NavButton } from '@/pages/Onboarding/components/NavButton';
import { LoadingScreen } from '@/pages/Onboarding/components/LoadingScreen';

type SeedlessTotpQRCodeProps = {
  challengeUrl: string;
  onNext: () => void;
};

export const SeedlessTotpQRCode: FC<SeedlessTotpQRCodeProps> = ({
  challengeUrl,
  onNext,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const totpSecret = challengeUrl
    ? new URL(challengeUrl).searchParams.get('secret')
    : '';

  return (
    <>
      <OnboardingStepTitle>{t(`Scan QR code`)}</OnboardingStepTitle>
      <OnboardingStepDescription>
        {t(
          `Install or open your authenticator app to scan the QR code. If you prefer, you can manually copy the code by clicking the link below.`,
        )}
      </OnboardingStepDescription>
      <OnboardingStepContent>
        {challengeUrl && totpSecret ? (
          <Stack
            gap={4}
            justifyContent="center"
            alignItems="center"
            height="100%"
            width="100%"
          >
            <QRCodeSVG
              renderAs="svg"
              bgColor="transparent"
              fgColor={theme.palette.primary.main}
              value={challengeUrl}
              level="Q"
              size={224}
            />
            <Stack maxWidth={300} textAlign="center" gap={1}>
              <Typography variant="subtitle1" color="text.secondary">
                {t(
                  'Alternatively, open any authenticator app and enter this code:',
                )}
              </Typography>
              <Typography
                variant="mono"
                color="text.primary"
                role="button"
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  navigator.clipboard.writeText(totpSecret);
                  toast.success(t('Code copied to clipboard'));
                }}
              >
                {totpSecret}
              </Typography>
            </Stack>
          </Stack>
        ) : (
          <LoadingScreen />
        )}
      </OnboardingStepContent>
      <OnboardingStepActions>
        <NavButton color="primary" onClick={onNext}>
          {t(`Next`)}
        </NavButton>
      </OnboardingStepActions>
    </>
  );
};
