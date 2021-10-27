import React, { useState, useEffect } from 'react';
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
import { useTheme } from 'styled-components';

const PASSWORD_ERROR = 'Passwords do not match';
const SERVER_SUCCESS = 'Your password has been changed succesfully.';
const SERVER_ERROR = 'Something went wrong.';

function verifyPasswordsMatch(pass1?: string, pass2?: string) {
  return !!(pass1 === pass2);
}

export function ChangePassword({ goBack, navigateTo }: SettingsPageProps) {
  const theme = useTheme();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [serverResponse, setServerResponse] = useState('');
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    setServerError('');
  }, [oldPassword, newPassword, confirmPassword]);

  const { changeWalletPassword } = useWalletContext();

  const fieldsFilled = oldPassword && newPassword && confirmPassword;

  let error;
  if (fieldsFilled && !verifyPasswordsMatch(newPassword, confirmPassword)) {
    error = PASSWORD_ERROR;
  }

  const canSubmit = !error && fieldsFilled;

  const resetInputFields = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleChangePassword = () => {
    changeWalletPassword(newPassword, oldPassword)
      .then((res) => {
        resetInputFields();
        setServerResponse(res ? SERVER_SUCCESS : SERVER_ERROR);
      })
      .catch((err) => {
        setServerError(err);
      });
  };

  return (
    <VerticalFlex width="375px" background={theme.colors.bg2} height="100%">
      <SettingsHeader
        goBack={goBack}
        navigateTo={navigateTo}
        title={'Change Password'}
      />
      {!serverResponse ? (
        <>
          <VerticalFlex align="center" padding="16px 0">
            <HorizontalFlex height="100px">
              <Input
                onChange={(e) => {
                  setOldPassword(e.target.value);
                }}
                value={oldPassword}
                label="Old Password"
                placeholder="Old password"
                type="password"
                error={!!serverError}
                errorMessage={serverError}
              />
            </HorizontalFlex>
            <HorizontalFlex height="100px">
              <Input
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
                value={newPassword}
                label="Create New Password"
                placeholder="New Password"
                type="password"
                error={!!error}
              />
            </HorizontalFlex>
            <HorizontalFlex height="100px">
              <Input
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                label="Confirm New Password"
                value={confirmPassword}
                placeholder="Confirm Password"
                type="password"
                error={!!error}
                errorMessage={error}
              />
            </HorizontalFlex>
            <Typography size={12} height="15px" padding="0 16px" align="center">
              Avoid using a password that you use with other websites or that
              might be easy for someone to guess.
            </Typography>
          </VerticalFlex>
          <VerticalFlex
            align="center"
            grow="1"
            justify="flex-end"
            margin="16px 0"
          >
            <PrimaryButton
              size={ComponentSize.LARGE}
              onClick={handleChangePassword}
              margin="0 0 24px"
              disabled={!canSubmit}
            >
              Save
            </PrimaryButton>
          </VerticalFlex>
        </>
      ) : (
        <VerticalFlex width="100%" align="center" grow="1" padding="24px">
          <Typography height="24px" align="center">
            {serverResponse}
          </Typography>
        </VerticalFlex>
      )}
    </VerticalFlex>
  );
}
