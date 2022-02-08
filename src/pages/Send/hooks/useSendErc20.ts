import { useCallback, useState } from 'react';
import { SendErc20State, ERC20 } from '@avalabs/wallet-react-components';
import { BN, ChainIdType, bnToBig } from '@avalabs/avalanche-wallet-sdk';
import { sendErc20ValidateRequest } from '@src/background/services/send/sendErc20/utils/sendErc20ValidateRequest';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { sendErc20SubmitRequest } from '@src/background/services/send/sendErc20/utils/sendErc20SubmitRequest';
import { SendStateWithActions, SetSendValuesParams } from '../models';

export function useSendErc20(): // Make token optional since token is undefined while we're using `useSendAvax`
SendStateWithActions & Omit<SendErc20State, 'token'> & { token?: ERC20 } {
  const [sendErc20State, setSendErc20State] = useState<SendErc20State>();
  const [txId, setTxId] = useState<string>();
  const { request } = useConnectionContext();

  const parseAndSetState = (state: SendErc20State) => {
    const parsedState: SendErc20State = {
      ...state,
      amount: new BN(state.amount || 0, 'hex'),
      sendFee: new BN(state.sendFee || 0, 'hex'),
      maxAmount: state.maxAmount && new BN(state.maxAmount, 'hex'),
      gasPrice: state.gasPrice && new BN(state.gasPrice, 'hex'),
      token: {
        ...state.token,
        balance: new BN(state.token.balance, 'hex'),
      } as ERC20,
    };

    setSendErc20State(parsedState);
    return parsedState;
  };

  const setValues = useCallback(
    ({ token, amount, address, gasPrice, gasLimit }: SetSendValuesParams) => {
      request(
        sendErc20ValidateRequest(
          amount,
          token as ERC20,
          address,
          gasPrice,
          gasLimit
        )
      ).then(parseAndSetState);
    },
    [request]
  );

  return {
    ...sendErc20State,
    targetChain: 'C' as ChainIdType,
    txId,
    setValues,
    reset() {
      setSendErc20State(undefined);
    },
    submit() {
      if (!sendErc20State?.token) {
        return Promise.reject('Unable to identify token.');
      }

      const amount = bnToBig(
        sendErc20State?.amount || new BN(0),
        sendErc20State?.token.denomination
      ).toString();

      return request(
        sendErc20SubmitRequest(
          amount,
          sendErc20State?.token,
          sendErc20State?.address as string,
          sendErc20State?.gasLimit as number,
          sendErc20State?.gasPrice as BN
        )
      ).then(({ txId }) => {
        setTxId(txId);
        return txId;
      });
    },
  };
}
