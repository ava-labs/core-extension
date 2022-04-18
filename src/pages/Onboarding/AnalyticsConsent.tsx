import {
  VerticalFlex,
  Typography,
  PrimaryButton,
  ComponentSize,
  HorizontalFlex,
  SecondaryButton,
  CloseIcon,
} from '@avalabs/react-components';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { OnboardingPhase } from '@src/background/services/onboarding/models';
import { useTheme } from 'styled-components';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

export const AnalyticsConsent = () => {
  const theme = useTheme();
  const { setNextPhase, setAnalyticsConsent } = useOnboardingContext();
  const { capture, stopDataCollection } = useAnalyticsContext();

  return (
    <VerticalFlex width="100%" height="100%" align="center">
      <VerticalFlex width="386px" align="center">
        <Typography as="h1" size={20} height="22px" weight={600} margin="0">
          Help Us Improve Core
        </Typography>
        <Typography size={16} height="24px" margin="24px 0 0">
          Core would like to gather data using local storage and similar
          technologies to help us understand how our users interact with Core.
        </Typography>
        <Typography size={16} height="24px" margin="16px 0 0">
          This enables us to develop improvements and enhance your experience.
          To find out more you can read our{' '}
          <Typography
            as="a"
            target="_blank"
            href="https://wallet.avax.network/legal?core"
            color={theme.colors.secondary1}
          >
            Privacy Policy
          </Typography>
          {'. '}
          You can always opt out by visiting the settings page.
        </Typography>
        <Typography
          as="h2"
          margin="56px 0 16px"
          size={18}
          height="22px"
          weight={700}
        >
          Core will never...
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
            <CloseIcon height="18px" color={theme.colors.error} />
          </HorizontalFlex>
          <Typography size={16} height="24px" margin="0 0 0 24px">
            <Typography size={16} height="24px" weight={700}>
              Never
            </Typography>{' '}
            collect keys, public addresses, balances, or hashes
          </Typography>
        </HorizontalFlex>
        <HorizontalFlex margin="16px 0">
          <HorizontalFlex
            width="32px"
            height="32px"
            align="center"
            justify="center"
          >
            <CloseIcon height="18px" color={theme.colors.error} />
          </HorizontalFlex>
          <Typography size={16} height="24px" margin="0 0 0 24px">
            <Typography size={16} height="24px" weight={700}>
              Never
            </Typography>{' '}
            collect full IP addresses
          </Typography>
        </HorizontalFlex>
        <HorizontalFlex>
          <HorizontalFlex
            width="32px"
            height="32px"
            align="center"
            justify="center"
          >
            <CloseIcon height="18px" color={theme.colors.error} />
          </HorizontalFlex>
          <Typography size={16} height="24px" margin="0 0 0 24px">
            <Typography size={16} height="24px" weight={700}>
              Never
            </Typography>{' '}
            sell or share data. Ever!
          </Typography>
        </HorizontalFlex>
      </VerticalFlex>
      <HorizontalFlex grow="1" align="flex-end">
        <PrimaryButton
          size={ComponentSize.LARGE}
          width="190px"
          margin="0 16px 0 0"
          onClick={async () => {
            capture('OnboardingAnalyticsAccepted');
            setAnalyticsConsent(true);
            setNextPhase(OnboardingPhase.PASSWORD);
          }}
        >
          I Agree
        </PrimaryButton>
        <SecondaryButton
          size={ComponentSize.LARGE}
          width="190px"
          onClick={async () => {
            capture('OnboardingAnalyticsRejected');
            stopDataCollection();
            setAnalyticsConsent(false);
            setNextPhase(OnboardingPhase.PASSWORD);
          }}
        >
          <Typography size={16} weight={600} color={theme.colors.text2}>
            No thanks
          </Typography>
        </SecondaryButton>
      </HorizontalFlex>
    </VerticalFlex>
  );
};
