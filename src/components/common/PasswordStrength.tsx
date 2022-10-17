import { lazy } from 'react';
import { useTheme, DefaultTheme } from 'styled-components';
import { useThemeContext } from '@avalabs/react-components';
import { t } from 'i18next';

const PasswordStrengthBar = lazy(() => import('react-password-strength-bar'));

export const PASSWORD_STRENGTH_ERROR = t('The new password is too weak');
export const PASSWORDS_MATCH_ERROR = t('Passwords do not match');
const REQUIRED_PASSWORD_STRENTGH = 3; // can be 0-4

const verifyPasswordsMatch = (pass1?: string, pass2?: string) => {
  return !!(pass1 && pass2 && pass1 === pass2);
};

export const getPasswordErrorMessage = (
  isFieldsFilled: boolean,
  newPassword: string,
  confirmPassword: string,
  passwordStrength: number,
  considerStrength = true
) => {
  if (
    considerStrength &&
    isFieldsFilled &&
    passwordStrength < REQUIRED_PASSWORD_STRENTGH
  ) {
    return PASSWORD_STRENGTH_ERROR;
  } else if (
    isFieldsFilled &&
    !verifyPasswordsMatch(newPassword, confirmPassword)
  ) {
    return PASSWORDS_MATCH_ERROR;
  }
  return '';
};

const getBarColors = (theme: DefaultTheme, darkMode?: boolean) => {
  if (darkMode) {
    return [
      theme.palette.grey[400],
      theme.palette.primary[400],
      theme.palette.primary[200],
      theme.palette.orange[400],
      theme.palette.green[300],
    ];
  }
  return [
    theme.palette.grey[300],
    theme.palette.primary[200],
    theme.palette.primary[500],
    theme.palette.orange[200],
    theme.palette.green[200],
  ];
};

export function PasswordStrength({
  password,
  setPasswordStrength,
}: {
  password: string;
  setPasswordStrength: (score: number) => void;
}) {
  const theme = useTheme();
  const { darkMode } = useThemeContext();
  const barColors = getBarColors(theme, darkMode);
  return (
    <PasswordStrengthBar
      password={password}
      scoreWordStyle={{
        fontSize: '12px',
        fontFamily: theme.fontFamily,
        color: theme.colors.text2,
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
