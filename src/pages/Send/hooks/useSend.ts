import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { SendableToken } from '@src/background/services/balances/models';
import { SendSubmitHandler } from '@src/background/services/send/handlers/SendSubmitHandler';
import { SendValidateHandlerType } from '@src/background/services/send/handlers/SendValidateHandler';
import { SendState } from '@src/background/services/send/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  bufferTime,
  distinctUntilChanged,
  filter,
  Subject,
  concatMap,
  switchMap,
} from 'rxjs';
import { getDefaultSendForm, SendStateWithActions } from '../models';

export function useSend<
  T extends SendableToken = SendableToken
>(): SendStateWithActions<T> {
  const backgroundQueue = useRef(new Subject<SendState<T>>());
  const [sendState, setSendState] = useState<SendState<T>>(getDefaultSendForm);
  const stateRef = useRef<SendState<T>>(sendState);
  const { request } = useConnectionContext();

  const resetSendState = useCallback(
    () => setSendState(getDefaultSendForm),
    []
  );

  const setIsValidating = useCallback((isValidating) => {
    setSendState((state) => ({ ...state, isValidating }));
  }, []);

  useEffect(() => {
    const subscription = backgroundQueue.current
      .pipe(
        bufferTime(500), // buffer all updates
        filter((updates) => updates.length > 0), // do nothing when no updates
        concatMap(
          async (updates) =>
            Object.assign({}, stateRef.current, ...updates) as SendState<T>
        ),
        distinctUntilChanged(
          // Ignore the updates if they did not result in any actual change
          (prev, curr) => {
            const hasNoChanges = JSON.stringify(prev) === JSON.stringify(curr);

            // If there are no changes, the pipeline will stop here, so if that's
            // the case, we need to notify the UI that validation is complete.
            if (hasNoChanges) {
              setIsValidating(false);
              stateRef.current = { ...stateRef.current, isValidating: false };
            }

            return hasNoChanges;
          }
        ),
        switchMap((newState) =>
          request<SendValidateHandlerType<T>>({
            method: ExtensionRequest.SEND_VALIDATE,
            params: newState,
          })
        )
      )
      .subscribe((validatedState) => {
        stateRef.current = validatedState;
        setSendState(validatedState);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [request, setIsValidating]);

  useEffect(() => {
    // Get initial maxAmount, fees, etc.
    if (sendState.loading) updateSendState(sendState);
    // ONLY run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSendState = useCallback(
    (updates: Partial<SendState<T>>) => {
      // Notify the UI that there is a validation request in progress
      setIsValidating(true);
      backgroundQueue.current.next(updates);
    },
    [setIsValidating]
  );

  const submitSendState = useCallback(async () => {
    if (!sendState) return Promise.resolve('');

    const txId = await request<SendSubmitHandler>({
      method: ExtensionRequest.SEND_SUBMIT,
      params: sendState,
    });

    setSendState((state) => ({ ...state, txId }));
    return txId;
  }, [sendState, request]);

  return {
    sendState,
    resetSendState,
    submitSendState,
    updateSendState,
  };
}
