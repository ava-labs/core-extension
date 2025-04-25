import { useState, useEffect } from 'react';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import { useWalletContext } from '@/contexts/WalletProvider';
import {
  PasswordStrength,
  getPasswordErrorMessage,
} from '@/components/common/PasswordStrength';
import { useTranslation } from 'react-i18next';
import {
  Stack,
  TextField,
  Typography,
  Button,
  AlertTriangleIcon,
} from '@avalabs/core-k2-components';
import { useAnalyticsContext } from '@/contexts/AnalyticsProvider';

export function ChangePassword({
  goBack,
  navigateTo,
  width,
}: SettingsPageProps) {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
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
    newPasswordStrength,
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
        capture('ChangePasswordSucceeded');
      })
      .catch((err) => {
        setServerError(err);
        capture('ChangePasswordFailed');
      });
  };

  return (
    <Stack
      sx={{
        width: `${width}`,
        height: '100%',
      }}
    >
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={t('Change Password')}
      />

      {!serverResponse ? (
        <>
          <Stack
            sx={{
              mx: 2,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <AlertTriangleIcon sx={{ color: 'warning.main', fontSize: 24 }} />
            <Typography variant="body2" sx={{ ml: 2 }}>
              {t(
                'Avoid using a password that you use with other websites or that might be easy for someone to guess.',
              )}
            </Typography>
          </Stack>
          <Stack sx={{ pt: 3, px: 2 }}>
            <TextField
              data-testid="old-password-input"
              type="password"
              label={t('Old Password')}
              onChange={(e) => {
                setOldPassword(e.target.value);
              }}
              placeholder={t('Old password')}
              error={!!serverError}
              helperText={serverError}
              size="small"
              fullWidth
              sx={{
                mb: 4,
              }}
            />
            <Stack sx={{ mb: 0.25 }}>
              <TextField
                data-testid="new-password-input"
                type="password"
                label={t('Create New Password')}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
                placeholder={t('New Password')}
                error={!!error}
                size="small"
                fullWidth
              />
            </Stack>
            <PasswordStrength
              password={newPassword}
              setPasswordStrength={setNewPasswordStrength}
            />
            <Stack sx={{ mt: 1.5 }}>
              <TextField
                data-testid="confirm-new-password-input"
                type="password"
                label={t('Confirm New Password')}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                placeholder={t('Confirm Password')}
                error={!!error}
                helperText={error}
                size="small"
                fullWidth
              />
            </Stack>
          </Stack>

          <Stack
            sx={{
              justifyContent: 'flex-end',
              flexGrow: '1',
              mt: 2,
              my: 2,
              mb: 3,
              px: 2,
            }}
          >
            <Button
              data-testid="save-password-button"
              variant="contained"
              color="secondary"
              fullWidth
              onClick={handleChangePassword}
              disabled={!canSubmit}
            >
              {t('Save')}
            </Button>
          </Stack>
        </>
      ) : (
        <Stack sx={{ alignItems: 'center', flexGrow: '1', p: 2 }}>
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            {serverResponse}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}
