import {
  VerticalFlex,
  Typography,
  PrimaryButton,
  ComponentSize,
  HorizontalFlex,
  CheckmarkIcon,
} from '@avalabs/react-components';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { OnboardingPhase } from '@src/background/services/onboarding/models';
import { useTheme } from 'styled-components';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { t } from 'i18next';
import { Trans } from 'react-i18next';

export const AnalyticsConsent = () => {
  const theme = useTheme();
  const { setNextPhase, setAnalyticsConsent } = useOnboardingContext();
  const { capture, stopDataCollection } = useAnalyticsContext();

  return (
    <VerticalFlex width="100%" height="100%" align="center">
      <VerticalFlex width="386px" align="center">
        <Typography as="h1" size={20} height="22px" weight={600} margin="0">
          {t('Help Us Improve Core')}
        </Typography>
        <Typography size={16} height="24px" margin="24px 0 0">
          {t(
            'Core would like to gather data using local storage and similar technologies to help us understand how our users interact with Core.'
          )}
        </Typography>
        <Typography size={16} height="24px" margin="16px 0 0">
          <Trans
            i18nKey="This enables us to develop improvements and enhance your experience, to find out more you can read our <typography>Privacy Policy</typography>. You can always opt out by visiting the settings page."
            components={{
              typography: (
                <Typography
                  as="a"
                  target="_blank"
                  href="https://www.avalabs.org/privacy-policy"
                  color={theme.colors.secondary1}
                />
              ),
            }}
          />
        </Typography>
        <Typography
          as="h2"
          margin="56px 0 16px"
          size={18}
          height="22px"
          weight={700}
        >
          {t('Core will...')}
        </Typography>
      </VerticalFlex>
      <VerticalFlex align="flex-start" width="400px">
        <HorizontalFlex>
          <HorizontalFlex
            width="32px"
            height="32px"
            align="center"
            justify="center"
            padding="0 6px"
            shrink={0}
          >
            <CheckmarkIcon height="22px" color={theme.colors.success} />
          </HorizontalFlex>
          <Typography size={16} height="24px" margin="0 0 0 24px">
            <Trans
              i18nKey="<typography>Never</typography> collect keys, public addresses, balances, or hashes"
              components={{
                typography: <Typography size={16} height="24px" weight={700} />,
              }}
            />
          </Typography>
        </HorizontalFlex>
        <HorizontalFlex margin="16px 0" align="center">
          <HorizontalFlex
            width="32px"
            height="32px"
            align="center"
            justify="center"
          >
            <CheckmarkIcon height="22px" color={theme.colors.success} />
          </HorizontalFlex>
          <Typography size={16} height="24px" margin="0 0 0 24px">
            <Trans
              i18nKey="<typography>Never</typography> collect full IP addresses"
              components={{
                typography: <Typography size={16} height="24px" weight={700} />,
              }}
            />
          </Typography>
        </HorizontalFlex>
        <HorizontalFlex align="center">
          <HorizontalFlex
            width="32px"
            height="32px"
            align="center"
            justify="center"
          >
            <CheckmarkIcon height="22px" color={theme.colors.success} />
          </HorizontalFlex>
          <Typography size={16} height="24px" margin="0 0 0 24px">
            <Trans
              i18nKey="<typography>Never</typography> sell or share data. Ever!"
              components={{
                typography: <Typography size={16} height="24px" weight={700} />,
              }}
            />
          </Typography>
        </HorizontalFlex>
      </VerticalFlex>
      <HorizontalFlex grow="1" align="flex-end">
        <PrimaryButton
          data-testid="consent-agree-button"
          size={ComponentSize.LARGE}
          width="190px"
          margin="0 16px 0 0"
          onClick={async () => {
            capture('OnboardingAnalyticsAccepted');
            setAnalyticsConsent(true);
            setNextPhase(OnboardingPhase.PASSWORD);
          }}
        >
          {t('I Agree')}
        </PrimaryButton>
        <PrimaryButton
          data-testid="no-thanks-button"
          size={ComponentSize.LARGE}
          width="190px"
          onClick={async () => {
            capture('OnboardingAnalyticsRejected');
            stopDataCollection();
            setAnalyticsConsent(false);
            setNextPhase(OnboardingPhase.PASSWORD);
          }}
        >
          {t('No Thanks')}
        </PrimaryButton>
      </HorizontalFlex>
    </VerticalFlex>
  );
};
