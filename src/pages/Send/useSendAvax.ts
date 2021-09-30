import { useState } from 'react';
import {
  SendAvaxState,
  SendSubmitResponse,
} from '@avalabs/wallet-react-components';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { sendAvaxValidateRequest } from '@src/background/services/sendAvax/utils/sendAvaxValidateRequest';
import { BN, ChainIdType } from '@avalabs/avalanche-wallet-sdk';
import { sendAvaxSubmitRequest } from '@src/background/services/sendAvax/utils/sendAvaxSubmitRequest';

export function useSendAvax() {
  const [sendAvaxState, setSendAvaxState] = useState<
    SendAvaxState & { error: { message: string } }
  >();
  const [txId, setTxId] = useState<string>();
  const { request } = useConnectionContext();

  function parseAndSetState(state: SendAvaxState) {
    const parsedState = {
      ...state,
      amount:
        state?.amount || sendAvaxState?.amount
          ? new BN(state?.amount || sendAvaxState?.amount || 0)
          : undefined,
      sendFee: new BN(state.sendFee || 0),
    };

    setSendAvaxState(parsedState as any);
    return parsedState;
  }

  return {
    ...sendAvaxState,
    txId,
    setValues(amount?: string, address?: string) {
      return request(sendAvaxValidateRequest(amount, address))
        .then(parseAndSetState)
        .catch((error: string) => {
          setSendAvaxState({
            ...sendAvaxState,
            error: { message: error },
          } as any);
        });
    },
    reset() {
      setSendAvaxState(undefined);
    },
    submit(amount: string) {
      return request(
        sendAvaxSubmitRequest(
          amount,
          sendAvaxState?.targetChain as ChainIdType,
          sendAvaxState?.address as string
        )
      ).then(({ txId }: SendSubmitResponse) => {
        setTxId(txId);
        return txId;
      });
    },
  };
}
