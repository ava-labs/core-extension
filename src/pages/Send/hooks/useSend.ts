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

  useEffect(() => {
    const subscription = backgroundQueue.current
      .pipe(
        bufferTime(300), // buffer all updates
        filter((updates) => updates.length > 0), // do nothing when no updates
        distinctUntilChanged(),
        concatMap((updates) => {
          const newState = Object.assign(stateRef.current, ...updates); // merge all updates

          return request<SendValidateHandlerType<T>>({
            method: ExtensionRequest.SEND_VALIDATE,
            params: newState,
          });
        })
      )
      .subscribe((validatedState) => {
        setSendState(validatedState);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [request]);

  useEffect(() => {
    // Get initial maxAmount, fees, etc.
    if (sendState.loading) updateSendState(sendState);
    // ONLY run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSendState = useCallback((updates: Partial<SendState<T>>) => {
    backgroundQueue.current.next(updates);
  }, []);

  const submitSendState = useCallback(async () => {
    if (!sendState) return Promise.resolve('');

    const txId = await request<SendSubmitHandler>({
      method: ExtensionRequest.SEND_SUBMIT,
      params: sendState,
    });

    setSendState((sendState) => ({ ...sendState, txId }));
    return txId;
  }, [sendState, request]);

  return {
    sendState,
    resetSendState,
    submitSendState,
    updateSendState,
  };
}
