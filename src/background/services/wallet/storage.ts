import { decrypt, encrypt } from '@src/utils/crypto';
import { resolve } from '@src/utils/promiseResolver';
import {
  EncryptedData,
  getFromStorage,
  saveToStorage,
} from '@src/utils/storage/chrome-storage';

const WALLET_STORAGE_KEY = 'wallet';
const WALLET_STORAGE_ENCRYPTION_KEY = 'WALLET_STORAGE_ENCRYPTION_KEY';

export function getMnemonicFromStorage() {
  return getFromStorage(WALLET_STORAGE_KEY).then((data) => {
    return data && data.mnemonic;
  });
}
/**
 * @returns the public key of the ledger used
 */
export function getPublicKeyFromStorage() {
  return getFromStorage(WALLET_STORAGE_KEY).then((data) => {
    return data && data.pubKey;
  });
}

function getEncryptionParamsFromStorage() {
  return getFromStorage(WALLET_STORAGE_KEY).then(
    (data) =>
      data && {
        nonce: data.nonce,
        salt: data.salt,
      }
  );
}

export async function savePhraseOrKeyToStorage({
  password,
  mnemonic,
  pubKey,
  storageKey,
}: {
  password: string;
  mnemonic?: string;
  pubKey?: string;
  storageKey: string;
}) {
  const storageKeyData = await encrypt(storageKey, password);

  // store the Uint8Arrays of the cipher and nonce
  // Uint8Array cannot be saved to the storage, needs to be converted to a regular array first
  await saveToStorage(
    WALLET_STORAGE_ENCRYPTION_KEY,
    {
      cypher: Array.from(storageKeyData.cypher),
      nonce: Array.from(storageKeyData.nonce),
      salt: Array.from(storageKeyData.salt),
    },
    false // we are using the password to encrypt instead of the storageKey for this one
  );

  const walletData = await encrypt(mnemonic || pubKey || '', password);

  // store the Uint8Arrays of the cipher and nonce
  // Uint8Array cannot be saved to the storage, needs to be converted to a regular array first
  await saveToStorage(
    WALLET_STORAGE_KEY,
    {
      ...(mnemonic
        ? { mnemonic: Array.from(walletData.cypher) }
        : { pubKey: Array.from(walletData.cypher) }),
      nonce: Array.from(walletData.nonce),
      salt: Array.from(walletData.salt),
    },
    false // we are using the password to encrypt instead of the storageKey for this one
  );
}

export async function decryptPhraseOrKeyInStorage(password: string) {
  try {
    const [params, errParams] = await resolve(getEncryptionParamsFromStorage());

    if (errParams || !params.nonce || !params.salt) {
      return Promise.reject(new Error('mnemonic or public key not found'));
    }

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

    return await decrypt(
      Uint8Array.from(mnemonicCipher ?? publicKeyCipher),
      password,
      Uint8Array.from(params.salt),
      Uint8Array.from(params.nonce)
    );
  } catch (err) {
    console.error(err);
    return Promise.reject(new Error('password incorrect'));
  }
}

export async function decryptStorageKeyInStorage(password: string) {
  try {
    const [data, errdata] = await resolve(
      getFromStorage<EncryptedData>(WALLET_STORAGE_ENCRYPTION_KEY)
    );

    if (errdata || !data || !data.nonce || !data.salt || !data.cypher) {
      return Promise.reject(new Error('storage encryption key not found'));
    }

    return await decrypt(
      Uint8Array.from(data.cypher),
      password,
      Uint8Array.from(data.salt),
      Uint8Array.from(data.nonce)
    );
  } catch (err) {
    console.error(err);
    return Promise.reject(new Error('password incorrect'));
  }
}
