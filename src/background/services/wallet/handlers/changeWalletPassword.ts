import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';
import {
  decryptPhraseOrKeyInStorage,
  decryptStorageKeyInStorage,
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

  const [decrypted, errPhrase] = await resolve(
    decryptPhraseOrKeyInStorage(oldPassword)
  );

  const [storageKey, errStorageKey] = await resolve(
    decryptStorageKeyInStorage(oldPassword)
  );

  if (errPhrase || errStorageKey) {
    return {
      ...request,
      error: errPhrase ? errPhrase.toString() : errStorageKey.toString(),
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
    storageKey,
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
