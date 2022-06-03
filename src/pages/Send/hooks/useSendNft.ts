import { useCallback, useState } from 'react';
import { BN } from '@avalabs/avalanche-wallet-sdk';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { SendStateWithActions } from '../models';
import { hexToBN } from '@src/utils/hexToBN';
import { sendNftValidateRequest } from '@src/background/services/send/sendNft/utils/sendNftValidateRequest';
import { sendNftResetRequest } from '@src/background/services/send/sendNft/utils/resetSendNftRequest';
import { sendNftSubmitRequest } from '@src/background/services/send/sendNft/utils/sendNftSubmitRequest';
import { SendNftState, SendState } from '@src/background/services/send/models';
import { BigNumber } from 'ethers';
import { ethersBigNumberToBN } from '@avalabs/utils-sdk';

export function useSendNft(
  contractAddress: string,
  tokenId: number
): SendStateWithActions & { sendState: SendNftState } {
  const [sendNftState, setSendNftState] = useState<SendNftState>();
  const { request } = useConnectionContext();

  const parseAndSetState = (state: SendNftState) => {
    const parsedState: SendNftState = {
      ...state,
      sendFee: hexToBN(state.sendFee || '0'),
      gasPrice: state.gasPrice && BigNumber.from(state.gasPrice),
    };

    setSendNftState(parsedState);
    return parsedState;
  };

  const setValues = useCallback(
    ({ address, gasPrice, gasLimit }: SendState) => {
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
    sendState: {
      ...sendNftState,
      contractAddress,
      tokenId,
    },
    updateSendState: setValues,
    resetSendState() {
      sendNftResetRequest(contractAddress, tokenId);
    },
    submitSendState() {
      if (!contractAddress) {
        return Promise.reject('Unable to identify token.');
      }

      return request(
        sendNftSubmitRequest(
          contractAddress,
          tokenId,
          sendNftState?.address as string,
          sendNftState?.gasLimit as number,
          sendNftState?.gasPrice
            ? ethersBigNumberToBN(sendNftState.gasPrice)
            : new BN(0)
        )
      ).then(({ txId }) => {
        return txId;
      });
    },
  };
}
