import { useCallback, useState } from 'react';
import { SendNftState } from '@avalabs/wallet-react-components';
import { BN } from '@avalabs/avalanche-wallet-sdk';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { SendStateWithActions, SetSendNftValuesParams } from '../models';
import { hexToBN } from '@src/utils/hexToBN';
import { sendNftValidateRequest } from '@src/background/services/send/sendNft/utils/sendNftValidateRequest';
import { sendNftResetRequest } from '@src/background/services/send/sendNft/utils/resetSendNftRequest';
import { sendNftSubmitRequest } from '@src/background/services/send/sendNft/utils/sendNftSubmitRequest';

export function useSendNft(
  contractAddress: string,
  tokenId: number
): SendStateWithActions & SendNftState {
  const [sendNftState, setSendNftState] = useState<SendNftState>();
  const [txId, setTxId] = useState<string>();
  const { request } = useConnectionContext();

  const parseAndSetState = (state: SendNftState) => {
    const parsedState: SendNftState = {
      ...state,
      sendFee: hexToBN(state.sendFee || '0'),
      gasPrice: state.gasPrice && hexToBN(state.gasPrice),
    };

    setSendNftState(parsedState);
    return parsedState;
  };

  const setValues = useCallback(
    ({ address, gasPrice, gasLimit }: SetSendNftValuesParams) => {
      console.log('VALIDATE');
      request(
        sendNftValidateRequest(
          contractAddress,
          tokenId,
          address,
          gasPrice,
          gasLimit
        )
      ).then(parseAndSetState);
    },
    [contractAddress, request, tokenId]
  );

  return {
    ...sendNftState,
    contractAddress,
    tokenId,
    txId,
    setValues,
    reset() {
      console.log('RESET');
      sendNftResetRequest(contractAddress, tokenId);
    },
    submit() {
      if (!contractAddress) {
        return Promise.reject('Unable to identify token.');
      }

      return request(
        sendNftSubmitRequest(
          contractAddress,
          tokenId,
          sendNftState?.address as string,
          sendNftState?.gasLimit as number,
          sendNftState?.gasPrice as BN
        )
      ).then(({ txId }) => {
        setTxId(txId);
        return txId;
      });
    },
  };
}
