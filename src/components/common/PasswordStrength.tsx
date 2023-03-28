import { lazy } from 'react';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useTheme, darkTheme } from '@avalabs/k2-components';

const PasswordStrengthBar = lazy(() => import('react-password-strength-bar'));

const REQUIRED_PASSWORD_STRENTGH = 2; // can be 0-4

const verifyPasswordsMatch = (pass1?: string, pass2?: string) => {
  const isVerified = !!(pass1 && pass2 && pass1 === pass2);
  return isVerified;
};

export const getPasswordErrorMessage = (
  isFieldsFilled: boolean,
  newPassword: string,
  confirmPassword: string,
  passwordStrength: number,
  considerStrength = true
) => {
  const PASSWORD_STRENGTH_ERROR = t('The new password is too weak');
  const PASSWORDS_MATCH_ERROR = t('Passwords do not match');
  if (isFieldsFilled && !verifyPasswordsMatch(newPassword, confirmPassword)) {
    return PASSWORDS_MATCH_ERROR;
  }
  if (
    considerStrength &&
    isFieldsFilled &&
    passwordStrength < REQUIRED_PASSWORD_STRENTGH
  ) {
    return PASSWORD_STRENGTH_ERROR;
  }
  return '';
};

const getBarColors = (theme: typeof darkTheme) => {
  return [
    theme.palette.grey[400],
    theme.palette.error.main,
    theme.palette.error.light,
    theme.palette.warning.main,
    theme.palette.success.light,
  ];
};

export function PasswordStrength({
  password,
  setPasswordStrength,
}: {
  password: string;
  setPasswordStrength: (score: number) => void;
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const barColors = getBarColors(theme);
  return (
    <PasswordStrengthBar
      password={password}
      scoreWordStyle={{
        fontSize: '12px',
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.secondary,
        textAlign: 'left',
      }}
      scoreWords={[
        t('Password strength: Too weak'),
        t('Password strength: Too weak'),
        t('Password strength: Weak'),
        t('Password strength: Good enough'),
        t('Password strength: Strong'),
      ]}
      shortScoreWord={t('Password must be at least 8 characters.')}
      onChangeScore={(score) => {
        setPasswordStrength(score);
      }}
      minLength={8}
      barColors={barColors}
    />
  );
}
