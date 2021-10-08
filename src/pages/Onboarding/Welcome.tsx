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
import styled from 'styled-components';

const IllustrationPlaceholder = styled(VerticalFlex)`
  width: 240px;
  height: 240px;
  border-radius: 50%;
  margin: 77px 0;
  background: ${({ theme }) => theme.palette?.grey[800]};
  justify-content: center;
  align-items: center;
`;

export function Welcome() {
  const { setNextPhase } = useOnboardingContext();

  return (
    <VerticalFlex
      width="100%"
      align="center"
      padding="72px 0 22px"
      justify="space-between"
    >
      <VerticalFlex align="center">
        <Typography as="h1" size={24} weight="bold">
          Welcome!
        </Typography>
        <IllustrationPlaceholder>
          <Typography>Illustration</Typography>
        </IllustrationPlaceholder>
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
