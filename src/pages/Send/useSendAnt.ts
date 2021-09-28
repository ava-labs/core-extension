import { useState } from 'react';
import { BN } from '@avalabs/avalanche-wallet-sdk';
import { SendAntState } from '@avalabs/wallet-react-components';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { sendAntValidateRequest } from '@src/background/services/sendAnt/utils/sendAntValidateRequest';
import { sendAntResetRequest } from '@src/background/services/sendAnt/utils/sendAntResetRequest';
import { sendAntSubmitRequest } from '@src/background/services/sendAnt/utils/sendAntSubmitRequest';
import { AntWithBalance } from '@avalabs/wallet-react-components';

export function useSendAnt(token: AntWithBalance) {
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
    setValues(amount: string, address: string) {
      return request(sendAntValidateRequest(amount, address, token)).then(
        parseAndSetState
      );
    },
    reset() {
      return request(sendAntResetRequest()).then((result) => {
        setSendAntState(result);
        return result;
      });
    },
    submit(amount: string) {
      if (!sendAntState) {
        return Promise.reject('send ant state undefined');
      }

      return request(
        sendAntSubmitRequest(amount, sendAntState?.address, sendAntState?.token)
      )
        .then((response) => response.result)
        .then((result) => setTxId(result));
    },
  };
}
