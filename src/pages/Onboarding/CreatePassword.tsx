import React, { useState } from 'react';
import {
  VerticalFlex,
  Input,
  PrimaryButton,
  Typography,
  TextButton,
  HorizontalFlex,
  ComponentSize,
  CaretIcon,
  CloseIcon,
  IconDirection,
} from '@avalabs/react-components';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { useTheme } from 'styled-components';
interface CreatePasswordProps {
  onCancel(): void;
  onBack(): void;
  isImportFlow: boolean;
}

function verifyPasswordsMatch(pass1?: string, pass2?: string) {
  return !!(pass1 && pass2 && pass1 === pass2);
}

const PASSWORD_ERROR = 'Passwords do not match';

export const CreatePassword = ({
  onCancel,
  onBack,
  isImportFlow,
}: CreatePasswordProps) => {
  const theme = useTheme();
  const { setPasswordAndName } = useOnboardingContext();
  const [accountName, setAccountName] = useState('');
  const [passwordVal, setPasswordVal] = useState('');
  const [confirmPasswordVal, setConfirmPasswordVal] = useState('');

  const fieldsFilled = passwordVal && confirmPasswordVal;

  let error;
  if (fieldsFilled && !verifyPasswordsMatch(passwordVal, confirmPasswordVal)) {
    error = PASSWORD_ERROR;
  }

  const canSubmit = !error && fieldsFilled;

  return (
    <VerticalFlex width="100%" align="center" padding="16px 0">
      <HorizontalFlex width="100%" justify="space-between" align="center">
        <TextButton onClick={onBack}>
          <CaretIcon
            direction={IconDirection.LEFT}
            height="18px"
            color={theme.colors.icon1}
          />
        </TextButton>
        <Typography as="h1" size={24} weight={700} height="29px">
          Create a Name and Password
        </Typography>
        <TextButton onClick={onCancel}>
          <CloseIcon height="18px" color={theme.colors.icon1} />
        </TextButton>
      </HorizontalFlex>
      <VerticalFlex align="center" grow="1">
        <Typography align="center" margin="8px 0 40px" height="24px">
          Add a name and a secure password
          <br />
          to your new wallet.
        </Typography>
        <HorizontalFlex height="100px">
          <Input
            label="Wallet Name"
            onChange={(e) => setAccountName(e.target.value)}
            placeholder="Account 1"
            error={!!error}
          />
        </HorizontalFlex>
        <HorizontalFlex height="100px">
          <Input
            label="Password"
            onChange={(e) => setPasswordVal(e.target.value)}
            placeholder="Password"
            type="password"
            error={!!error}
          />
        </HorizontalFlex>
        <HorizontalFlex height="100px">
          <Input
            label="Confirm Password"
            onChange={(e) => setConfirmPasswordVal(e.target.value)}
            placeholder="Password"
            type="password"
            error={!!error}
            errorMessage={error}
          />
        </HorizontalFlex>
      </VerticalFlex>
      <VerticalFlex align="center" margin="0 0 40px">
        <PrimaryButton
          size={ComponentSize.LARGE}
          disabled={!canSubmit}
          onClick={() => {
            setPasswordAndName(passwordVal, accountName, isImportFlow);
          }}
        >
          Save
        </PrimaryButton>
      </VerticalFlex>
    </VerticalFlex>
  );
};
