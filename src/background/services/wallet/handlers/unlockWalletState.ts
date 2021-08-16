import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';
import { decryptMnemonicInStorage } from '../storage';
import { mnemonicWalletUnlock } from '../mnemonicWalletUnlock';

export async function unlockWalletState(request: ExtensionConnectionMessage) {
  const params = request.params;

  if (!params) {
    return {
      ...request,
      error: new Error('params missing from request'),
    };
  }

  const password = params.pop();

  if (!password) {
    return {
      ...request,
      error: new Error('password missing for request'),
    };
  }

  const [decryptedMnemonic, err] = await resolve(
    decryptMnemonicInStorage(password)
  );

  if (err) {
    return {
      ...request,
      error: err,
    };
  }
  mnemonicWalletUnlock.next({ mnemonic: decryptedMnemonic });

  return {
    ...request,
    result: true,
  };
}

export const UnlockWalletStateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.WALLET_UNLOCK_STATE, unlockWalletState];
