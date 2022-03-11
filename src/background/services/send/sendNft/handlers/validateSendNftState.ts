import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import {
  wallet$,
  checkAndValidateSendNft,
} from '@avalabs/wallet-react-components';
import { firstValueFrom, map, Observable, of, startWith, Subject } from 'rxjs';
import { gasPrice$ } from '@src/background/services/gas/gas';
import { hexToBN } from '@src/utils/hexToBN';
import { GasPrice } from '@src/background/services/gas/models';

async function validateSendNftState(request: ExtensionConnectionMessage) {
  const params = request.params || [];
  const [contractAddress, tokenId, address, gasPrice, gasLimit] = params;

  if (!contractAddress) {
    return {
      ...request,
      error: 'no contractAddress in params',
    };
  }

  if (!tokenId) {
    return {
      ...request,
      error: 'no contractAddress in params',
    };
  }

  const result = await firstValueFrom(
    checkAndValidateSendNft(
      contractAddress,
      Number(tokenId),
      gasPrice$.pipe(
        map((gas) => {
          return gasPrice?.bn
            ? { bn: hexToBN(gasPrice.bn), value: gasPrice.value }
            : gas;
        })
      ) as Observable<GasPrice>,
      of(address).pipe(startWith('')) as Subject<string>,
      wallet$,
      of(gasLimit) as Subject<number>
    )
  );

  return {
    ...request,
    result,
  };
}

export const ValidateSendNFTStateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.SEND_NFT_VALIDATE, validateSendNftState];
