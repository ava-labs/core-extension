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
  AlertCircleIcon,
  TrashIcon,
  Tooltip,
} from '@avalabs/core-k2-components';
import { useCallback, useEffect, useState } from 'react';
import browser from 'webextension-polyfill';

import { Overlay } from '@src/components/common/Overlay';
import { PageTitle } from '@src/components/common/PageTitle';
import { useSeedlessMfa } from '@src/hooks/useSeedlessMfa';
import { TOTPChallenge } from '@src/components/common/seedless/components/TOTPChallenge';
import { useSeedlessMfaManager } from '@src/contexts/SeedlessMfaManagementProvider';
import type { TotpResetChallenge } from '@src/background/services/seedless/models';
import { AuthErrorCode } from '@src/background/services/seedless/models';
import { ContextContainer } from '@src/hooks/useIsSpecificContextContainer';

import { AuthenticatorVerifyScreen } from './AuthenticatorVerifyScreen';

enum State {
  Initial = 'initial',
  Initiated = 'initiated',
  ConfirmChange = 'confirm-change',
  ConfirmRemoval = 'confirm-removal',
  Pending = 'pending',
  Completing = 'completing',
  VerifyCode = 'verify-code',
  Failure = 'failure',
}

type Props = {
  onBackClick?: () => void;
  onUpdated?: () => void;
  autoInitialize?: boolean;
};

export function AuthenticatorDetails({
  onBackClick,
  onUpdated,
  autoInitialize,
}: Props) {
  const { t } = useTranslation();
  const {
    initAuthenticatorChange,
    completeAuthenticatorChange,
    hasFidoConfigured,
    hasTotpConfigured,
  } = useSeedlessMfaManager();
  const { renderMfaPrompt } = useSeedlessMfa();

  const [state, setState] = useState(State.Initial);

  const [totpChallenge, setTotpChallenge] = useState<TotpResetChallenge>();
  const [error, setError] = useState<AuthErrorCode>();

  const initChange = useCallback(async () => {
    if (hasFidoConfigured) {
      browser.tabs.create({
        url: `${ContextContainer.FULLSCREEN}#/update-recovery-methods`,
      });
      return;
    }

    setState(State.Initiated);
    try {
      const challenge = await initAuthenticatorChange();
      setTotpChallenge(challenge);
      setState(State.Pending);
    } catch {
      setTotpChallenge(undefined);
      setState(State.Failure);
    }
  }, [initAuthenticatorChange, hasFidoConfigured]);

  const openRemoveTotpPopup = useCallback(async () => {
    browser.tabs.create({ url: `${ContextContainer.FULLSCREEN}#/remove-totp` });
  }, []);

  const completeChange = useCallback(
    async (totpId: string, code: string) => {
      setState(State.Completing);

      try {
        await completeAuthenticatorChange(totpId, code);

        if (onUpdated) {
          onUpdated();
        } else {
          setState(State.Initial);
          toast.success(t('Authenticator updated'));
        }
      } catch (err) {
        // If invalid code, try again
        if (err === AuthErrorCode.InvalidTotpCode) {
          setState(State.VerifyCode);
          setError(err);
          return;
        }
        setState(State.Failure);
      }
    },
    [completeAuthenticatorChange, onUpdated, t],
  );

  useEffect(() => {
    if (autoInitialize && state === State.Initial) {
      initChange();
    }
  }, [autoInitialize, initChange, onBackClick, state]);

  return (
    <Overlay isBackgroundFilled>
      <Stack
        sx={{
          width: 375,
          height: 600,
          pt: 1.5,
          gap: 2,
          alignSelf: 'center',
          backgroundColor: autoInitialize ? 'background.paper' : 'transparent',
          borderRadius: 1,
        }}
      >
        {state === State.Failure && (
          <Stack
            sx={{
              width: 1,
              height: 1,
              px: 3,
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
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
              onClick={initChange}
              data-testid="btn-try-again"
              sx={{ mt: 4 }}
            >
              {t('Try again')}
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={onBackClick ?? window.close}
              data-testid="btn-go-back"
            >
              {onBackClick ? t('Go Back') : t('Close')}
            </Button>
          </Stack>
        )}
        {(state === State.Initial ||
          state === State.Initiated ||
          state === State.ConfirmChange ||
          state === State.ConfirmRemoval) && (
          <>
            <PageTitle
              onBackClick={onBackClick}
              showBackButton={Boolean(onBackClick)}
            >
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
              {hasTotpConfigured && (
                <>
                  <Button
                    color="secondary"
                    size="large"
                    fullWidth
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
                  <Tooltip
                    sx={{ width: 1 }}
                    title={
                      hasFidoConfigured
                        ? ''
                        : t(
                            'To remove the authenticator app, you first need to configure a different recovery method.',
                          )
                    }
                  >
                    <Button
                      variant="text"
                      color="error"
                      size="large"
                      fullWidth
                      sx={{ mt: 1.5 }}
                      startIcon={<TrashIcon />}
                      onClick={() => setState(State.ConfirmRemoval)}
                      disabled={
                        !hasFidoConfigured ||
                        state === State.ConfirmRemoval ||
                        state === State.Initiated
                      }
                      isLoading={
                        state === State.ConfirmRemoval ||
                        state === State.Initiated
                      }
                    >
                      {t('Remove')}
                    </Button>
                  </Tooltip>
                </>
              )}
            </Stack>
            {state === State.Initiated && renderMfaPrompt()}
            <Dialog
              open={
                state === State.ConfirmChange || state === State.ConfirmRemoval
              }
              PaperProps={{ sx: { m: 2, textAlign: 'center' } }}
            >
              <DialogTitle>
                {state === State.ConfirmChange
                  ? t('Change Authenticator?')
                  : t('Remove Authenticator?')}
              </DialogTitle>
              <DialogContent>
                {state === State.ConfirmChange
                  ? t(
                      'You will no longer be able to use this authenticator once you switch. You can always re-add an authenticator app.',
                    )
                  : t(
                      'You will no longer be able to use this authenticator once you remove it. You can always re-add it later.',
                    )}
              </DialogContent>
              <DialogActions>
                <Button
                  key="change"
                  size="large"
                  onClick={
                    state === State.ConfirmChange
                      ? initChange
                      : openRemoveTotpPopup
                  }
                >
                  {state === State.ConfirmChange ? t('Change') : t('Remove')}
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
