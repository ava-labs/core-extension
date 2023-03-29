import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { OnboardingPhase } from '@src/background/services/onboarding/models';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { Trans, useTranslation } from 'react-i18next';
import { OnboardingStepHeader } from './components/OnboardingStepHeader';
import {
  Button,
  CheckIcon,
  ChevronLeftIcon,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-components';
import { OnboardingPath } from './Onboarding';
import { PageNav } from './components/PageNav';
import { useMemo } from 'react';

interface AnalyticsProps {
  onCancel(): void;
  onboardingPath?: OnboardingPath;
}

export const AnalyticsConsent = ({
  onCancel,
  onboardingPath,
}: AnalyticsProps) => {
  const theme = useTheme();
  const { setNextPhase, setAnalyticsConsent } = useOnboardingContext();
  const { capture, stopDataCollection } = useAnalyticsContext();
  const { t } = useTranslation();

  const getSteps = useMemo(() => {
    if (onboardingPath === OnboardingPath.NEW_WALLET) {
      return { stepsNumber: 4, activeStep: 0 };
    }
    if (onboardingPath === OnboardingPath.KEYSTONE) {
      return { stepsNumber: 6, activeStep: 4 };
    }
    return { stepsNumber: 3, activeStep: 1 };
  }, [onboardingPath]);

  return (
    <Stack
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      <OnboardingStepHeader
        title={t('Help Us Improve Core')}
        onClose={onCancel}
      />
      <Stack
        sx={{
          flexGrow: 1,
          pt: 1,
          px: 6,
        }}
      >
        <Stack sx={{ rowGap: 2 }}>
          <Typography variant="body1">
            {t(
              'Core would like to gather data using local storage and similar technologies to help us understand how our users interact with Core.'
            )}
          </Typography>
          <Typography variant="body1">
            <Trans
              i18nKey="This enables us to develop improvements and enhance your experience, to find out more you can read our <typography>Privacy Policy</typography>. You can always opt out by visiting the settings page."
              components={{
                typography: (
                  <Typography
                    as="a"
                    target="_blank"
                    href="https://www.avalabs.org/privacy-policy"
                    sx={{ color: 'secondary.main' }}
                  />
                ),
              }}
            />
          </Typography>
        </Stack>
        <Typography variant="h5" sx={{ pt: 5, pb: 1 }}>
          {t('Core will never...')}
        </Typography>
        <Stack
          sx={{
            alignItems: 'flex-start',
            rowGap: 2,
            width: '100%',
          }}
        >
          <Stack direction="row">
            <CheckIcon
              size={22}
              sx={{ mr: 2, color: theme.palette.success.main }}
            />
            <Typography variant="body1">
              {t('Collect keys, public addresses, balances, or hashes')}
            </Typography>
          </Stack>
          <Stack direction="row">
            <CheckIcon
              size={22}
              sx={{ mr: 2, color: theme.palette.success.main }}
            />
            <Typography variant="body1">
              {t('Collect full IP addresses')}
            </Typography>
          </Stack>
          <Stack direction="row">
            <CheckIcon
              size={22}
              sx={{ mr: 2, color: theme.palette.success.main }}
            />
            <Typography variant="body1">
              {t('Sell or share data. Ever!')}
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      <PageNav
        onBack={async () => {
          capture('OnboardingAnalyticsRejected');
          stopDataCollection();
          setAnalyticsConsent(false);
          setNextPhase(OnboardingPhase.PASSWORD);
        }}
        backText={t('No Thanks')}
        onNext={async () => {
          capture('OnboardingAnalyticsAccepted');
          setAnalyticsConsent(true);
          setNextPhase(OnboardingPhase.PASSWORD);
        }}
        nextText={t('I Agree')}
        disableNext={false}
        expand={onboardingPath !== OnboardingPath.NEW_WALLET}
        steps={getSteps.stepsNumber}
        activeStep={getSteps.activeStep}
      >
        {onboardingPath !== OnboardingPath.NEW_WALLET && (
          <Button
            variant="text"
            onClick={() => {
              if (onboardingPath === OnboardingPath.RECOVERY) {
                setNextPhase(OnboardingPhase.IMPORT_WALLET);
              } else if (onboardingPath === OnboardingPath.LEDGER) {
                setNextPhase(OnboardingPhase.LEDGER);
              }
            }}
            sx={{
              color: 'secondary',
            }}
          >
            <ChevronLeftIcon size={16} />
            <Typography variant="caption" sx={{ ml: 1 }}>
              {t('Back')}
            </Typography>
          </Button>
        )}
      </PageNav>
    </Stack>
  );
};
