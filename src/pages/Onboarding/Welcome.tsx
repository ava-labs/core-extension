import React from 'react';
import {
  VerticalFlex,
  Typography,
  PrimaryButton,
  SecondaryButton,
  TextButton,
  ComponentSize,
} from '@avalabs/react-components';
import { LoginIllustration } from '@src/components/common/LoginIllustation';

interface WelcomeProps {
  onNext: (isImportFlow: boolean) => void;
}

export function Welcome({ onNext }: WelcomeProps) {
  return (
    <VerticalFlex
      width="100%"
      align="center"
      padding="16px 0"
      justify="space-between"
    >
      <Typography as="h1" size={24} height="29px" weight={700}>
        Welcome to Avalanche!
      </Typography>
      <VerticalFlex justify="center" grow="1">
        <LoginIllustration size={182} variant="secondary" />
      </VerticalFlex>
      <VerticalFlex align="center">
        <PrimaryButton
          size={ComponentSize.LARGE}
          onClick={() => {
            onNext(false);
          }}
        >
          Create new wallet
        </PrimaryButton>

        <SecondaryButton
          margin="16px 0"
          size={ComponentSize.LARGE}
          onClick={() => {
            onNext(true);
          }}
        >
          Access existing wallet
        </SecondaryButton>

        <TextButton as="a" margin="18px 0 0">
          Terms and Conditions
        </TextButton>
      </VerticalFlex>
    </VerticalFlex>
  );
}
