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
      method: 'wallet_getPendingMessage',
      params: [messageId],
    }).then((mess) => setMessage(messageParser(mess)));
  }, []);

  function signMessage() {
    request!({
      method: 'wallet_signMessage',
      params: [messageId],
    }).then((mess) => setSignedResults(mess.result));
  }

  function cancelSign() {
    request!({
      method: 'wallet_cancelMessageSign',
      params: [messageId],
    }).then(() => globalThis.close());
  }

  return { message, signMessage, cancelSign, signedResults, error };
}
