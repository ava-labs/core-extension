import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import {
  AntWithBalance,
  sendAntSubmit,
  wallet$,
} from '@avalabs/wallet-react-components';
import { firstValueFrom, lastValueFrom, tap } from 'rxjs';
import { Utils, WalletType } from '@avalabs/avalanche-wallet-sdk';
import { sendTxDetails$ } from '../../events/sendTxDetailsEvent';
import { resolve } from '@src/utils/promiseResolver';

async function submitSendAntState(request: ExtensionConnectionMessage) {
  const params = request.params || [];
  const [token, amount, address] = params;

  if (!amount) {
    return {
      ...request,
      error: 'no amount in params',
    };
  }

  if (!token) {
    return {
      ...request,
      error: 'no token in params',
    };
  }

  if (!address) {
    return {
      ...request,
      error: 'no address in params',
    };
  }

  const wallet = await firstValueFrom(wallet$);

  if (!wallet) {
    return {
      ...request,
      error: 'wallet is undefined or malformed',
    };
  }

  return await resolve(
    lastValueFrom(
      sendAntSubmit(
        Promise.resolve<WalletType>(wallet),
        token,
        Utils.stringToBN(amount, (token as AntWithBalance).denomination),
        address
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

export const SubmitSendAntStateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.SEND_ANT_SUBMIT, submitSendAntState];
