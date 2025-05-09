import { t as translate } from 'i18next';
import { useTranslation } from 'react-i18next';
import {
  useTheme,
  darkTheme,
  Typography,
  Stack,
} from '@avalabs/core-k2-components';
import zxcvbn from 'zxcvbn';
import { useEffect } from 'react';

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
  considerStrength = true,
) => {
  const PASSWORD_STRENGTH_ERROR = translate('The new password is too weak');
  const PASSWORDS_MATCH_ERROR = translate('Passwords do not match');
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

const getColors = (theme: typeof darkTheme) => {
  return [
    theme.palette.error.main,
    theme.palette.error.light,
    theme.palette.warning.main,
    theme.palette.success.light,
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
  const { score: strength } = zxcvbn(password);
  useEffect(() => {
    setPasswordStrength(strength);
  }, [setPasswordStrength, strength]);
  const scoreWords = [
    t('Strength: weak. Keep adding characters.'),
    t('Strength: weak. Keep adding characters.'),
    t('Strength: medium. This will do. '),
    t('Strength: strong. Keep this one!'),
    t('Strength: strong. Keep this one!'),
  ];
  const colors = getColors(theme);
  return (
    <Stack sx={{ mt: 1 }}>
      <Typography
        color={colors[strength]}
        sx={{ textAlign: 'left' }}
        variant="caption"
      >
        {scoreWords[strength]}
      </Typography>
    </Stack>
  );
}
