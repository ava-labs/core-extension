import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertCircleIcon,
  Button,
  CheckCircleIcon,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';

import { useSeedlessMfaManager } from '@core/ui';

enum RemoveTotpState {
  Loading = 'loading',
  IncompatibleWallet = 'incompatible-wallet',
  NameYourDevice = 'name-your-device',
  AddAuthenticator = 'add-authenticator',
  Success = 'success',
  Failure = 'failure',
}

export const RemoveTotp = () => {
  const { t } = useTranslation();
  const { removeTotp } = useSeedlessMfaManager();
  const [state, setState] = useState(RemoveTotpState.Loading);

  const remove = useCallback(async () => {
    try {
      await removeTotp();
      setState(RemoveTotpState.Success);
    } catch {
      setState(RemoveTotpState.Failure);
    }
  }, [removeTotp]);

  useEffect(() => {
    remove();
  }, [remove]);

  return (
    <Stack
      sx={{
        width: 375,
        height: 600,
        px: 2,
        alignSelf: 'center',
        borderRadius: 1,
        backgroundColor: 'background.paper',
      }}
    >
      {state === RemoveTotpState.Failure && (
        <Stack
          sx={{
            width: 1,
            height: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            px: 3,
          }}
        >
          <AlertCircleIcon size={72} />
          <Stack sx={{ textAlign: 'center', gap: 0.5 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              {t('Something Went Wrong')}
            </Typography>
            <Typography variant="body2">
              {t('We encountered an unexpected issue.')}
            </Typography>
            <Typography variant="body2">{t('Please try again.')}</Typography>
          </Stack>

          <Button
            fullWidth
            sx={{ mt: 4 }}
            onClick={remove}
            data-testid="btn-try-again"
          >
            {t('Try again')}
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={window.close}
            data-testid="btn-close"
          >
            {t('Close')}
          </Button>
        </Stack>
      )}
      {state === RemoveTotpState.Success && (
        <Stack
          sx={{
            width: 1,
            height: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            px: 2,
            textAlign: 'center',
          }}
        >
          <CheckCircleIcon size={72} sx={{ color: 'success.main' }} />
          <Typography variant="h5">{t('Success!')}</Typography>
          <Typography variant="body2">
            {t('Authenticator app removed successfully!')}
          </Typography>

          <Button
            fullWidth
            onClick={window.close}
            data-testid="btn-close"
            sx={{ mt: 3 }}
          >
            {t('Close')}
          </Button>
        </Stack>
      )}
      {state === RemoveTotpState.Loading && (
        <>
          <>Loading</>
          {/* {renderMfaPrompt()} */}
        </>
      )}
    </Stack>
  );
};
