import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';
import { decryptMnemonicInStorage, saveMnemonicToStorage } from '../storage';
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
    decryptMnemonicInStorage(oldPassword)
  );

  if (err) {
    return {
      ...request,
      error: err.toString(),
    };
  }

  await saveMnemonicToStorage(decryptedMnemonic, newPassword);

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
