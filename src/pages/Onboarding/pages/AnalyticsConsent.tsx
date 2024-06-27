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
  Stack,
  Typography,
} from '@avalabs/k2-components';
import { PageNav } from '../components/PageNav';
import { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { TypographyLink } from '../components/TypographyLink';
import { VerifyGoBackModal } from './Seedless/modals/VerifyGoBackModal';

export const AnalyticsConsent = () => {
  const { setAnalyticsConsent, submit, onboardingPhase, analyticsConsent } =
    useOnboardingContext();
  const { capture, stopDataCollection } = useAnalyticsContext();
  const { t } = useTranslation();
  const history = useHistory();
  const [isVerifyGoBackModalOpen, setIsVerifyGoBackModalOpen] = useState(false);

  const getSteps = useMemo(() => {
    if (onboardingPhase === OnboardingPhase.IMPORT_WALLET) {
      return { stepsNumber: 3, activeStep: 2 };
    }
    if (onboardingPhase === OnboardingPhase.KEYSTONE) {
      return { stepsNumber: 6, activeStep: 5 };
    }
    if (
      onboardingPhase === OnboardingPhase.SEEDLESS_GOOGLE ||
      onboardingPhase === OnboardingPhase.SEEDLESS_APPLE
    ) {
      return { stepsNumber: 3, activeStep: 2 };
    }
    return { stepsNumber: 4, activeStep: 3 };
  }, [onboardingPhase]);

  useEffect(() => {
    if (!onboardingPhase) {
      history.push(OnboardingURLs.ONBOARDING_HOME);
    }
    capture(OnboardingPhase.ANALYTICS_CONSENT);
  }, [capture, history, onboardingPhase]);

  useEffect(() => {
    if (analyticsConsent === undefined) {
      return;
    }

    const coreWebLink = `${process.env.CORE_WEB_BASE_URL}/discover/?newUser=1`;

    // submit handler can't be in the onNext and onBack callbacks since it would run in a stale closure
    // resulting in an always false analytics consent
    submit(() =>
      coreWebLink ? window.location.replace(coreWebLink) : window.close()
    );
  }, [analyticsConsent, onboardingPhase, submit]);

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
        <Typography variant="body1" sx={{ mb: 1 }}>
          <Trans
            i18nKey="Core will <typography>never</typography> sell or share data."
            components={{
              typography: (
                <Typography
                  component="span"
                  sx={{ fontWeight: 'fontWeightBold' }}
                />
              ),
            }}
          />
        </Typography>
      </Stack>

      <PageNav
        onBack={async () => {
          capture('OnboardingAnalyticsRejected');
          stopDataCollection();
          setAnalyticsConsent(false);
        }}
        backText={t('No Thanks')}
        onNext={async () => {
          capture('OnboardingAnalyticsAccepted');
          setAnalyticsConsent(true);
        }}
        nextText={t('I Agree')}
        disableNext={false}
        expand={onboardingPhase !== OnboardingPhase.CREATE_WALLET}
        steps={getSteps.stepsNumber}
        activeStep={getSteps.activeStep}
      >
        <Button
          variant="text"
          onClick={() => {
            if (onboardingPhase === OnboardingPhase.SEEDLESS_GOOGLE) {
              setIsVerifyGoBackModalOpen(true);
              return;
            }
            history.goBack();
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
      </PageNav>
      <VerifyGoBackModal
        isOpen={isVerifyGoBackModalOpen}
        onBack={() => {
          history.push(OnboardingURLs.ONBOARDING_HOME);
          setIsVerifyGoBackModalOpen(false);
        }}
        onCancel={() => {
          setIsVerifyGoBackModalOpen(false);
        }}
      />
    </Stack>
  );
};
