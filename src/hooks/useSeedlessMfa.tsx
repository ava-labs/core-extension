import { filter } from 'rxjs';
import { useCallback, useEffect, useState } from 'react';

import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  isSeedlessMfaChoiceRequest,
  isSeedlessMfaEvent,
} from '@src/background/services/seedless/events/eventFilters';
import { SubmitMfaResponseHandler } from '@src/background/services/seedless/handlers/submitMfaResponse';
import {
  AuthErrorCode,
  MfaChoiceRequest,
  MfaRequestData,
  MfaRequestType,
  RecoveryMethod as RecoveryMethodT,
  SeedlessEvents,
} from '@src/background/services/seedless/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { launchFidoFlow } from '@src/utils/seedless/fido/launchFidoFlow';

import { FIDOApiEndpoint } from '@src/utils/seedless/fido/types';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@avalabs/k2-components';
import { TOTPChallenge } from '@src/components/common/seedless/components/TOTPChallenge';
import { FIDOChallenge } from '@src/components/common/seedless/components/FIDOChallenge';
import { useTranslation } from 'react-i18next';
import { RecoveryMethod } from '@src/components/settings/pages/RecoveryMethods/RecoveryMethod';
import { ChooseMfaMethodHandler } from '@src/background/services/seedless/handlers/chooseMfaMethod';

export const useSeedlessMfa = () => {
  const { t } = useTranslation();
  const { events, request, tabId } = useConnectionContext();
  const [mfaChallenge, setMfaChallenge] = useState<MfaRequestData>();
  const [mfaChoice, setMfaChoice] = useState<MfaChoiceRequest>();
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<AuthErrorCode>();

  const submitTotp = useCallback(
    async (code: string) => {
      if (!mfaChallenge) {
        return;
      }

      if (mfaChallenge.type !== MfaRequestType.Totp) {
        setError(AuthErrorCode.WrongMfaResponseAttempt);
        return;
      }

      setIsVerifying(true);
      setError(undefined);

      try {
        await request<SubmitMfaResponseHandler>({
          method: ExtensionRequest.SEEDLESS_SUBMIT_MFA_RESPONSE,
          params: [
            {
              mfaId: mfaChallenge?.mfaId,
              code,
            },
          ],
        });
      } catch {
        setError(AuthErrorCode.TotpVerificationError);
      } finally {
        setIsVerifying(false);
      }
    },
    [request, mfaChallenge]
  );

  const submitFido = useCallback(
    async (force: boolean) => {
      if (!mfaChallenge || (isVerifying && !force)) {
        return;
      }

      if (mfaChallenge.type !== MfaRequestType.Fido) {
        setError(AuthErrorCode.WrongMfaResponseAttempt);
        return;
      }

      setIsVerifying(true);
      setError(undefined);

      try {
        const answer = await launchFidoFlow(
          FIDOApiEndpoint.Authenticate,
          mfaChallenge.options
        );

        request<SubmitMfaResponseHandler>({
          method: ExtensionRequest.SEEDLESS_SUBMIT_MFA_RESPONSE,
          params: [
            {
              mfaId: mfaChallenge?.mfaId,
              answer,
            },
          ],
        });
      } catch (err) {
        setError(AuthErrorCode.FidoChallengeFailed);
      }
    },
    [request, mfaChallenge, isVerifying]
  );

  const chooseMfaMethod = useCallback(
    (method: RecoveryMethodT) => {
      if (!mfaChoice) {
        return;
      }

      request<ChooseMfaMethodHandler>({
        method: ExtensionRequest.SEEDLESS_CHOOSE_MFA_METHOD,
        params: [
          {
            mfaId: mfaChoice.mfaId,
            chosenMethod: method,
          },
        ],
      });
    },
    [mfaChoice, request]
  );

  const renderMfaPrompt = useCallback(
    () => (
      <>
        <Dialog
          open={Boolean(mfaChallenge)}
          PaperProps={{ sx: { m: 2, textAlign: 'center' } }}
        >
          {mfaChallenge?.type === MfaRequestType.Totp && (
            <TOTPChallenge
              onSubmit={submitTotp}
              isLoading={isVerifying}
              error={error}
            />
          )}
          {mfaChallenge?.type === MfaRequestType.Fido && (
            <>
              <DialogTitle>{t('Waiting for Confirmation')}</DialogTitle>
              <DialogContent>
                <FIDOChallenge
                  completeFidoChallenge={submitFido}
                  isLoading={isVerifying}
                  error={error}
                />
              </DialogContent>
            </>
          )}
        </Dialog>

        <Dialog open={Boolean(mfaChoice)} PaperProps={{ sx: { m: 2 } }}>
          <DialogTitle>{t('Choose Verification Method')}</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              {t(
                'Select one of the available verification methods below to proceed.'
              )}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 1 }}>
            {mfaChoice?.availableMethods.map((method) => (
              <RecoveryMethod
                key={method.type === 'fido' ? method.id : 'authenticator'}
                asCard
                methodName={
                  method.type === 'fido' ? method.name : t('Authenticator')
                }
                onClick={() => chooseMfaMethod(method)}
              />
            ))}
          </DialogActions>
        </Dialog>
      </>
    ),
    [
      error,
      isVerifying,
      mfaChallenge,
      submitFido,
      submitTotp,
      t,
      mfaChoice,
      chooseMfaMethod,
    ]
  );

  useEffect(() => {
    const eventsSubscription = events()
      .pipe(filter(isSeedlessMfaChoiceRequest))
      .subscribe(async (event) => {
        if (event.value.tabId !== tabId) {
          return;
        }

        setMfaChoice(event.value);
      });

    return () => {
      eventsSubscription.unsubscribe();
    };
  }, [events, tabId, mfaChallenge]);

  useEffect(() => {
    const eventsSubscription = events()
      .pipe(filter(isSeedlessMfaEvent))
      .subscribe(async (event) => {
        if (event.value.tabId !== tabId) {
          return;
        }

        setIsVerifying(false);

        if (event.name === SeedlessEvents.MfaRequest) {
          setMfaChallenge(event.value);
          return;
        }

        if (
          mfaChallenge &&
          event.name === SeedlessEvents.MfaFailure &&
          event.value.mfaId === mfaChallenge.mfaId
        ) {
          setError(
            mfaChallenge.type === MfaRequestType.Fido
              ? AuthErrorCode.FidoChallengeFailed
              : AuthErrorCode.InvalidTotpCode
          );
        }
      });

    return () => {
      eventsSubscription.unsubscribe();
    };
  }, [events, tabId, mfaChallenge]);

  return {
    mfaChallenge,
    renderMfaPrompt,
    submitTotp,
    submitFido,
    isVerifying,
    error,
  };
};
