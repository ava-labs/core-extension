import { ExtensionRequest } from '@src/background/connections/models';
import {
  Message,
  MessageUpdate,
} from '@src/background/services/messages/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useEffect, useState } from 'react';

export function useSignMessage(messageId: string) {
  const { request } = useConnectionContext();
  const [message, setMessage] = useState<Message>();
  const [error] = useState<string>('');

  useEffect(() => {
    request({
      method: ExtensionRequest.MESSAGE_GET,
      params: [messageId],
    }).then(setMessage);
  }, [messageId, request]);

  function updateMessage(params: MessageUpdate) {
    request({
      method: ExtensionRequest.MESSAGE_UPDATE,
      params: [params],
    }).then(() => globalThis.close());
  }

  return { message, updateMessage, error };
}
