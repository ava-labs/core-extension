import { clearWallet } from '@avalabs/wallet-react-components';
import { resolve } from '@src/utils/promiseResolver';
import {
  getFromStorage,
  removeFromStorage,
  saveToStorage,
} from '@src/utils/storage/chrome-storage';
const WALLET_STORAGE_KEY = 'wallet';

/**
 * Derives a CryptoKey from the password based
 * Using derivation to make brute-force attacks harder
 */
async function deriveKey(password: string, salt: ArrayBuffer) {
  // import password and create a PBKDF2 key
  const key = await crypto.subtle.importKey(
    'raw',
    Buffer.from(password),
    {
      name: 'PBKDF2',
    },
    false, // key is not extractable
    ['deriveKey'] // this key can only be used for deriving new keys
  );

  // derive AES-GCM key from the PBKDF2 using 100k iterations
  // the key can only be used for decryption and encryption
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      hash: { name: 'SHA-256' },
      iterations: 100000,
      salt: salt,
    },
    key,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export function getMnemonicFromStorage() {
  return getFromStorage(WALLET_STORAGE_KEY).then((store) => {
    return (
      store && store[WALLET_STORAGE_KEY] && store[WALLET_STORAGE_KEY].mnemonic
    );
  });
}
/**
 * @returns the public key of the ledger used
 */
export function getPublicKeyFromStorage() {
  return getFromStorage(WALLET_STORAGE_KEY).then((store) => {
    return (
      store && store[WALLET_STORAGE_KEY] && store[WALLET_STORAGE_KEY].pubKey
    );
  });
}

function getEncryptionParamsFromStorage() {
  return getFromStorage(WALLET_STORAGE_KEY).then(
    (store) =>
      store &&
      store[WALLET_STORAGE_KEY] && {
        iv: store[WALLET_STORAGE_KEY].iv,
        salt: store[WALLET_STORAGE_KEY].salt,
      }
  );
}

export async function savePhraseOrKeyToStorage({
  password,
  mnemonic,
  pubKey,
}: {
  password: string;
  mnemonic?: string;
  pubKey?: string;
}) {
  const salt = window.crypto.getRandomValues(new Uint8Array(32));
  const key = await deriveKey(password, salt);
  // generate initialization vektor for AES-GCM, used to randomize the encryption
  // this value is needed for the decription but it doesn't have to be encrypted itself
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  // use authenticated encryption to check data integrity at decryption
  const cipher: ArrayBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(mnemonic || pubKey)
  );

  // store the Uint8Arrays of the cipher and iv
  // Uint8Array cannot be saved to the storage, needs to be converted to a regular array first
  return saveToStorage({
    [WALLET_STORAGE_KEY]: {
      ...(mnemonic
        ? { mnemonic: Array.from(new Uint8Array(cipher)) }
        : { pubKey: Array.from(new Uint8Array(cipher)) }),
      iv: Array.from(iv),
      salt: Array.from(salt),
    },
  });
}

export async function decryptPhraseOrKeyInStorage(password: string) {
  try {
    const [params, errParams] = await resolve(getEncryptionParamsFromStorage());

    if (errParams || !params.iv || !params.salt) {
      return Promise.reject(new Error('mnemonic or public key not found'));
    }

    // get decription key, cipher and the initialization vector
    const key = await deriveKey(password, Uint8Array.from(params.salt));
    const [mnemonicCipher, errMnemonicCipher] = await resolve(
      getMnemonicFromStorage()
    );
    const [publicKeyCipher, errPublicKeyCipher] = await resolve(
      getPublicKeyFromStorage()
    );

    // any one of the pieces is missing, the mnemonic is not decryptable
    if (errMnemonicCipher && errPublicKeyCipher)
      return Promise.reject(errMnemonicCipher || errPublicKeyCipher);
    if (!mnemonicCipher && !publicKeyCipher)
      return Promise.reject(new Error('mnemonic or public key not found'));

    // throws error when using the wrong key
    const bytes: ArrayBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: Uint8Array.from(params.iv) },
      key,
      Uint8Array.from(mnemonicCipher ?? publicKeyCipher)
    );

    // return decoded text from arraybuffer
    return new TextDecoder().decode(bytes);
  } catch (err) {
    console.error(err);
    return Promise.reject(new Error('password incorrect'));
  }
}

export async function removeWalletFromStorage() {
  console.log('wallet being locked and cleared: removeStorage');
  clearWallet();
  return removeFromStorage(WALLET_STORAGE_KEY);
}
