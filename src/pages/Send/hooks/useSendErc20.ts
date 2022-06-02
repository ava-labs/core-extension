import { useCallback, useState } from 'react';
import { SendErc20State } from '@avalabs/wallet-react-components';
import { BN, ChainIdType, bnToBig } from '@avalabs/avalanche-wallet-sdk';
import { sendErc20ValidateRequest } from '@src/background/services/send/sendErc20/utils/sendErc20ValidateRequest';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { sendErc20SubmitRequest } from '@src/background/services/send/sendErc20/utils/sendErc20SubmitRequest';
import { SendStateWithActions, SetSendValuesParams } from '../models';
import { hexToBN } from '@src/utils/hexToBN';
import { NetworkContractTokenWithBalance } from '@src/background/services/balances/models';

export function useSendErc20(): // Make token optional since token is undefined while we're using `useSendAvax`
SendStateWithActions &
  Omit<SendErc20State, 'token'> & { token?: NetworkContractTokenWithBalance } {
  const [sendErc20State, setSendErc20State] = useState<SendErc20State>();
  const [txId, setTxId] = useState<string>();
  const { request } = useConnectionContext();

  const parseAndSetState = (state: SendErc20State) => {
    const parsedState: SendErc20State = {
      ...state,
      amount: hexToBN(state.amount || '0'),
      sendFee: hexToBN(state.sendFee || '0'),
      maxAmount: state.maxAmount && hexToBN(state.maxAmount),
      gasPrice: state.gasPrice && hexToBN(state.gasPrice),
      token: {
        ...state.token,
        balance: hexToBN(state.token.balance),
      },
    };

    setSendErc20State(parsedState);
    return parsedState;
  };

  const setValues = useCallback(
    ({ token, amount, address, gasPrice, gasLimit }: SetSendValuesParams) => {
      request(
        sendErc20ValidateRequest(
          amount,
          token && {
            ...token,
            address: token.isERC20 ? token.address : '',
            logoURI: token?.logoUri,
            isErc20: token.isERC20,
            balanceParsed: token.balanceDisplayValue || '',
            denomination: token.decimals,
          },
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
    token: sendErc20State?.token && {
      ...sendErc20State.token,
      isERC20: true,
      isNetworkToken: false,
      contractType: 'ERC-20',
      decimals: sendErc20State.token.denomination,
      logoUri: sendErc20State.token.logoURI,
      description: '',
    },
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
