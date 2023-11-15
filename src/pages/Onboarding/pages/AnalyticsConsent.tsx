import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import {
  OnboardingURLs,
  OnboardingPhase,
} from '@src/background/services/onboarding/models';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { Trans, useTranslation } from 'react-i18next';
import { OnboardingStepHeader } from '../components/OnboardingStepHeader';
import {
  Button,
  ChevronLeftIcon,
  DataThresholdingIcon,
  ImportContactsIcon,
  KeyIcon,
  Stack,
  Typography,
} from '@avalabs/k2-components';
import { PageNav } from '../components/PageNav';
import { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { TypographyLink } from '../components/TypographyLink';

export const AnalyticsConsent = () => {
  const { setAnalyticsConsent, submit, onboardingPhase } =
    useOnboardingContext();
  const { capture, stopDataCollection } = useAnalyticsContext();
  const { t } = useTranslation();
  const history = useHistory();

  const coreWebLink =
    onboardingPhase === OnboardingPhase.CREATE_WALLET
      ? `${process.env.CORE_WEB_BASE_URL}/discover/?newUser=1`
      : process.env.CORE_WEB_BASE_URL;

  const getSteps = useMemo(() => {
    if (onboardingPhase === OnboardingPhase.IMPORT_WALLET) {
      return { stepsNumber: 3, activeStep: 2 };
    }
    if (onboardingPhase === OnboardingPhase.KEYSTONE) {
      return { stepsNumber: 6, activeStep: 5 };
    }
    if (onboardingPhase === OnboardingPhase.SEEDLESS_GOOGLE) {
      return { stepsNumber: 2, activeStep: 1 };
    }
    return { stepsNumber: 4, activeStep: 3 };
  }, [onboardingPhase]);

  useEffect(() => {
    if (!onboardingPhase) {
      history.push(OnboardingURLs.ONBOARDING_HOME);
    }
    capture(OnboardingPhase.ANALYTICS_CONSENT);
  }, [capture, history, onboardingPhase]);

  return (
    <Stack
      sx={{
        width: '465px',
        height: '100%',
      }}
    >
      <OnboardingStepHeader title={t('Help Us Improve Core')} />
      <Stack
        sx={{
          mt: 4,
          flexGrow: 1,
        }}
      >
        <Stack sx={{ mb: 4 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {t(
              'Core would like to gather data using local storage and similar technologies to help us understand how our users interact with Core.'
            )}
          </Typography>
          <Typography variant="body1">
            <Trans
              i18nKey="This enables us to develop improvements and enhance your experience, to find out more you can read our <typography>Privacy Policy</typography>. You can always opt out by visiting the settings page."
              components={{
                typography: (
                  <TypographyLink
                    as="a"
                    target="_blank"
                    href="https://www.avalabs.org/privacy-policy"
                  />
                ),
              }}
            />
          </Typography>
        </Stack>
        <Typography variant="h5" sx={{ mb: 1 }}>
          {t('Core will never...')}
        </Typography>
        <Stack
          sx={{
            alignItems: 'flex-start',
            rowGap: 1,
            width: '100%',
          }}
        >
          <Stack direction="row">
            <KeyIcon size={22} sx={{ mr: 2 }} />
            <Typography variant="body1">
              {t('Collect keys, public addresses, balances, or hashes')}
            </Typography>
          </Stack>
          <Stack direction="row">
            <ImportContactsIcon size={22} sx={{ mr: 2 }} />
            <Typography variant="body1">
              {t('Collect full IP addresses')}
            </Typography>
          </Stack>
          <Stack direction="row">
            <DataThresholdingIcon size={22} sx={{ mr: 2 }} />
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
          submit(() =>
            coreWebLink ? window.location.replace(coreWebLink) : window.close()
          );
        }}
        backText={t('No Thanks')}
        onNext={async () => {
          capture('OnboardingAnalyticsAccepted');
          setAnalyticsConsent(true);
          submit(() =>
            coreWebLink ? window.location.replace(coreWebLink) : window.close()
          );
        }}
        nextText={t('I Agree')}
        disableNext={false}
        expand={onboardingPhase !== OnboardingPhase.CREATE_WALLET}
        steps={getSteps.stepsNumber}
        activeStep={getSteps.activeStep}
      >
        <Button
          variant="text"
          onClick={() => history.goBack()}
          sx={{
            color: 'secondary',
          }}
        >
          <ChevronLeftIcon size={16} />
          <Typography variant="caption" sx={{ ml: 1 }}>
            {t('Back')}
          </Typography>
        </Button>
      </PageNav>
    </Stack>
  );
};
