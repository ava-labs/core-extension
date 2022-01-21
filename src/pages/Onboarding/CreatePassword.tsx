import { useState } from 'react';
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
import { OnboardingPhase } from '@src/background/services/onboarding/models';
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
  const { setPasswordAndName, setNextPhase } = useOnboardingContext();
  const [accountName, setAccountName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPasswordVal, setConfirmPasswordVal] = useState<string>('');

  const isFieldsFilled = !!(password && confirmPasswordVal);
  const confirmationError = !!(
    password &&
    confirmPasswordVal &&
    password !== confirmPasswordVal
  );
  const passwordLengthError = password && password.length < 8;
  const canSubmit =
    !passwordLengthError && !confirmationError && isFieldsFilled;

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
          For your security, please create a new
          <br />
          name and password.
        </Typography>
        <HorizontalFlex height="100px">
          <Input
            label="Wallet Name"
            onChange={(e) => setAccountName(e.target.value)}
            placeholder="Placeholder"
            autoFocus
          />
        </HorizontalFlex>
        <VerticalFlex height={'120px'}>
          <Input
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            error={!!passwordLengthError}
          />
          <Typography
            margin="4px 0 0 0"
            color={
              passwordLengthError ? theme.colors.error : theme.colors.text2
            }
            size={14}
            height="17px"
          >
            Must be at least 8 characters
          </Typography>
        </VerticalFlex>
        <HorizontalFlex height="100px">
          <Input
            label="Confirm Password"
            onChange={(e) => setConfirmPasswordVal(e.target.value)}
            placeholder="Password"
            type="password"
            error={confirmationError}
            errorMessage={
              confirmationError ? 'Passwords do not match' : undefined
            }
          />
        </HorizontalFlex>
      </VerticalFlex>
      <VerticalFlex align="center" margin="0 0 40px">
        <PrimaryButton
          size={ComponentSize.LARGE}
          disabled={!canSubmit}
          onClick={() => {
            setPasswordAndName(password, accountName).then(() =>
              setNextPhase(
                isImportFlow
                  ? OnboardingPhase.FINALIZE
                  : OnboardingPhase.CREATE_WALLET
              )
            );
          }}
        >
          Save
        </PrimaryButton>
      </VerticalFlex>
    </VerticalFlex>
  );
};
