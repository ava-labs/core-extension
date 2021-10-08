import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  VerticalFlex,
  Typography,
  PrimaryButton,
  SecondaryButton,
  TextButton,
} from '@avalabs/react-components';
import { createNewMnemonic } from '@src/background/services/wallet/utils/createMnemonicPhrase';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { OnboardingPhase } from '@src/background/services/onboarding/models';
import styled from 'styled-components';

const IllustrationPlaceholder = styled(VerticalFlex)`
  width: 240px;
  height: 240px;
  border-radius: 50%;
  margin: 77px 0 0;
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
          margin="24px 0"
          onClick={() => {
            setNextPhase(OnboardingPhase.CREATE_WALLET);
          }}
        >
          Create a new wallet
        </PrimaryButton>

        <SecondaryButton
          onClick={() => {
            setNextPhase(OnboardingPhase.IMPORT_WALLET);
          }}
        >
          I already have a wallet
        </SecondaryButton>

        <TextButton
          as="a"
          margin="24px 0"
          onClick={() => {
            setNextPhase(OnboardingPhase.IMPORT_WALLET);
          }}
        >
          Terms
        </TextButton>
      </VerticalFlex>
    </VerticalFlex>
  );
}
