import { useState } from 'react';
import { BN, ChainIdType, Utils } from '@avalabs/avalanche-wallet-sdk';
import {
  SendAntState,
  SendSubmitResponse,
} from '@avalabs/wallet-react-components';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { sendAntValidateRequest } from '@src/background/services/send/sendAnt/utils/sendAntValidateRequest';
import { sendAntSubmitRequest } from '@src/background/services/send/sendAnt/utils/sendAntSubmitRequest';
import { AntWithBalance } from '@avalabs/wallet-react-components';
import { SendStateWithActions } from '../models';

export function useSendAnt(
  token?: AntWithBalance
): (SendStateWithActions & SendAntState) | null {
  const [sendAntState, setSendAntState] = useState<SendAntState>();
  const [txId, setTxId] = useState<string>();
  const { request } = useConnectionContext();

  function parseAndSetState(state: SendAntState) {
    const { amount } = state;

    const parsedState = {
      ...state,
      amount: new BN(amount || 0, 'hex'),
      sendFee: new BN(state.sendFee || 0, 'hex'),
      maxAmount: state.maxAmount && new BN(state.maxAmount, 'hex'),
    };

    setSendAntState(parsedState);

    return parsedState;
  }

  if (!token) {
    return null;
  }

  return {
    ...sendAntState,
    targetChain: 'X' as ChainIdType,
    token,
    txId,
    setValues(amount?: string, address?: string) {
      return request(sendAntValidateRequest(amount, address, token)).then(
        parseAndSetState
      );
    },
    reset() {
      setSendAntState(undefined);
    },
    submit() {
      if (!sendAntState) {
        return Promise.reject('send ant state undefined');
      }

      const amount = Utils.bnToBig(
        sendAntState?.amount || new BN(0),
        token.denomination
      ).toString();

      return request<SendSubmitResponse>(
        sendAntSubmitRequest(amount, sendAntState?.address, token)
      ).then(({ txId }: SendSubmitResponse) => setTxId(txId));
    },
  };
}
