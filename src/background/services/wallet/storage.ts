import { clearMnemonic } from '@avalabs/wallet-react-components';
import { resolve } from '@src/utils/promiseResolver';
import {
  getFromStorage,
  removeFromStorage,
  saveToStorage,
} from '@src/utils/storage/chrome-storage';
const WALLET_STORAGE_KEY = 'wallet';
const WALLET_DERIVE_KEY_SALT =
  'C&YM&IHy41!NtaLwUL3NDXZU1KyDkLG0OfWY9U!z1roixz8T*wxwG*YoM2XsYels2';

/**
 * Derives a CryptoKey from the password based
 * Using derivation to make brute-force attacks harder
 */
async function deriveKey(password: string) {
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
      salt: Buffer.from(WALLET_DERIVE_KEY_SALT),
    },
    key,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export function getMnemonicFromStorage() {
  return getFromStorage(WALLET_STORAGE_KEY).then(
    (store) =>
      store && store[WALLET_STORAGE_KEY] && store[WALLET_STORAGE_KEY].mnemonic
  );
}

function getIVFromStorage() {
  return getFromStorage(WALLET_STORAGE_KEY).then(
    (store) =>
      store && store[WALLET_STORAGE_KEY] && store[WALLET_STORAGE_KEY].iv
  );
}

export async function saveMnemonicToStorage(
  mnemonic: string,
  password: string
) {
  const key = await deriveKey(password);
  // generate initialization vektor for AES-GCM, used to randomize the encryption
  // this value is needed for the decription but it doesn't have to be encrypted itself
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  // use authenticated encryption to check data integrity at decryption
  const cipher: ArrayBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(mnemonic)
  );

  // store the Uint8Arrays of the cipher and iv
  // Uint8Array cannot be saved to the storage, needs to be converted to a regular array first
  return saveToStorage({
    [WALLET_STORAGE_KEY]: {
      mnemonic: Array.from(new Uint8Array(cipher)),
      iv: Array.from(iv),
    },
  });
}

export async function decryptMnemonicInStorage(password: string) {
  try {
    // get decription key, cipher and the initialization vector
    const key = await deriveKey(password);
    const [cipher, errCipher] = await resolve(getMnemonicFromStorage());
    const [iv, errIV] = await resolve(getIVFromStorage());

    // any one of the pieces is missing, the mnemonic is not decryptable
    if (errCipher || errIV) return Promise.reject(errCipher ?? errIV);
    if (!cipher || !iv) return Promise.reject(new Error('mnemonic not found'));

    // throws error when using the wrong key
    const bytes: ArrayBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: Uint8Array.from(iv) },
      key,
      Uint8Array.from(cipher)
    );

    // return decoded text from arraybuffer
    return new TextDecoder().decode(bytes);
  } catch (err) {
    console.error(err);
    return Promise.reject(new Error('password incorrect'));
  }
}

export async function removeWalletFromStorage() {
  clearMnemonic();
  return removeFromStorage(WALLET_STORAGE_KEY);
}
