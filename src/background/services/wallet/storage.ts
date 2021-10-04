import { resolve } from '@src/utils/promiseResolver';
import {
  getFromStorage,
  removeFromStorage,
  saveToStorage,
} from '@src/utils/storage/chrome-storage';
import { AES, enc } from 'crypto-js';
const WALLET_STORAGE_KEY = 'wallet';

export function getMnemonicFromStorage() {
  return getFromStorage(WALLET_STORAGE_KEY).then(
    (store) =>
      store && store[WALLET_STORAGE_KEY] && store[WALLET_STORAGE_KEY].mnemonic
  );
}

export function saveMnemonicToStorage(mnemonic: string, password: string) {
  const cipher = AES.encrypt(mnemonic, password).toString();
  return saveToStorage({ [WALLET_STORAGE_KEY]: { mnemonic: cipher } });
}

export async function decryptMnemonicInStorage(password: string) {
  try {
    /**
     * For some reason errors are diff depending on the length of the password
     * how many times its been ran. Not quite sure but we put in EXTRA protection
     * just in case.
     */
    const [cipher, err] = await resolve(getMnemonicFromStorage());
    if (err) return Promise.reject(err);
    if (!cipher) return Promise.reject(new Error('password incorrect'));
    const bytes = AES.decrypt(cipher, password);
    return bytes.toString(enc.Utf8);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function removeWalletFromStorage() {
  return removeFromStorage(WALLET_STORAGE_KEY);
}
