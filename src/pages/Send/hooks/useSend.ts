import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { SendState } from '@src/background/services/send/models';
import { deserializeSendState } from '@src/background/services/send/utils/deserializeSendState';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import Queue from 'queue';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { DEFAULT_SEND_FORM, SendStateWithActions } from '../models';

export function useSend(): SendStateWithActions {
  const backgroundQueue = useRef(Queue({ autostart: true, concurrency: 1 }));
  const [sendState, setSendState] = useState<SendState>(DEFAULT_SEND_FORM);
  const stateRef = useRef<SendState>(sendState);
  const { request } = useConnectionContext();

  const resetSendState = useCallback(() => setSendState(DEFAULT_SEND_FORM), []);

  // Keep a ref to the sendState so it doesn't need to be a dependency of
  // updateSendState, otherwise it causes infinite rerenders in Send.tsx.
  useLayoutEffect(() => {
    stateRef.current = sendState;
  }, [sendState]);

  useEffect(() => {
    // Get initial maxAmount, fees, etc.
    if (!sendState.maxAmount) updateSendState(sendState);
    // ONLY run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSendState = useCallback(
    (updates: Partial<SendState>) => {
      // Updates are queued because the SEND_VALIDATE call may modify the state
      // and we want to ensure that subsequent updates have the latest state.
      backgroundQueue.current.push(async () => {
        const newState = getUpdatedState(updates, stateRef.current);
        const validatedState = await request({
          method: ExtensionRequest.SEND_VALIDATE,
          params: [newState],
        });
        setSendState(deserializeSendState(validatedState));
      });
    },
    [request]
  );

  const submitSendState = useCallback(async () => {
    if (!sendState) return Promise.resolve('');

    const txId = await request({
      method: ExtensionRequest.SEND_SUBMIT,
      params: [sendState],
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

function getUpdatedState(
  updates: Partial<SendState>,
  current: SendState
): SendState {
  const newState = { ...current, ...updates };

  // Reset gasLimit when the address changes because a different address can
  // affect the gasLimit estimate.
  if (updates.address && updates.address !== current.address) {
    delete newState.gasLimit;
  }

  return newState;
}
