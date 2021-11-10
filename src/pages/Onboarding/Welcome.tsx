import React from 'react';
import {
  VerticalFlex,
  Typography,
  PrimaryButton,
  SecondaryButton,
  TextButton,
  ComponentSize,
} from '@avalabs/react-components';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { OnboardingPhase } from '@src/background/services/onboarding/models';
import { LoginIllustration } from '@src/components/common/LoginIllustation';

export function Welcome() {
  const { setNextPhase } = useOnboardingContext();

  return (
    <VerticalFlex
      width="100%"
      align="center"
      padding="72px 0 22px"
      justify="space-between"
    >
      <VerticalFlex align="center" grow="1">
        <Typography as="h1" size={24} weight="bold">
          Welcome!
        </Typography>
        <VerticalFlex justify="center" grow="1">
          <LoginIllustration size={182} variant="secondary" />
        </VerticalFlex>
      </VerticalFlex>
      <VerticalFlex align="center">
        <PrimaryButton
          size={ComponentSize.LARGE}
          onClick={() => {
            setNextPhase(OnboardingPhase.CREATE_WALLET);
          }}
        >
          <Typography size={14} weight={600}>
            Create a new wallet
          </Typography>
        </PrimaryButton>

        <SecondaryButton
          margin="24px 0"
          size={ComponentSize.LARGE}
          onClick={() => {
            setNextPhase(OnboardingPhase.IMPORT_WALLET);
          }}
        >
          <Typography size={14} weight={600}>
            I already have a wallet
          </Typography>
        </SecondaryButton>

        <TextButton as="a" margin="24px 0">
          Terms
        </TextButton>
      </VerticalFlex>
    </VerticalFlex>
  );
}
