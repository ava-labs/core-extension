import { useState, useEffect } from 'react';
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
import {
  PasswordStrength,
  getPasswordErrorMessage,
} from '@src/components/common/PasswordStrength';
import { t } from 'i18next';

export function ChangePassword({
  goBack,
  navigateTo,
  width,
}: SettingsPageProps) {
  const theme = useTheme();
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newPasswordStrength, setNewPasswordStrength] = useState<number>(0);
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [serverResponse, setServerResponse] = useState<string>('');
  const [serverError, setServerError] = useState<string>('');

  const SERVER_SUCCESS = t('Your password has been changed succesfully.');
  const SERVER_ERROR = t('Something went wrong.');

  useEffect(() => {
    setServerError('');
  }, [oldPassword, newPassword, confirmPassword]);

  const { changeWalletPassword } = useWalletContext();

  const isFieldsFilled = !!(oldPassword && newPassword && confirmPassword);

  const error = getPasswordErrorMessage(
    isFieldsFilled,
    newPassword,
    confirmPassword,
    newPasswordStrength
  );

  const canSubmit = !error && isFieldsFilled;

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
    <VerticalFlex width={width} background={theme.colors.bg2} height="100%">
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={t('Change Password')}
      />
      {!serverResponse ? (
        <>
          <VerticalFlex align="center" padding="16px 16px 0">
            <HorizontalFlex height="88px" width="100%">
              <Input
                data-testid="old-password-input"
                onChange={(e) => {
                  setOldPassword(e.target.value);
                }}
                value={oldPassword}
                label={t('Old Password')}
                placeholder={t('Old password')}
                type="password"
                error={!!serverError}
                errorMessage={serverError}
                width="100%"
              />
            </HorizontalFlex>
            <VerticalFlex width="100%">
              <Input
                data-testid="new-password-input"
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
                value={newPassword}
                label={t('Create New Password')}
                placeholder={t('New Password')}
                type="password"
                error={!!error}
                width="100%"
              />
              <PasswordStrength
                password={newPassword}
                setPasswordStrength={setNewPasswordStrength}
              />
            </VerticalFlex>
            <HorizontalFlex margin="16px 0 0" height="88px" width="100%">
              <Input
                data-testid="confirm-new-password-input"
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                label={t('Confirm New Password')}
                value={confirmPassword}
                placeholder={t('Confirm Password')}
                type="password"
                error={!!error}
                errorMessage={error}
                width="100%"
              />
            </HorizontalFlex>
            <Typography size={12} height="15px" padding="0 16px" align="center">
              {t(
                'Avoid using a password that you use with other websites or that might be easy for someone to guess.'
              )}
            </Typography>
          </VerticalFlex>
          <VerticalFlex
            align="center"
            grow="1"
            justify="flex-end"
            margin="16px 16px 24px"
          >
            <PrimaryButton
              data-testid="save-password-button"
              width="100%"
              size={ComponentSize.LARGE}
              onClick={handleChangePassword}
              disabled={!canSubmit}
            >
              {t('Save')}
            </PrimaryButton>
          </VerticalFlex>
        </>
      ) : (
        <VerticalFlex width="100%" align="center" grow="1" padding="16px">
          <Typography size={14} height="17px" align="center">
            {serverResponse}
          </Typography>
        </VerticalFlex>
      )}
    </VerticalFlex>
  );
}
