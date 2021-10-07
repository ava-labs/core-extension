import { useState } from 'react';
import {
  SendErc20State,
  ERC20,
  SendSubmitResponse,
} from '@avalabs/wallet-react-components';
import { BN } from '@avalabs/avalanche-wallet-sdk';
import { sendErc20ValidateRequest } from '@src/background/services/send/sendErc20/utils/sendErc20ValidateRequest';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { sendErc20SubmitRequest } from '@src/background/services/send/sendErc20/utils/sendErc20SubmitRequest';

export function useSendErc20(token: ERC20) {
  const [sendErc20State, setSendErc20State] = useState<SendErc20State>();
  const [txId, setTxId] = useState<string>();
  const { request } = useConnectionContext();

  function parseAndSetState(state: SendErc20State) {
    const parsedState = {
      ...state,
      amount: new BN(state.amount || sendErc20State?.amount || 0),
      sendFee: new BN(state.sendFee || 0),
    };

    setSendErc20State(parsedState);
    return parsedState;
  }

  return {
    ...sendErc20State,
    txId,
    token,
    setValues(amount: string, address: string) {
      return request(sendErc20ValidateRequest(amount, token, address)).then(
        parseAndSetState
      );
    },
    reset() {
      setSendErc20State(undefined);
    },
    submit(amount: string) {
      return request(
        sendErc20SubmitRequest(
          amount,
          token,
          sendErc20State?.address as string,
          sendErc20State?.gasLimit as number
        )
      ).then(({ txId }: SendSubmitResponse) => setTxId(txId));
    },
  };
}
