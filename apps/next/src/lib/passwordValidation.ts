import { MIN_PASSWORD_LENGTH } from '@/pages/Settings/constants';
import type { TFunction } from 'i18next';
import zxcvbn from 'zxcvbn';

export type PasswordValidationType =
  | 'length-error'
  | 'weak-password'
  | 'average-password'
  | 'strong-password'
  | 'password-mismatch'
  | 'password-match';

export type PasswordValidationResult = {
  isValid: boolean;
  colorKey: string;
  message: string;
  type: PasswordValidationType;
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
      type: 'weak-password' as const,
    };
  }

  if (score < 3) {
    return {
      isValid: true,
      colorKey: 'warning.dark',
      message: t('Average password - this will do'),
      type: 'average-password' as const,
    };
  }

  return {
    isValid: true,
    colorKey: 'success.main',
    message: t('Strong password! Keep this one!'),
    type: 'strong-password' as const,
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
      type: 'password-mismatch' as const,
    };
  }

  return {
    isValid: true,
    colorKey: 'success.main',
    message: t('Awesome!'),
    type: 'password-match' as const,
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
      type: 'length-error' as const,
    };
  }

  const strength = validatePasswordStrength(password, t);

  if (!strength.isValid || !isPasswordTouched) {
    return strength;
  }

  if (!isConfirmPasswordTouched || !confirmPassword) {
    return {
      ...strength,
      isValid: false,
    };
  }

  return validatePasswordMatch(password, confirmPassword, t);
};
