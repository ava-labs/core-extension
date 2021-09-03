import React, { useState } from 'react';
import {
  VerticalFlex,
  Input,
  PrimaryButton,
  Typography,
  ProgressIndicator,
  TextButton,
  HorizontalFlex,
} from '@avalabs/react-components';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';

function verifyPasswordsMatch(pass1?: string, pass2?: string) {
  return !!(pass1 && pass2 && pass1 === pass2);
}

const PASSWORD_ERROR = 'Passwords do not match';

export const CreatePassword = ({ onCancel }: { onCancel(): void }) => {
  const { setPassword } = useOnboardingContext();
  const [passwordVal, setPasswordVal] = useState('');
  const [confirmPasswordVal, setConfirmPasswordVal] = useState('');

  const fieldsFilled = passwordVal && confirmPasswordVal;
  
  let error;
  if(fieldsFilled && !verifyPasswordsMatch(passwordVal, confirmPasswordVal)) {
    error = PASSWORD_ERROR;
  }

  const canSubmit = !error && fieldsFilled;
  
  return (
    <VerticalFlex width="100%" align='center' padding='22px 0 36px' justify="space-between">
      <VerticalFlex align='center'>
        <ProgressIndicator steps={3} current={3} /> 
        <Typography as="h1" size={24} weight="bold" margin="28px 0 8px">Create password</Typography>
        <Typography align="center" margin="0 0 32px" height="24px">
          Create a password to secure<br/>
          your account
        </Typography>    
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
            placeholder="Confirm Password"
            type="password"
            error={!!error}
            errorMessage={error}
          />
        </HorizontalFlex>
      </VerticalFlex>
      <VerticalFlex align='center'>
        <PrimaryButton
          margin="24px 0"
          disabled={!canSubmit}
          onClick={() => {
            setPassword(passwordVal);
          }}
        >
          Save password
        </PrimaryButton>
        <TextButton onClick={() => onCancel && onCancel()}>
          Back
        </TextButton>
      </VerticalFlex>
    </VerticalFlex>
  );
};
