import React from 'react';
import { useTheme, DefaultTheme } from 'styled-components';

import { Typography, useThemeContext } from '@avalabs/react-components';

const PasswordStrengthBar = React.lazy(
  () => import('react-password-strength-bar')
);

export const PASSWORD_STRENGTH_ERROR = 'The new password is too weak';
export const PASSWORDS_MATCH_ERROR = 'Passwords do not match';
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
    <Typography size={12} height="16px" padding="8px">
      <PasswordStrengthBar
        password={password}
        scoreWords={[
          'Password strength: Too weak',
          'Password strength: Too weak',
          'Password strength: Weak',
          'Password strength: Good enough',
          'Password strength: Strong',
        ]}
        shortScoreWord="Password must be at least 6 characters."
        onChangeScore={(score) => {
          setPasswordStrength(score);
        }}
        minLength={6}
        barColors={barColors}
      />
    </Typography>
  );
}
