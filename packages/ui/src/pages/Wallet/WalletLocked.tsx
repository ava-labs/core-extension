import { BrandName } from '@/components/icons/BrandName';
import { useConnectionContext } from '@/contexts/ConnectionProvider';
import { useAppDimensions } from '@/hooks/useAppDimensions';
import {
	Button,
	CircularProgress,
	Dialog,
	Divider,
	Stack,
	TextField,
	Typography,
} from '@avalabs/core-k2-components';
import type { ResetExtensionStateHandler } from '@core/service-worker';
import { ExtensionRequest } from '@core/types';
import { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

export function WalletLocked({
  unlockWallet,
}: {
  unlockWallet(password: string): Promise<any>;
}) {
  const { t } = useTranslation();
  const { request } = useConnectionContext();
  const dimensions = useAppDimensions();
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const [loggingIn, setLoggingIn] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const onImportClick = () => {
    setShowDialog(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoggingIn(true);
    setError('');

    if (!password) {
      return;
    }
    unlockWallet(password)
      .then(() => {
        if (!isMounted.current) {
          return;
        }
        // success!
        setLoginSuccess(true);
      })
      .catch(() => {
        if (!isMounted.current) {
          return;
        }
        // error!
        setLoggingIn(false);
        setError('Invalid password');
      });
  };

  return (
    <Stack
      sx={{
        ...dimensions,
        justifyContent: 'space-around',
        alignItems: 'center',
        px: 2,
        pb: 2,
      }}
    >
      <Stack
        sx={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <BrandName width={120} />
      </Stack>

      <Stack
        sx={{
          height: '88px',
          width: '100%',
          mb: 4,
        }}
      >
        <TextField
          data-testid="wallet-locked-password-input"
          type="password"
          label={t('Password')}
          onChange={(e) => setPassword(e.currentTarget.value.trim())}
          placeholder={t('Input Password')}
          error={!!error}
          helperText={error}
          fullWidth
          size="large"
          onKeyPress={(e) => {
            // When we click the enter key within the password input
            if (e.key === 'Enter' && password) {
              handleSubmit(e);
            }
          }}
          autoFocus
        />
      </Stack>
      <Button
        data-testid="wallet-locked-login-button"
        disabled={!password || loggingIn || loginSuccess}
        onClick={handleSubmit}
        fullWidth
        size="large"
      >
        {(loggingIn || loginSuccess) && (
          <CircularProgress size={16} sx={{ mr: 1 }} />
        )}
        {t('Login')}
      </Button>
      <Divider flexItem sx={{ my: 2 }} />
      <Button
        variant="text"
        data-testid="wallet-locked-reset-phrase-button"
        onClick={() => onImportClick()}
        sx={{ mb: 1 }}
      >
        {t('Forgot Password?')}
      </Button>
      <Dialog
        open={showDialog}
        showCloseIcon={false}
        onClose={() => setShowDialog(false)}
        PaperProps={{ sx: { m: 2 } }}
      >
        <Stack sx={{ justifyContent: 'center', p: 3, rowGap: 2 }}>
          <Typography variant="h5" sx={{ textAlign: 'center' }}>
            {t('Forgot Password?')}
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            <Trans i18nKey="Pressing yes will terminate this session. Without your recovery phrase or methods you will not be able to recover this wallet." />
          </Typography>
          <Stack
            sx={{
              rowGap: 2,
            }}
          >
            <Button
              size="large"
              onClick={() => {
                request<ResetExtensionStateHandler>({
                  method: ExtensionRequest.RESET_EXTENSION_STATE,
                  params: [true],
                });
                setShowDialog(false);
              }}
            >
              {t('Yes')}
            </Button>
            <Button variant="text" onClick={() => setShowDialog(false)}>
              {t('No')}
            </Button>
          </Stack>
        </Stack>
      </Dialog>
    </Stack>
  );
}
