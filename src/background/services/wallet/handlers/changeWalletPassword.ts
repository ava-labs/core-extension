import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';
import {
  decryptPhraseOrKeyInStorage,
  getMnemonicFromStorage,
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

  const hasMnemonicInStorage = !!(await getMnemonicFromStorage());

  const [decrypted, err] = await resolve(
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

  await savePhraseOrKeyToStorage({
    password: newPassword,
    [hasMnemonicInStorage ? `mnemonic` : `pubKey`]: decrypted,
  });

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
