import zxcvbn from 'zxcvbn';
import type { TFunction } from 'i18next';

type PasswordValidationResult = {
  isValid: boolean;
  colorKey: string;
  message: string;
};

const validatePasswordStrength = (
  password: string,
  t: TFunction,
): PasswordValidationResult => {
  const { score } = zxcvbn(password);

  if (score < 2) {
    return {
      isValid: false,
      colorKey: 'error.light',
      message: t('Weak password! Try adding more characters'),
    };
  }

  if (score < 3) {
    return {
      isValid: true,
      colorKey: 'warning.light',
      message: t('Average password - this will do'),
    };
  }

  return {
    isValid: true,
    colorKey: 'green.light',
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
      colorKey: 'error.light',
      message: t('Passwords do not match'),
    };
  }

  return {
    isValid: true,
    colorKey: 'green.light',
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

  const strength = validatePasswordStrength(password || confirmPassword, t);

  if (!strength.isValid || !isPasswordTouched || !isConfirmPasswordTouched) {
    return strength;
  }

  return validatePasswordMatch(password, confirmPassword, t);
};
