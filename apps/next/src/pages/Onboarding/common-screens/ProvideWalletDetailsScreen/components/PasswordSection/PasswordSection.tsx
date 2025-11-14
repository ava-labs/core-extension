import { Stack, StackProps, Typography } from '@avalabs/k2-alpine';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useOnboardingContext } from '@core/ui';

import { BorderlessTextField } from '@/components/BorderlessTextField';
import {
  Section,
  SectionLabel,
  SectionRow,
} from '@/pages/Onboarding/components/Section';

import { validatePasswords } from '@/lib/passwordValidation';

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
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);
  const [isConfirmPasswordTouched, setIsConfirmPasswordTouched] =
    useState(false);

  const passwordsMetadata = validatePasswords({
    password,
    confirmPassword,
    isPasswordTouched,
    isConfirmPasswordTouched,
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
                htmlInput: {
                  sx: { textAlign: 'end', px: 0, py: 0 },
                  'data-testid': 'enter-password-input',
                },
              }}
              fullWidth
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setIsPasswordTouched(true);
              }}
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
                htmlInput: {
                  sx: { textAlign: 'end', px: 0, py: 0 },
                  'data-testid': 'confirm-password-input',
                },
              }}
              fullWidth
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setIsConfirmPasswordTouched(true);
              }}
            />
          </Stack>
        </SectionRow>
      </Section>
      <Typography
        variant="caption"
        textAlign="end"
        data-testid={
          passwordsMetadata?.type === 'length-error'
            ? 'password-length-error'
            : passwordsMetadata?.type === 'weak-password'
              ? 'weak-password-message'
              : 'password-strength-message'
        }
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
