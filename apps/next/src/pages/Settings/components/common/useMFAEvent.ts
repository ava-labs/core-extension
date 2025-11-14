import { isSeedlessMfaEvent } from '@core/common';
import {
  AuthErrorCode,
  MfaRequestData,
  MfaRequestType,
  SeedlessEvents,
} from '@core/types';
import { useConnectionContext } from '@core/ui';
import { useEffect, useRef, useState } from 'react';
import { filter } from 'rxjs';

export function useMFAEvents(
  onError: (error: AuthErrorCode | undefined) => void,
  onClear?: VoidFunction,
) {
  const { events, tabId } = useConnectionContext();
  const [challenge, setChallenge] = useState<MfaRequestData>();

  const challengeRef = useRef(challenge);
  challengeRef.current = challenge;

  useEffect(() => {
    const eventsSubscription = events()
      .pipe(filter(isSeedlessMfaEvent))
      .subscribe(async (event) => {
        if (event.value.tabId !== tabId) {
          return;
        }

        if (event.name === SeedlessEvents.MfaRequest) {
          setChallenge(event.value);
          return;
        }

        if (event.name === SeedlessEvents.MfaClear) {
          setChallenge(undefined);
          onError(undefined);
          onClear?.();
          return;
        }

        const { mfaId, type } = challengeRef.current ?? {};
        if (
          mfaId &&
          event.name === SeedlessEvents.MfaFailure &&
          event.value.mfaId === mfaId
        ) {
          onError(
            type === MfaRequestType.Fido
              ? AuthErrorCode.FidoChallengeFailed
              : AuthErrorCode.InvalidTotpCode,
          );
        }
      });

    return () => {
      eventsSubscription.unsubscribe();
    };
  }, [events, onClear, onError, tabId]);

  return {
    challenge,
    clear: () => setChallenge(undefined),
  };
}
