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
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { Utils, WalletType } from '@avalabs/avalanche-wallet-sdk';

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

  const result = await lastValueFrom(
    sendAntSubmit(
      Promise.resolve<WalletType>(wallet),
      token,
      Utils.stringToBN(amount, (token as AntWithBalance).denomination),
      address
    )
  );
  return { ...request, result };
}

export const SubmitSendAntStateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.SEND_ANT_SUBMIT, submitSendAntState];
