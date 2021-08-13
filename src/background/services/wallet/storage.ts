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
  const cipher = getMnemonicFromStorage();
  const bytes = AES.decrypt(cipher, password);
  return bytes.toString(enc.Utf8);
}

export async function removeWalletFromStorage() {
  return removeFromStorage(WALLET_STORAGE_KEY);
}
