import zxcvbn from 'zxcvbn';
import { FC, useEffect, useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { Stack, StackProps, Typography } from '@avalabs/k2-alpine';

import { useOnboardingContext } from '@core/ui';

import {
  Section,
  SectionLabel,
  SectionRow,
} from '@/pages/Onboarding/components/Section';

import { BorderlessTextField } from '@/components/BorderlessTextField';

type Props = StackProps & {
  onValidityChange: (isValid: boolean) => void;
};

export const PasswordSection: FC<Props> = ({
  sx,
  onValidityChange,
  ...props
}) => {
  const { t } = useTranslation();
  const { password, setPassword } = useOnboardingContext();
  const [confirmPassword, setConfirmPassword] = useState('');

  const passwordsMetadata = validatePasswords({
    password,
    confirmPassword,
    t,
  });

  useEffect(() => {
    onValidityChange(Boolean(passwordsMetadata?.isValid));
  }, [passwordsMetadata?.isValid, onValidityChange]);

  return (
    <Stack sx={{ gap: 0.5 }} {...props}>
      <Section>
        <SectionRow component="label">
          <SectionLabel>{t('Enter a password')}</SectionLabel>
          <Stack
            sx={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              flexGrow: 1,
            }}
          >
            <BorderlessTextField
              type="password"
              size="small"
              placeholder={t('Password must be at least 8 characters')}
              slotProps={{
                htmlInput: { sx: { textAlign: 'end', px: 0, py: 0 } },
              }}
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Stack>
        </SectionRow>
        <SectionRow component="label">
          <SectionLabel>{t('Confirm password')}</SectionLabel>
          <Stack
            sx={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              flexGrow: 1,
            }}
          >
            <BorderlessTextField
              type="password"
              size="small"
              slotProps={{
                htmlInput: { sx: { textAlign: 'end', px: 0, py: 0 } },
              }}
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Stack>
        </SectionRow>
      </Section>
      <Typography
        variant="caption"
        textAlign="end"
        sx={{
          height: 14,
          transition: 'color .1s ease-in-out',
          color: passwordsMetadata?.colorKey ?? 'transparent',
        }}
      >
        {passwordsMetadata?.message}
      </Typography>
    </Stack>
  );
};

const validatePasswordStrength = (password: string, t: TFunction) => {
  if (!password) {
    return;
  }

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
) => {
  // Only compare if both values are provided
  if (!password || !confirmPassword) {
    return;
  }

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

const validatePasswords = ({ password, confirmPassword, t }) => {
  if (!password && !confirmPassword) {
    return;
  }

  // If we only have one of the fields, focus on the password strength
  if (Boolean(password) !== Boolean(confirmPassword)) {
    return validatePasswordStrength(password || confirmPassword, t);
  }

  // If we have both fields, focus on the password match
  return validatePasswordMatch(password, confirmPassword, t);
};
