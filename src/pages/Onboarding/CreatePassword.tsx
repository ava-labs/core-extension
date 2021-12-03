import React, { useState } from 'react';
import {
  VerticalFlex,
  Input,
  PrimaryButton,
  Typography,
  TextButton,
  HorizontalFlex,
  ComponentSize,
  CloseIcon,
  IconDirection,
  CaretIcon,
} from '@avalabs/react-components';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { useTheme } from 'styled-components';
import {
  PasswordStrength,
  getPasswordErrorMessage,
} from '@src/components/common/PasswordStrength';
interface CreatePasswordProps {
  onCancel(): void;
  onBack(): void;
  isImportFlow: boolean;
}

export const CreatePassword = ({
  onCancel,
  onBack,
  isImportFlow,
}: CreatePasswordProps) => {
  const theme = useTheme();
  const { setPasswordAndName } = useOnboardingContext();
  const [accountName, setAccountName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [confirmPasswordVal, setConfirmPasswordVal] = useState('');

  const isFieldsFilled = !!(password && confirmPasswordVal);
  const considerStrength = !isImportFlow;
  const error = getPasswordErrorMessage(
    isFieldsFilled,
    password,
    confirmPasswordVal,
    passwordStrength,
    considerStrength
  );

  const canSubmit = !error && isFieldsFilled;

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
        <VerticalFlex height={isImportFlow ? '100px' : 'auto'}>
          <Input
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            error={!!error}
          />
          {considerStrength && (
            <PasswordStrength
              password={password}
              setPasswordStrength={setPasswordStrength}
            />
          )}
        </VerticalFlex>
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
            setPasswordAndName(password, accountName, isImportFlow);
          }}
        >
          Save
        </PrimaryButton>
      </VerticalFlex>
    </VerticalFlex>
  );
};
