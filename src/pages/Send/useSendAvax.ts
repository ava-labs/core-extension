import { useState } from 'react';
import { SendAvaxState } from '@avalabs/wallet-react-components';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { sendAvaxValidateRequest } from '@src/background/services/sendAvax/utils/sendAvaxValidateRequest';
import { BN, ChainIdType } from '@avalabs/avalanche-wallet-sdk';
import { sendAvaxResetRequest } from '@src/background/services/sendAvax/utils/sendAvaxResetRequest';
import { sendAvaxSubmitRequest } from '@src/background/services/sendAvax/utils/sendAvaxSubmitRequest';

export function useSendAvax() {
  const [sendAvaxState, setSendAvaxState] = useState<SendAvaxState>();
  const [txId, setTxId] = useState<string>();
  const { request } = useConnectionContext();

  function parseAndSetState(state: SendAvaxState) {
    const parsedState = {
      ...state,
      amount: new BN(state.amount || 0),
    };

    setSendAvaxState(parsedState);
    return parsedState;
  }

  return {
    ...sendAvaxState,
    txId,
    setAmount(amount: BN) {
      return request(
        sendAvaxValidateRequest(amount, sendAvaxState?.address as string)
      )
        .then((response) => response.result)
        .then(parseAndSetState);
    },
    setAddress(address: string) {
      return request(
        sendAvaxValidateRequest(sendAvaxState?.amount as BN, address)
      )
        .then((response) => response.result)
        .then(parseAndSetState);
    },
    reset() {
      return request(sendAvaxResetRequest())
        .then((response) => response.result)
        .then((state) => setSendAvaxState(state));
    },
    submit() {
      request(
        sendAvaxSubmitRequest(
          sendAvaxState?.amount as BN,
          sendAvaxState?.targetChain as ChainIdType,
          sendAvaxState?.address as string
        )
      )
        .then((response) => response.result)
        .then((hash) => setTxId(hash));
    },
  };
}
