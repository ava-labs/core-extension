import { useOnboardingContext } from '@core/ui';
import { OnboardingURLs, OnboardingPhase } from '@core/types';
import { useAnalyticsContext } from '@core/ui';
import { Trans, useTranslation } from 'react-i18next';
import {
  AirdropIcon,
  Button,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';
import { PageNav } from '../components/PageNav';
import { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { VerifyGoBackModal } from './Seedless/modals/VerifyGoBackModal';
import { FeatureGates } from '@core/types';
import { useFeatureFlagContext } from '@core/ui';

export const AnalyticsConsent = () => {
  const {
    setAnalyticsConsent,
    submit,
    onboardingPhase,
    analyticsConsent,
    newsletterEmail,
    isNewsletterEnabled,
  } = useOnboardingContext();
  const { isFlagEnabled } = useFeatureFlagContext();
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
    if (onboardingPhase === OnboardingPhase.LEDGER) {
      return isFlagEnabled(FeatureGates.SOLANA_SUPPORT)
        ? {
            stepsNumber: 5,
            activeStep: 4,
          }
        : { stepsNumber: 3, activeStep: 2 };
    }
    return { stepsNumber: 4, activeStep: 3 };
  }, [onboardingPhase, isFlagEnabled]);

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

    const coreWebLink = `${process.env.CORE_WEB_BASE_URL}/portfolio/?newUser=1`;

    // submit handler can't be in the onNext and onBack callbacks since it would run in a stale closure
    // resulting in an always false analytics consent
    submit(async () =>
      coreWebLink ? window.location.replace(coreWebLink) : window.close(),
    );
  }, [
    analyticsConsent,
    onboardingPhase,
    submit,
    newsletterEmail,
    capture,
    isNewsletterEnabled,
  ]);

  return (
    <Stack
      sx={{
        width: '465px',
        height: '100%',
      }}
    >
      <Stack
        sx={{
          mt: 4,
          flexGrow: 1,
          textAlign: 'center',
          gap: 4,
          justifyContent: 'center',
        }}
      >
        <Stack sx={{ alignItems: 'center', gap: 2 }}>
          <AirdropIcon size={64} />
          <Typography variant="h3">{t('Unlock Airdrops')}</Typography>
        </Stack>
        <Stack sx={{ mb: 4, gap: 3 }}>
          <Typography variant="body2">
            <Trans
              i18nKey="As a Core user, you have the option to opt-in for <b>airdrop rewards</b> based on your activity and engagement. Core will collect anonymous interaction data to power this feature."
              components={{
                b: <b />,
              }}
            />
          </Typography>
          <Typography variant="body2">
            <Trans
              i18nKey="Core is committed to protecting your privacy. We will <b>never</b> sell or share your data. If you wish, you can disable this at any time in the settings menu."
              components={{
                b: <b />,
              }}
            />
          </Typography>
        </Stack>
      </Stack>

      <PageNav
        onBack={() => {
          if (
            onboardingPhase === OnboardingPhase.SEEDLESS_GOOGLE ||
            onboardingPhase === OnboardingPhase.SEEDLESS_APPLE
          ) {
            setIsVerifyGoBackModalOpen(true);
            return;
          }
          history.goBack();
        }}
        backText={t('Back')}
        onNext={async () => {
          capture('OnboardingAnalyticsAccepted');
          setAnalyticsConsent(true);
        }}
        nextText={t('Unlock')}
        disableNext={false}
        expand
        steps={getSteps.stepsNumber}
        activeStep={getSteps.activeStep}
      >
        <Button
          variant="text"
          onClick={async () => {
            capture('OnboardingAnalyticsRejected');
            stopDataCollection();
            setAnalyticsConsent(false);
          }}
          disableRipple
          sx={{
            color: 'secondary',
          }}
        >
          <Typography variant="caption" sx={{ ml: 1 }}>
            {t('No Thanks')}
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
