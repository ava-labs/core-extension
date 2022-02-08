import { useState } from 'react';
import {
  VerticalFlex,
  Input,
  PrimaryButton,
  Typography,
  ComponentSize,
} from '@avalabs/react-components';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { OnboardingPhase } from '@src/background/services/onboarding/models';
import { OnboardingStepHeader } from './components/OnboardingStepHeader';
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
    <VerticalFlex width="100%" align="center">
      <OnboardingStepHeader
        title="Create a Name and Password"
        onBack={onBack}
        onClose={onCancel}
      />
      <VerticalFlex align="center" grow="1">
        <Typography align="center" margin="8px 0 0" size={14} height="17px">
          For your security, please create a new name
          <br />
          and password.
        </Typography>
        <Input
          margin="32px 0 0"
          label="Wallet Name"
          onChange={(e) => setAccountName(e.target.value)}
          placeholder="Enter a Name"
          autoFocus
        />
        <Input
          margin="24px 0"
          label="Password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter a Password"
          type="password"
          error={!!passwordLengthError}
          helperText="Must be at least 8 characters"
        />
        <Input
          label="Confirm Password"
          onChange={(e) => setConfirmPasswordVal(e.target.value)}
          placeholder="Enter a Password"
          type="password"
          error={confirmationError}
          errorMessage={
            confirmationError ? 'Passwords do not match' : undefined
          }
        />
      </VerticalFlex>
      <PrimaryButton
        size={ComponentSize.LARGE}
        width="343px"
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
  );
};
