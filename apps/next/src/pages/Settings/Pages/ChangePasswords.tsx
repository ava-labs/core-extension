import { Button, Stack, toast, Typography } from '@avalabs/k2-alpine';
import { FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { Page } from '@/components/Page/Page';
import { PasswordField } from '@/components/StandaloneField/PasswordField/PasswordField';
import { useWalletContext } from '@core/ui';

const MIN_PASSWORD_LENGTH = 8;

export const ChangePasswords: FC = () => {
  const { t } = useTranslation();
  const { goBack } = useHistory();
  const { changeWalletPassword } = useWalletContext();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    general: '',
  });

  const validateForm = useCallback(() => {
    const newErrors = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      general: '',
    };

    if (!oldPassword.trim()) {
      newErrors.oldPassword = t('Old password is required');
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = t('New password is required');
    } else if (newPassword.length < MIN_PASSWORD_LENGTH) {
      newErrors.newPassword = t('Password must be at least 8 characters');
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = t('Please confirm your new password');
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = t('Passwords do not match');
    }

    if (oldPassword === newPassword && oldPassword.trim()) {
      newErrors.newPassword = t(
        'New password must be different from old password',
      );
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  }, [oldPassword, newPassword, confirmPassword, t]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors((prev) => ({ ...prev, general: '' }));

    try {
      const success = await changeWalletPassword(newPassword, oldPassword);

      if (success) {
        toast.success(t('Password changed successfully'));
        goBack();
      } else {
        setErrors((prev) => ({
          ...prev,
          general: t('Failed to change password'),
        }));
      }
    } catch (error) {
      console.error('Password change error:', error);
      setErrors((prev) => ({
        ...prev,
        oldPassword: t('Current password is incorrect'),
        general: '',
      }));
    } finally {
      setIsLoading(false);
    }
  }, [changeWalletPassword, newPassword, oldPassword, validateForm, t, goBack]);

  const isFormValid =
    oldPassword.trim() &&
    newPassword.trim() &&
    confirmPassword.trim() &&
    newPassword.length >= MIN_PASSWORD_LENGTH &&
    newPassword === confirmPassword &&
    oldPassword !== newPassword;

  return (
    <Page withBackButton>
      <Stack
        gap={4}
        width="100%"
        height="100%"
        px={2}
        pt={2}
        justifyContent="space-between"
      >
        <Stack gap={3} width="100%">
          <Typography variant="h3" color="text.primary">
            {t('Change password')}
          </Typography>

          <Stack gap={2} width="100%">
            <PasswordField
              placeholder={t('Old password')}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              error={!!errors.oldPassword}
              helperText={errors.oldPassword}
              fullWidth
            />

            <Stack gap={0.5} width="100%">
              <PasswordField
                placeholder={t('New password')}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                error={!!errors.newPassword}
                helperText={errors.newPassword}
                fullWidth
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ px: 2 }}
              >
                {t('Password must be at least 8 characters')}
              </Typography>
            </Stack>

            <PasswordField
              placeholder={t('Confirm new password')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              fullWidth
            />
          </Stack>

          {errors.general && (
            <Typography variant="body2" color="error.main" sx={{ px: 2 }}>
              {errors.general}
            </Typography>
          )}
        </Stack>

        <Stack width="100%" pb={2}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={!isFormValid || isLoading}
            loading={isLoading}
            onClick={handleSubmit}
          >
            {t('Save')}
          </Button>
        </Stack>
      </Stack>
    </Page>
  );
};
