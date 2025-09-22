import { MIN_PASSWORD_LENGTH } from '@/pages/Settings/constants';
import type { TFunction } from 'i18next';
import zxcvbn from 'zxcvbn';

export type PasswordValidationResult = {
  isValid: boolean;
  colorKey: string;
  message: string;
};

export const validatePasswordStrength = (
  password: string,
  t: TFunction,
): PasswordValidationResult => {
  const { score } = zxcvbn(password);

  if (score < 2) {
    return {
      isValid: false,
      colorKey: 'error.main',
      message: t('Weak password! Try adding more characters'),
    };
  }

  if (score < 3) {
    return {
      isValid: true,
      colorKey: 'warning.dark',
      message: t('Average password - this will do'),
    };
  }

  return {
    isValid: true,
    colorKey: 'success.main',
    message: t('Strong password! Keep this one!'),
  };
};

const validatePasswordMatch = (
  password: string,
  confirmPassword: string,
  t: TFunction,
): PasswordValidationResult => {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      colorKey: 'error.main',
      message: t('Passwords do not match'),
    };
  }

  return {
    isValid: true,
    colorKey: 'success.main',
    message: t('Awesome!'),
  };
};

type ValidatePasswordArgs = {
  password: string;
  confirmPassword: string;
  isPasswordTouched: boolean;
  isConfirmPasswordTouched: boolean;
  t: TFunction;
};

export const validatePasswords = ({
  password,
  confirmPassword,
  isPasswordTouched,
  isConfirmPasswordTouched,
  t,
}: ValidatePasswordArgs): PasswordValidationResult | null => {
  // If no values are provided, we show no messages
  if (!password && !confirmPassword) {
    return null;
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      isValid: false,
      colorKey: 'error.main',
      message: t('Password must be at least {{min}} characters', {
        min: MIN_PASSWORD_LENGTH,
      }),
    };
  }

  const strength = validatePasswordStrength(password || confirmPassword, t);

  if (!strength.isValid || !isPasswordTouched || !isConfirmPasswordTouched) {
    return strength;
  }

  return validatePasswordMatch(password, confirmPassword, t);
};
