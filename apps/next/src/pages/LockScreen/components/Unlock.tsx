import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@avalabs/k2-alpine';
import { Stack, Button } from '@avalabs/k2-alpine';
import { PasswordField } from '@/components/StandaloneField';

type Props = {
  onUnlock: (password: string) => Promise<true>;
  onForgotPasswordClick: () => void;
};

export const Unlock: React.FC<Props> = ({
  onUnlock,
  onForgotPasswordClick,
}) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const isPasswordMissing = password.trim().length === 0;

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (isPasswordMissing) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onUnlock(password);
    } catch {
      setError(t('Invalid password'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack direction="column" width="100cqw" px="20px" mt={8}>
      <PasswordField
        onChange={(e) => setPassword(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            handleSubmit(e);
          }
        }}
        error={!!error}
        helperText={error}
      />
      <Button
        disabled={isPasswordMissing}
        variant="contained"
        size="small"
        onClick={handleSubmit}
        loading={isLoading}
        sx={{ mt: 1.5, height: '32px' }}
      >
        {t('Login')}
      </Button>
      <Box
        display="flex"
        height="20cqh"
        alignItems="center"
        justifyContent="center"
      >
        <Button variant="text" size="small" onClick={onForgotPasswordClick}>
          {t('Forgot password?')}
        </Button>
      </Box>
    </Stack>
  );
};
