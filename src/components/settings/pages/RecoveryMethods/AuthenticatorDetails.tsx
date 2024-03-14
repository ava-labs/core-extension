import { useTranslation } from 'react-i18next';
import {
  Stack,
  Typography,
  QRCodeIcon,
  styled,
  Button,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  toast,
  CircularProgress,
} from '@avalabs/k2-components';
import { useCallback, useEffect, useState } from 'react';

import { Overlay } from '@src/components/common/Overlay';
import { PageTitle } from '@src/components/common/PageTitle';
import { useSeedlessMfa } from '@src/hooks/useSeedlessMfa';
import { TOTPChallenge } from '@src/components/common/seedless/components/TOTPChallenge';
import { useSeedlessMfaManager } from '@src/contexts/SeedlessMfaManagementProvider';
import {
  AuthErrorCode,
  TotpResetChallenge,
} from '@src/background/services/seedless/models';
import sentryCaptureException, {
  SentryExceptionTypes,
} from '@src/monitoring/sentryCaptureException';

import { AuthenticatorVerifyScreen } from './AuthenticatorVerifyScreen';

enum State {
  Initial = 'initial',
  Initiated = 'initiated',
  ConfirmChange = 'confirm-change',
  Pending = 'pending',
  Completing = 'completing',
  VerifyCode = 'verify-code',
}

export function AuthenticatorDetails({ onBackClick, autoInitialize }) {
  const { t } = useTranslation();
  const { initAuthenticatorChange, completeAuthenticatorChange } =
    useSeedlessMfaManager();
  const { renderMfaPrompt } = useSeedlessMfa();

  const [state, setState] = useState(State.Initial);

  const [totpChallenge, setTotpChallenge] = useState<TotpResetChallenge>();
  const [error, setError] = useState<AuthErrorCode>();

  const initChange = useCallback(async () => {
    setState(State.Initiated);
    const challenge = await initAuthenticatorChange();
    setTotpChallenge(challenge);
    setState(State.Pending);
  }, [initAuthenticatorChange]);

  const completeChange = useCallback(
    async (totpId: string, code: string) => {
      setState(State.Completing);

      try {
        await completeAuthenticatorChange(totpId, code);
        setState(State.Initial);
        toast.success(t('Authenticator changed'));
      } catch (err) {
        // If invalid code, try again
        if (err === AuthErrorCode.InvalidTotpCode) {
          setState(State.VerifyCode);
          setError(err);
          return;
        }

        toast.error(t('Something went wrong.'));
        setError(AuthErrorCode.TotpVerificationError);
      }
    },
    [completeAuthenticatorChange, t]
  );

  useEffect(() => {
    if (autoInitialize) {
      initChange().catch((err) => {
        sentryCaptureException(err, SentryExceptionTypes.SEEDLESS);
        onBackClick();
      });
    }
  }, [autoInitialize, initChange, onBackClick]);

  return (
    <Overlay isBackgroundFilled>
      <Stack sx={{ width: 1, height: 1, pt: 1.5, gap: 2 }}>
        {(state === State.Initial ||
          state === State.Initiated ||
          state === State.ConfirmChange) && (
          <>
            <PageTitle onBackClick={onBackClick}>
              {t('Authenticator App')}
            </PageTitle>
            {autoInitialize ? (
              <Stack
                sx={{
                  width: 1,
                  height: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <CircularProgress size={80} />
              </Stack>
            ) : (
              <Stack sx={{ width: 1, gap: 2, flexGrow: 1 }}>
                <Card sx={{ backgroundColor: 'grey.900', mx: 1, px: 2, py: 2 }}>
                  <Stack direction="row" sx={{ gap: 2, alignItems: 'center' }}>
                    <QRCodeIcon size={24} sx={{ width: 28 }} />
                    <MethodName>{t('Authenticator')}</MethodName>
                  </Stack>
                </Card>
              </Stack>
            )}
            <Stack
              sx={{
                width: 1,
                px: 2,
                py: 3,
              }}
            >
              <Button
                color="secondary"
                size="large"
                onClick={() => setState(State.ConfirmChange)}
                disabled={
                  state === State.Initiated || state === State.ConfirmChange
                }
                isLoading={
                  state === State.Initiated || state === State.ConfirmChange
                }
              >
                {t('Change Authenticator App')}
              </Button>
            </Stack>
            {state === State.Initiated && renderMfaPrompt()}
            <Dialog
              open={state === State.ConfirmChange}
              PaperProps={{ sx: { m: 2, textAlign: 'center' } }}
            >
              <DialogTitle>{t('Change Authenticator?')}</DialogTitle>
              <DialogContent>
                {t(
                  'You will no longer be able to use this authenticator once you switch. You can always re-add an authenticator app.'
                )}
              </DialogContent>
              <DialogActions>
                <Button key="change" size="large" onClick={initChange}>
                  {t('Change')}
                </Button>
                <Button
                  key="cancel"
                  variant="text"
                  onClick={() => setState(State.Initial)}
                >
                  {t('Cancel')}
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
        {state === State.Pending && totpChallenge && (
          <AuthenticatorVerifyScreen
            onBackClick={onBackClick}
            totpChallenge={totpChallenge}
            onNextClick={() => setState(State.VerifyCode)}
          />
        )}
        {(state === State.Completing || state === State.VerifyCode) &&
          totpChallenge && (
            <TOTPChallenge
              onSubmit={(code) => completeChange(totpChallenge.totpId, code)}
              isLoading={state === State.Completing}
              error={error}
            />
          )}
      </Stack>
    </Overlay>
  );
}

const MethodName = styled(Typography)`
  ${({ theme }) => ({
    ...theme.typography.body2,
    fontWeight: theme.typography.fontWeightSemibold,
  })}
`;
