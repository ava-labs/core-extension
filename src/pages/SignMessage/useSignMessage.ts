import { ExtensionRequest } from '@src/background/connections/models';
import {
  Message,
  SignedMessageResult,
} from '@src/background/services/messages/models';
import { messageParser } from '@src/background/services/messages/utils/messageParser';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useEffect, useState } from 'react';

export function useSignMessage(messageId: string) {
  const { request } = useConnectionContext();
  const [message, setMessage] = useState<ReturnType<typeof messageParser>>();
  const [signedResults, setSignedResults] = useState<SignedMessageResult>();
  const [error, setError] = useState('');

  useEffect(() => {
    request!({
      method: ExtensionRequest.MESSAGE_GET_PENDING,
      params: [messageId],
    }).then((mess) => setMessage(messageParser(mess)));
  }, []);

  function signMessage() {
    request!({
      method: ExtensionRequest.MESSAGE_SIGN,
      params: [messageId],
    }).then((mess) => setSignedResults(mess));
  }

  function cancelSign() {
    request!({
      method: ExtensionRequest.MESSAGE_CANCEL_PENDING,
      params: [messageId],
    }).then(() => globalThis.close());
  }

  return { message, signMessage, cancelSign, signedResults, error };
}
