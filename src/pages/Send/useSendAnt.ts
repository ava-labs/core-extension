import { useState } from 'react';
import { BN } from '@avalabs/avalanche-wallet-sdk';
import { AssetBalanceX } from '@avalabs/avalanche-wallet-sdk';
import { SendAntState } from '@avalabs/wallet-react-components';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { sendAntValidateRequest } from '@src/background/services/sendAnt/utils/sendAntValidateRequest';
import { sendAntResetRequest } from '@src/background/services/sendAnt/utils/sendAntResetRequest';
import { sendAntSubmitRequest } from '@src/background/services/sendAnt/utils/sendAntSubmitRequest';

export function useSendAnt(token: AssetBalanceX) {
  const [sendAntState, setSendAntState] = useState<SendAntState>();
  const [txId, setTxId] = useState<string>();
  const { request } = useConnectionContext();

  function parseAndSetState(state: SendAntState) {
    const { amount } = state;

    const parsedState = {
      ...state,
      amount: new BN(amount || 0),
      sendFee: new BN(state.sendFee || 0),
    };

    setSendAntState(parsedState);

    return parsedState;
  }

  return {
    ...sendAntState,
    token,
    txId,
    setAmount(amount: number) {
      return request(
        sendAntValidateRequest(
          new BN(amount),
          sendAntState?.address as string,
          token
        )
      )
        .then((response) => response.result)
        .then(parseAndSetState);
    },
    setAddress(address: string) {
      return request(
        sendAntValidateRequest(
          sendAntState?.amount ? new BN(sendAntState?.amount) : new BN(0),
          address,
          token
        )
      )
        .then((response) => response.result)
        .then(parseAndSetState);
    },
    reset() {
      return request(sendAntResetRequest())
        .then((response) => response.result)
        .then((result) => {
          setSendAntState(result);
          return result;
        });
    },
    submit() {
      if (!sendAntState) {
        return Promise.reject('send ant state undefined');
      }

      return request(
        sendAntSubmitRequest(
          new BN(sendAntState?.amount),
          sendAntState?.address,
          sendAntState?.token
        )
      )
        .then((response) => response.result)
        .then((result) => setTxId(result));
    },
  };
}
