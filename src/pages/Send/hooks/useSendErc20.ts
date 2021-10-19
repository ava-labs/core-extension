import { useState } from 'react';
import {
  SendErc20State,
  ERC20,
  SendSubmitResponse,
} from '@avalabs/wallet-react-components';
import { BN, ChainIdType } from '@avalabs/avalanche-wallet-sdk';
import { sendErc20ValidateRequest } from '@src/background/services/send/sendErc20/utils/sendErc20ValidateRequest';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { sendErc20SubmitRequest } from '@src/background/services/send/sendErc20/utils/sendErc20SubmitRequest';
import { SendStateWithActions } from '../models';

export function useSendErc20(
  token?: ERC20
): (SendStateWithActions & SendErc20State) | null {
  const [sendErc20State, setSendErc20State] = useState<SendErc20State>();
  const [txId, setTxId] = useState<string>();
  const { request } = useConnectionContext();

  function parseAndSetState(state: SendErc20State) {
    const parsedState: SendErc20State = {
      ...state,
      amount: new BN(state.amount || sendErc20State?.amount || 0, 'hex'),
      sendFee: new BN(state.sendFee || 0, 'hex'),
      maxAmount: state.maxAmount && new BN(state.maxAmount, 'hex'),
      gasPrice: state.gasPrice && new BN(state.gasPrice, 'hex'),
    };

    setSendErc20State(parsedState);
    return parsedState;
  }

  if (!token) {
    return null;
  }

  return {
    ...sendErc20State,
    targetChain: 'C' as ChainIdType,
    txId,
    token,
    setValues(amount?: string, address?: string) {
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
