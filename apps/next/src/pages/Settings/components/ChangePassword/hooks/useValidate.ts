import { useFormFieldTouched } from '@/hooks/useFormFieldTouched';
import {
  PasswordValidationResult,
  validatePasswordStrength,
} from '@/lib/passwordValidation';
import { MIN_PASSWORD_LENGTH } from '@/pages/Settings/constants';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

type PasswordForm = Partial<{
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}>;

const INITIAL_ERRORS: PasswordForm = {};

export function useValidate() {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<PasswordForm>(INITIAL_ERRORS);
  const [isFormValid, setIsFormValid] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<
    PasswordValidationResult | undefined
  >(undefined);
  const { isTouched, getFieldRef } = useFormFieldTouched<keyof PasswordForm>();

  const validateForm = useCallback(
    (
      currentPassword: string,
      newPassword: string,
      confirmedPassword: string,
    ) => {
      let hasError = false;
      const newErrors = new Proxy<PasswordForm>(
        {},
        {
          set(target, prop, value) {
            hasError = true;
            return (target[prop] = value);
          },
        },
      );

      if (isTouched('currentPassword')) {
        if (!currentPassword.trim()) {
          newErrors.currentPassword = t('The field is required');
        }
      }

      if (isTouched('newPassword')) {
        if (!newPassword || newPassword.length < MIN_PASSWORD_LENGTH) {
          newErrors.newPassword = t(
            'Password must be at least {{min}} characters',
            {
              min: MIN_PASSWORD_LENGTH,
            },
          );
        } else if (currentPassword && currentPassword === newPassword) {
          newErrors.newPassword = t(
            'New password must be different from current one',
          );
        }
      }

      if (isTouched('confirmPassword')) {
        if (!confirmedPassword) {
          newErrors.confirmPassword = t('The field is required');
        } else if (newPassword !== confirmedPassword) {
          newErrors.confirmPassword = t('Passwords do not match');
        }
      }

      const strength = isTouched('newPassword')
        ? validatePasswordStrength(newPassword, t)
        : undefined;
      const result = Boolean(
        currentPassword &&
          newPassword &&
          confirmedPassword &&
          !hasError &&
          strength?.isValid,
      );

      setErrors(newErrors);
      setIsFormValid(result);
      setPasswordStrength(strength);

      return result;
    },
    [t, isTouched],
  );

  return { validateForm, errors, isFormValid, passwordStrength, getFieldRef };
}
