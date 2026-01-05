import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Stack, SxProps, toast, Typography } from '@avalabs/k2-alpine';

import { useSeedlessMfaManager } from '@core/ui';
import { AuthErrorCode, MfaRequestType } from '@core/types';
import { useMFAEvents } from '@/pages/Settings/components/common/useMFAEvent';
import { FIDOChallenge } from '@/pages/Settings/components/common/FIDOChallenge';
import { useHistory } from 'react-router-dom';
import { InProgress } from '@/pages/Settings/components/common/InProgress';
import { FiAlertCircle } from 'react-icons/fi';
import { MdCheckCircle } from 'react-icons/md';

enum RemoveTotpState {
  Loading = 'loading',
  IncompatibleWallet = 'incompatible-wallet',
  NameYourDevice = 'name-your-device',
  AddAuthenticator = 'add-authenticator',
  Success = 'success',
  Failure = 'failure',
}

const centeredStackSx: SxProps = {
  width: 1,
  height: 1,
  justifyContent: 'center',
  alignItems: 'center',
  gap: 2,
  textAlign: 'center' as const,
};

export const RemoveTotp = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { removeTotp } = useSeedlessMfaManager();
  const [state, setState] = useState(RemoveTotpState.Loading);
  const [error, setError] = useState<AuthErrorCode>();
  const mfaChallenge = useMFAEvents(setError);

  const remove = useCallback(async () => {
    try {
      await removeTotp();
      setState(RemoveTotpState.Success);
      toast.success('Recovery method removed!', { duration: 20000 });
      history.push('update-recovery-method');
    } catch (e) {
      console.log('error: ', e);
      setState(RemoveTotpState.Failure);
    }
  }, [history, removeTotp]);

  useEffect(() => {
    remove();
  }, [remove]);

  return (
    <Stack sx={{ height: '100%' }}>
      {(!mfaChallenge || !mfaChallenge.challenge) && (
        <Stack sx={{ ...centeredStackSx, px: 2 }}>
          <InProgress textSize="body1" />
        </Stack>
      )}
      {state === RemoveTotpState.Failure && (
        <Stack sx={{ ...centeredStackSx, px: 3 }}>
          <FiAlertCircle size={72} />
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
        <Stack sx={{ ...centeredStackSx, px: 2 }}>
          <MdCheckCircle size={72} color={'success.main'} />
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
          {mfaChallenge.challenge?.type === MfaRequestType.Fido && (
            <FIDOChallenge
              challenge={mfaChallenge.challenge}
              onError={setError}
              error={error}
            />
          )}
        </>
      )}
    </Stack>
  );
};
