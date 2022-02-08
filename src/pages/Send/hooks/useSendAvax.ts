import { useCallback, useState } from 'react';
import { AVAX_TOKEN, SendState } from '@avalabs/wallet-react-components';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { sendAvaxValidateRequest } from '@src/background/services/send/sendAvax/utils/sendAvaxValidateRequest';
import { BN, ChainIdType, bnToBig } from '@avalabs/avalanche-wallet-sdk';
import { sendAvaxSubmitRequest } from '@src/background/services/send/sendAvax/utils/sendAvaxSubmitRequest';
import { SendStateWithActions, SetSendValuesParams } from '../models';

export function useSendAvax(): SendStateWithActions {
  const [sendAvaxState, setSendAvaxState] = useState<SendState>();
  const [txId, setTxId] = useState<string>();
  const { request } = useConnectionContext();

  const parseAndSetState = (state: SendState) => {
    const parsedState: SendState = {
      ...state,
      amount: state?.amount ? new BN(state?.amount, 'hex') : undefined,
      sendFee: new BN(state.sendFee || 0, 'hex'),
      maxAmount: state.maxAmount && new BN(state.maxAmount, 'hex'),
      gasPrice: state.gasPrice && new BN(state.gasPrice, 'hex'),
    };

    setSendAvaxState(parsedState);
    return parsedState;
  };

  const setValues = useCallback(
    ({
      amount,
      address,
      gasPrice,
      gasLimit,
    }: Omit<SetSendValuesParams, 'token'>) => {
      request(sendAvaxValidateRequest(amount, address, gasPrice, gasLimit))
        .then(parseAndSetState)
        .catch((error: string) => {
          setSendAvaxState({ error: { message: error } } as SendState);
        });
    },
    [request]
  );

  return {
    ...sendAvaxState,
    txId,
    setValues,
    reset() {
      setSendAvaxState(undefined);
    },
    submit() {
      const amount = bnToBig(
        sendAvaxState?.amount || new BN(0),
        AVAX_TOKEN.denomination
      ).toString();
      return request(
        sendAvaxSubmitRequest(
          amount,
          sendAvaxState?.targetChain as ChainIdType,
          sendAvaxState?.address as string,
          sendAvaxState?.gasPrice as BN,
          sendAvaxState?.gasLimit as number
        )
      ).then(({ txId }) => {
        setTxId(txId);
        return txId;
      });
    },
  };
}
