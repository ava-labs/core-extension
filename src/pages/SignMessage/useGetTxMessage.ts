import { useStore } from '@src/store/store';
import { useEffect, useState } from 'react';
import { UnapprovedMessage } from '@src/store/transaction/types';

export interface ParsedMessageResult {
  type: string;
  params?: any;
  data?: string;
  requestId: string;
}

export function useGetTxMessage(requestId?: string) {
  const { transactionStore, walletStore } = useStore();
  const [parsedMsg, _setParsedMsg] = useState<ParsedMessageResult>();

  function setParsedMsg(
    message: UnapprovedMessage,
    result: { data: string } | { params: any }
  ) {
    if (!requestId) {
      return;
    }

    _setParsedMsg({
      requestId,
      type: message.type,
      ...result,
    });
  }

  useEffect(() => {
    (async () => {
      const message: UnapprovedMessage | undefined =
        await transactionStore.getUnnaprovedMsgById(Number(requestId));

      if (
        message &&
        (message.type === 'eth_sign' ||
          message.type === 'signTypedData' ||
          message.type === 'signTypedData_v1')
      ) {
        setParsedMsg(message, { data: message.msgParams.data });
      } else if (message?.type === 'personal_sign') {
        setParsedMsg(message, { params: message.msgParams.data });
      } else if (
        message?.type === 'signTypedData_v3' ||
        message?.type === 'signTypedData_v4'
      ) {
        setParsedMsg(message, { data: JSON.parse(message.msgParams.data) });
      }
    })();
  }, [requestId]);

  return { message: parsedMsg };
}
