import { filter } from 'rxjs';
import { useCallback, useEffect, useState } from 'react';

import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { isSeedlessMfaEvent } from '@src/background/services/seedless/events/eventFilters';
import { SubmitMfaResponseHandler } from '@src/background/services/seedless/handlers/submitMfaResponse';
import {
  MfaRequestData,
  MfaRequestType,
  SeedlessEvents,
} from '@src/background/services/seedless/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { launchFidoFlow } from '@src/utils/seedless/fido/launchFidoFlow';

import { AuthErrorCode } from './useSeedlessAuth';
import { FIDOApiEndpoint } from '@src/utils/seedless/fido/types';

export const useSeedlessMfa = () => {
  const { events, request, tabId } = useConnectionContext();
  const [mfaChallenge, setMfaChallenge] = useState<MfaRequestData>();
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
    submitTotp,
    submitFido,
    isVerifying,
    error,
  };
};
