import { Box, Button, Stack } from '@avalabs/k2-alpine';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PasswordField } from '@/components/StandaloneField';
import { useSubmitButton } from '@/hooks/useSubmitButton';

type Props = {
  onUnlock: (password: string) => Promise<true>;
  onForgotPasswordClick: () => void;
  hasCollapseEntered: boolean;
};

export const Unlock: React.FC<Props> = ({
  onUnlock,
  onForgotPasswordClick,
  hasCollapseEntered,
}) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  const [submitButtonRef, shortcuts] = useSubmitButton();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (hasCollapseEntered) {
      inputRef.current?.focus();
    }
  }, [hasCollapseEntered]);

  return (
    <Stack direction="column" width="100cqw" px="20px" mt={8}>
      <PasswordField
        inputRef={inputRef}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={shortcuts.onKeyDown}
        error={!!error}
        helperText={error}
      />
      <Button
        ref={submitButtonRef}
        disabled={isPasswordMissing}
        variant="contained"
        size="extension"
        onClick={handleSubmit}
        loading={isLoading}
        sx={{ mt: 1.5 }}
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
