import {
  Button,
  StackProps,
  styled,
  TextFieldProps,
  Typography,
} from '@avalabs/k2-alpine';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Page } from '@/components/Page';
import { LessRoundedPasswordField as PasswordField } from '@/components/StandaloneField';
import { useSubmitButton } from '@/hooks/useSubmitButton';
import { MIN_PASSWORD_LENGTH } from '@/pages/Settings/constants';
import { useChangePassword } from './hooks/useChangePassword';
import { useValidate } from './hooks/useValidate';

const contentProps: StackProps = {
  pt: 1,
  gap: 4,
  alignItems: undefined,
  justifyContent: undefined,
};

const passwordSlotProps: TextFieldProps['slotProps'] = {
  formHelperText: {
    sx: {
      position: 'absolute',
      top: '100%',
    },
  },
};

export const ChangePassword: FC = () => {
  const { t } = useTranslation();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitRef, shortcuts] = useSubmitButton();

  const {
    validateForm,
    errors: formErrors,
    isFormValid,
    passwordStrength,
    getFieldRef,
  } = useValidate();
  const {
    handleSubmit,
    isSubmitting,
    errors: submitErrors,
  } = useChangePassword(currentPassword, newPassword);

  useEffect(() => {
    validateForm(currentPassword, newPassword, confirmPassword);
  }, [currentPassword, newPassword, confirmPassword, validateForm]);

  const errors = { ...formErrors, ...submitErrors };

  return (
    <Page
      title={t('Change password')}
      withBackButton
      contentProps={contentProps}
      {...shortcuts}
    >
      <PasswordField
        ref={getFieldRef('currentPassword')}
        placeholder={t('Current password')}
        value={currentPassword}
        onChange={(e) => {
          setCurrentPassword(e.target.value);
        }}
        error={!!errors.currentPassword}
        helperText={errors.currentPassword}
        slotProps={passwordSlotProps}
        fullWidth
        autoFocus
      />

      <PasswordField
        ref={getFieldRef('newPassword')}
        placeholder={t('New password')}
        value={newPassword}
        onChange={(e) => {
          setNewPassword(e.target.value);
        }}
        error={
          !!formErrors.newPassword ||
          (passwordStrength && !passwordStrength.isValid)
        }
        helperText={
          formErrors.newPassword ||
          (passwordStrength
            ? passwordStrength.message
            : t('Password must be at least {{min}} characters', {
                min: MIN_PASSWORD_LENGTH,
              }))
        }
        fullWidth
        slotProps={{
          formHelperText: {
            sx: {
              position: 'absolute',
              top: '100%',
              color:
                !errors.newPassword && passwordStrength
                  ? passwordStrength.colorKey
                  : undefined,
            },
          },
        }}
      />

      <PasswordField
        ref={getFieldRef('confirmPassword')}
        placeholder={t('Confirm new password')}
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
        }}
        error={!!formErrors.confirmPassword}
        helperText={formErrors.confirmPassword}
        fullWidth
        slotProps={passwordSlotProps}
      />

      {submitErrors.general && (
        <Typography variant="body2" color="error.main" px={2}>
          {submitErrors.general}
        </Typography>
      )}

      <BottomButton
        ref={submitRef}
        variant="contained"
        color="primary"
        size="extension"
        fullWidth
        disabled={!isFormValid || isSubmitting}
        loading={isSubmitting}
        onClick={isFormValid ? handleSubmit : undefined}
      >
        {t('Save')}
      </BottomButton>
    </Page>
  );
};

const BottomButton = styled(Button)({
  marginTop: 'auto',
});
