import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';
import {
  decryptPhraseOrKeyInStorage,
  savePhraseOrKeyToStorage,
} from '../storage';
import { restartWalletLock$ } from '../walletLocked';

export async function changeWalletPassword(
  request: ExtensionConnectionMessage
) {
  const [newPassword, oldPassword] = request.params || [];

  if (!newPassword) {
    return {
      ...request,
      error: 'new password missing for request',
    };
  }

  if (!oldPassword) {
    return {
      ...request,
      error: 'old password missing for request',
    };
  }

  const [decryptedMnemonic, err] = await resolve(
    decryptPhraseOrKeyInStorage(oldPassword)
  );

  if (err) {
    return {
      ...request,
      error: err.toString(),
    };
  }

  if (oldPassword === newPassword) {
    return {
      ...request,
      error: 'New password is the same as the old',
    };
  }

  await savePhraseOrKeyToStorage(decryptedMnemonic, newPassword);

  restartWalletLock$.next(true);

  return {
    ...request,
    result: true,
  };
}

export const ChangeWalletPasswordRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.WALLET_CHANGE_PASSWORD, changeWalletPassword];
