import {
  Button,
  Stack,
  TextField,
  Typography,
  XIcon,
  useTheme,
} from '@avalabs/k2-components';
import { Overlay } from '@src/components/common/Overlay';
import { useSeedlessActions } from '@src/pages/Onboarding/hooks/useSeedlessActions';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface TOTPModalProps {
  onFinish: () => void;
  onCancel: () => void;
}

export function TOTPModal({ onFinish, onCancel }: TOTPModalProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { loginTOTPStart, verifyLoginCode } = useSeedlessActions();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [totpCode, setTotpCode] = useState('');

  useEffect(() => {
    loginTOTPStart();
  }, [loginTOTPStart]);

  const verifyCode = useCallback(async () => {
    setIsLoading(true);
    const isSuccessful = await verifyLoginCode(totpCode);
    if (!isSuccessful) {
      setError(t('Incorrect code. Try again.'));
    }
    if (isSuccessful) {
      onFinish();
      setError('');
    }
    setIsLoading(false);
  }, [onFinish, t, totpCode, verifyLoginCode]);

  return (
    <Overlay>
      <Stack
        sx={{
          width: '512px',
          minHeight: '407px',
          background: theme.palette.background.paper,
          borderRadius: 1,
          p: 1,
        }}
      >
        <Stack
          sx={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              pt: 3,
              px: 4,
            }}
            data-testid={`authenticator-modal-header`}
          >
            {t('Verify Code')}
          </Typography>
          <Button
            variant="text"
            data-testid={`authenticator-modal-close-button`}
            onClick={onCancel}
            sx={{
              p: 0,
              height: theme.spacing(3),
              width: theme.spacing(3),
              minWidth: theme.spacing(3),
            }}
          >
            <XIcon size={24} sx={{ color: 'primary.main' }} />
          </Button>
        </Stack>
        <Stack
          sx={{
            flexGrow: 1,
            pt: 1,
            px: 4,
          }}
        >
          <Typography variant="body2" minHeight={40}>
            <Typography sx={{ color: 'text.secondary' }}>
              {t('Enter the code generated from your authenticator app.')}
            </Typography>
          </Typography>
          <Stack
            sx={{
              height: '100%',
              flexGrow: 1,
            }}
          >
            <Stack sx={{ width: '100%' }}>
              <TextField
                inputProps={{ style: { width: '100%' } }}
                type="tel"
                onChange={(event) => setTotpCode(event.target.value)}
                rows={3}
                multiline
                error={!!error}
                helperText={error}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    verifyCode();
                  }
                }}
              />
            </Stack>
          </Stack>
        </Stack>
        <Stack
          sx={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            p: 2,
          }}
        >
          <Stack sx={{ flexDirection: 'row', columnGap: 2 }}>
            <Button
              color="secondary"
              data-testid="authenticator-modal-cancel"
              onClick={onCancel}
              disabled={isLoading}
            >
              {t('Cancel')}
            </Button>
            <Button
              isLoading={isLoading}
              disabled={isLoading}
              data-testid="authenticator-modal-next"
              onClick={verifyCode}
            >
              {t('Next')}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Overlay>
  );
}
