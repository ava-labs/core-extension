import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import {
  wallet$,
  sendNftSubmit,
  walletState$,
} from '@avalabs/wallet-react-components';
import { firstValueFrom, map, tap } from 'rxjs';
import { isWalletLocked } from '@src/background/services/wallet/models';
import { gasPrice$ } from '@src/background/services/gas/gas';
import { hexToBN } from '@src/utils/hexToBN';
import { WalletType } from '@avalabs/avalanche-wallet-sdk';
import { resolve } from '@src/utils/promiseResolver';
import { sendTxDetails$ } from '../../events/sendTxDetailsEvent';

async function submitSendNftState(request: ExtensionConnectionMessage) {
  const params = request.params || [];
  const [contractAddress, tokenId, address, gasLimit, customGasPrice] = params;

  if (!address) {
    return {
      ...request,
      error: 'no destinationAddress in params',
    };
  }

  if (!contractAddress) {
    return {
      ...request,
      error: 'no contractAddress in params',
    };
  }

  if (!tokenId) {
    return {
      ...request,
      error: 'no tokenId in params',
    };
  }

  if (!gasLimit) {
    return {
      ...request,
      error: 'no gas limit in params',
    };
  }

  const wallet = await firstValueFrom(wallet$);

  if (!wallet) {
    return {
      ...request,
      error: 'wallet malformed or undefined',
    };
  }

  const gasPrice = await firstValueFrom(
    gasPrice$.pipe(
      map((gas) => (customGasPrice ? { bn: hexToBN(customGasPrice) } : gas))
    )
  );

  if (!gasPrice?.bn) {
    return {
      ...request,
      error: 'gas price malformed or undefined',
    };
  }

  const walletState = await firstValueFrom(walletState$);

  if (walletState && isWalletLocked(walletState)) {
    return {
      ...request,
      error: 'wallet locked',
    };
  }

  return await resolve(
    firstValueFrom(
      sendNftSubmit(
        contractAddress,
        Number(tokenId),
        Promise.resolve<WalletType>(wallet),
        address,
        Promise.resolve(gasPrice),
        gasLimit
      ).pipe(tap((value) => sendTxDetails$.next(value)))
    )
  ).then(([result, error]) => {
    return {
      ...request,
      result: result || undefined,
      error: error ? error?.message || error.toString() : undefined,
    };
  });
}

export const SubmitSendNFTStateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.SEND_NFT_SUBMIT, submitSendNftState];
