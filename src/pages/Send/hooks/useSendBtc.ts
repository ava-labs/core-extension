import { BN, bnToBig, ChainIdType } from '@avalabs/avalanche-wallet-sdk';
import { hexToBN } from '@avalabs/utils-sdk';
import { SendState } from '@avalabs/wallet-react-components';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { TokenWithBalance } from '@src/background/services/balances/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useCallback, useState } from 'react';
import { SendStateWithActions, SetSendValuesParams } from '../models';

export function useSendBtc(
  selectedToken?: TokenWithBalance
): SendStateWithActions {
  const [sendBtcState, setSendBtcState] = useState<SendState>();
  const [txId, setTxId] = useState<string>();
  const { request } = useConnectionContext();

  const denomination = selectedToken?.decimals || 0;

  const setValues = useCallback(
    async (values: SetSendValuesParams) => {
      const updatedState = await request({
        method: ExtensionRequest.SEND_BTC_VALIDATE,
        params: [values],
      });
      setSendBtcState(deserializeState(updatedState));
    },
    [request]
  );

  const reset = useCallback(() => {
    setSendBtcState(undefined);
  }, []);

  const submit = useCallback(async () => {
    if (!sendBtcState) return Promise.resolve('');

    const amount = bnToBig(sendBtcState.amount || new BN(0), denomination);
    const address = sendBtcState?.address;

    const { txId } = await request({
      method: ExtensionRequest.SEND_BTC_SUBMIT,
      params: [amount, address, selectedToken],
    });
    setTxId(txId);
    return txId;
  }, [denomination, request, selectedToken, sendBtcState]);

  return {
    ...sendBtcState,
    // todo needed?
    targetChain: 'C' as ChainIdType,
    txId,
    setValues,
    reset,
    submit,
  };
}

type SerializedSendState = Omit<
  SendState,
  'amount' | 'maxAmount' | 'sendFee'
> & {
  amount: string;
  maxAmount: string;
  sendFee: string;
};

function deserializeState(serializedState: SerializedSendState) {
  return {
    ...serializedState,
    amount: hexToBN(serializedState.amount),
    maxAmount: hexToBN(serializedState.maxAmount),
    sendFee: hexToBN(serializedState.sendFee),
  };
}
