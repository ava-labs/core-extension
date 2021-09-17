import { useState } from 'react';
import { SendAvaxState } from '@avalabs/wallet-react-components';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { sendAvaxValidateRequest } from '@src/background/services/sendAvax/utils/sendAvaxValidateRequest';
import { BN, ChainIdType } from '@avalabs/avalanche-wallet-sdk';
import { sendAvaxResetRequest } from '@src/background/services/sendAvax/utils/sendAvaxResetRequest';
import { sendAvaxSubmitRequest } from '@src/background/services/sendAvax/utils/sendAvaxSubmitRequest';

export function useSendAvax() {
  const [sendAvaxState, setSendAvaxState] = useState<
    SendAvaxState & { error: { message: string } }
  >();
  const [txId, setTxId] = useState<string>();
  const { request } = useConnectionContext();

  function parseAndSetState(state: SendAvaxState) {
    const parsedState = {
      ...state,
      amount:
        state?.amount || sendAvaxState?.amount
          ? new BN(state?.amount || sendAvaxState?.amount || 0)
          : undefined,
      error: state.error ? { message: state.error } : undefined,
    };

    setSendAvaxState(parsedState as any);
    return parsedState;
  }

  return {
    ...sendAvaxState,
    txId,
    setValues(amount?: BN, address?: string) {
      return request(sendAvaxValidateRequest(amount, address))
        .then(parseAndSetState)
        .catch((error: string) => {
          setSendAvaxState({
            ...sendAvaxState,
            error: { message: error },
          } as any);
        });
    },
    reset() {
      return request(sendAvaxResetRequest()).then((state) =>
        parseAndSetState(state)
      );
    },
    submit() {
      return request(
        sendAvaxSubmitRequest(
          sendAvaxState?.amount as BN,
          sendAvaxState?.targetChain as ChainIdType,
          sendAvaxState?.address as string
        )
      ).then((hash) => {
        setTxId(hash);
        return hash;
      });
    },
  };
}
