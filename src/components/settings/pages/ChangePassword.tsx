import React, { useState } from 'react';
import {
  Input,
  VerticalFlex,
  ComponentSize,
  Typography,
  PrimaryButton,
  HorizontalFlex,
} from '@avalabs/react-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import { useWalletContext } from '@src/contexts/WalletProvider';

function verifyPasswordsMatch(pass1?: string, pass2?: string) {
  return !!(pass1 === pass2);
}

const PASSWORD_ERROR = 'Passwords do not match';

export function ChangePassword({ goBack, navigateTo }: SettingsPageProps) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { changeWalletPassword } = useWalletContext();

  const fieldsFilled = oldPassword && newPassword && confirmPassword;

  let error;
  if (fieldsFilled && !verifyPasswordsMatch(newPassword, confirmPassword)) {
    error = PASSWORD_ERROR;
  }

  const canSubmit = !error && fieldsFilled;

  const handleChangePassword = () => {
    // do the magic
    // check new password & confrim match
    // sucess -> show success?
    // error -> show error?
    changeWalletPassword(oldPassword, newPassword)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <VerticalFlex width="375px" padding="12px 0">
      <SettingsHeader
        goBack={goBack}
        navigateTo={navigateTo}
        title={'Change Password'}
      />
      <VerticalFlex align="center" padding="12px 0">
        <HorizontalFlex height="100px">
          <Input
            onChange={(e) => {
              setOldPassword(e.target.value);
            }}
            value={oldPassword}
            placeholder="old password"
            type="password"
          />
        </HorizontalFlex>
        <HorizontalFlex height="100px">
          <Input
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
            value={newPassword}
            placeholder="new password"
            type="password"
            error={!!error}
          />
        </HorizontalFlex>
        <HorizontalFlex height="100px">
          <Input
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            value={confirmPassword}
            placeholder="confirm password"
            type="password"
            error={!!error}
            errorMessage={error}
          />
        </HorizontalFlex>
      </VerticalFlex>
      <VerticalFlex align="center">
        <PrimaryButton
          size={ComponentSize.LARGE}
          onClick={handleChangePassword}
          margin="0 0 24px"
          disabled={!canSubmit}
        >
          <Typography size={14} color="inherit">
            Change Password
          </Typography>
        </PrimaryButton>
      </VerticalFlex>
    </VerticalFlex>
  );
}
