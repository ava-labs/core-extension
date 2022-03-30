import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';
import { saveToSessionStorage } from '@src/utils/storage/session-storage';
import { SessionAuthData, SESSION_AUTH_DATA_KEY } from '../models';
import {
  decryptPhraseOrKeyInStorage,
  decryptStorageKeyInStorage,
} from '../storage';
import { storageKey$ } from '../storageKey';
import { walletUnlock$ } from '../walletUnlock';

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
  const [value, err] = await resolve(decryptPhraseOrKeyInStorage(password));
  const [storageKey, errStorageKey] = await resolve(
    decryptStorageKeyInStorage(password)
  );
  if (err || errStorageKey) {
    return {
      ...request,
      error: err || errStorageKey,
    };
  }
  // set storage key first so we can load data from storage for unlock
  storageKey$.next(storageKey);
  walletUnlock$.next({ value });
  const sessionData: SessionAuthData = {
    password,
    loginTime: Date.now(),
  };
  await saveToSessionStorage(SESSION_AUTH_DATA_KEY, sessionData);
  return {
    ...request,
    result: true,
  };
}

export const UnlockWalletStateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.WALLET_UNLOCK_STATE, unlockWalletState];
