import { filter } from 'rxjs';
import { useCallback, useEffect, useState } from 'react';

import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  isSeedlessMfaChoiceRequest,
  isSeedlessMfaEvent,
} from '@src/background/services/seedless/events/eventFilters';
import type { SubmitMfaResponseHandler } from '@src/background/services/seedless/handlers/submitMfaResponse';
import type {
  MfaChoiceRequest,
  MfaRequestData,
  RecoveryMethod as RecoveryMethodT,
} from '@src/background/services/seedless/models';
import {
  AuthErrorCode,
  MfaRequestType,
  SeedlessEvents,
} from '@src/background/services/seedless/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { launchFidoFlow } from '@src/utils/seedless/fido/launchFidoFlow';

import { FIDOApiEndpoint } from '@src/utils/seedless/fido/types';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@avalabs/core-k2-components';
import { TOTPChallenge } from '@src/components/common/seedless/components/TOTPChallenge';
import { FIDOChallenge } from '@src/components/common/seedless/components/FIDOChallenge';
import { useTranslation } from 'react-i18next';
import type { ChooseMfaMethodHandler } from '@src/background/services/seedless/handlers/chooseMfaMethod';
import { MfaChoicePrompt } from '@src/components/common/seedless/components/MfaChoicePrompt';

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
      }
    },
    [request, mfaChallenge],
  );

  const submitFido = useCallback(
    async (force: boolean) => {
      if (!mfaChallenge || (isVerifying && !force)) {
        return;
      }

      if (
        mfaChallenge.type !== MfaRequestType.Fido &&
        mfaChallenge.type !== MfaRequestType.FidoRegister
      ) {
        setError(AuthErrorCode.WrongMfaResponseAttempt);
        return;
      }

      setIsVerifying(true);
      setError(undefined);

      try {
        const answer = await launchFidoFlow(
          mfaChallenge.type === MfaRequestType.Fido
            ? FIDOApiEndpoint.Authenticate
            : FIDOApiEndpoint.Register,
          mfaChallenge.options,
          mfaChallenge.type === MfaRequestType.FidoRegister
            ? mfaChallenge.keyType
            : undefined,
        );

        await request<SubmitMfaResponseHandler>({
          method: ExtensionRequest.SEEDLESS_SUBMIT_MFA_RESPONSE,
          params: [
            {
              mfaId: mfaChallenge?.mfaId,
              answer,
            },
          ],
        });
      } catch (_err) {
        setError(AuthErrorCode.FidoChallengeFailed);
      }
    },
    [request, mfaChallenge, isVerifying],
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
    [mfaChoice, request],
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
          {(mfaChallenge?.type === MfaRequestType.Fido ||
            mfaChallenge?.type === MfaRequestType.FidoRegister) && (
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

        <MfaChoicePrompt mfaChoice={mfaChoice} onChosen={chooseMfaMethod} />
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
    ],
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

        if (event.name === SeedlessEvents.MfaClear) {
          setMfaChallenge(undefined);
          setError(undefined);
          setMfaChoice(undefined);
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
              : AuthErrorCode.InvalidTotpCode,
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
