import * as bip39 from 'bip39';
import { toBytes } from '@noble/hashes/utils';
import { base58check } from '@avalabs/avalanchejs-v2';

import {
  AccessWalletMultipleInput,
  AllKeyFileDecryptedTypes,
  AllKeyFileTypes,
  KeyFileDecryptedV2,
  KeyFileDecryptedV3,
  KeyFileDecryptedV4,
  KeyFileDecryptedV5,
  KeyFileDecryptedV6,
  KeyFileV2,
  KeyFileV3,
  KeyFileV4,
  KeyFileV5,
  KeyFileV6,
  KeystoreError,
} from './models';
import { getHash, decrypt, calculatePasswordHash } from './cryptoHelpers';

export const KEYSTORE_VERSION = '6.0';

const KEYGEN_ITERATIONS_V2 = 100000;

async function readV2(data: KeyFileV2, pass) {
  const version = data.version;

  const salt = base58check.decode(data.salt);

  const checkHash = getHash(pass, salt);
  const checkHashString = base58check.encode(toBytes(checkHash));

  if (checkHashString !== data.pass_hash) {
    throw KeystoreError.InvalidPassword;
  }

  const decryptedKeys = await Promise.all(
    data.keys.map(async (keyData) => {
      const key = base58check.decode(keyData.key);
      const nonce = base58check.decode(keyData.iv);

      const decryptedKey = await decrypt(
        pass,
        key,
        salt,
        nonce,
        KEYGEN_ITERATIONS_V2
      );

      return {
        key: base58check.encode(decryptedKey),
      };
    })
  );

  return {
    version,
    activeIndex: 0,
    keys: decryptedKeys,
  };
}
async function readV3(data: KeyFileV3, pass) {
  const version = data.version;

  const salt = base58check.decode(data.salt);

  const checkHash = await calculatePasswordHash(pass, salt);
  const checkHashString = base58check.encode(checkHash.hash);

  if (checkHashString !== data.pass_hash) {
    throw KeystoreError.InvalidPassword;
  }

  const decryptedKeys = await Promise.all(
    data.keys.map(async (keyData) => {
      const key = base58check.decode(keyData.key);
      const nonce = base58check.decode(keyData.iv);

      const decryptedKey = await decrypt(pass, key, salt, nonce);

      return {
        key: base58check.encode(decryptedKey),
      };
    })
  );

  return {
    version,
    activeIndex: 0,
    keys: decryptedKeys,
  };
}
async function readV4(data: KeyFileV4, pass): Promise<KeyFileDecryptedV5> {
  const version = data.version;

  const salt = base58check.decode(data.salt);
  const checkHash = await calculatePasswordHash(pass, salt);
  const checkHashString = base58check.encode(checkHash.hash);

  if (checkHashString !== data.pass_hash) {
    throw KeystoreError.InvalidPassword;
  }

  const decryptedKeys = await Promise.all(
    data.keys.map(async (keyData) => {
      const key = base58check.decode(keyData.key);
      const nonce = base58check.decode(keyData.iv);

      const decryptedKey = await decrypt(pass, key, salt, nonce);

      return {
        key: base58check.encode(decryptedKey),
      };
    })
  );

  return {
    version,
    activeIndex: 0,
    keys: decryptedKeys,
  };
}

async function readV5(data: KeyFileV5, pass): Promise<KeyFileDecryptedV5> {
  const version = data.version;

  const salt = base58check.decode(data.salt);

  const checkHash = await calculatePasswordHash(pass, salt);
  const checkHashString = base58check.encode(checkHash.hash);

  if (checkHashString !== data.pass_hash) {
    throw KeystoreError.InvalidPassword;
  }

  const decoder = new TextDecoder();

  const decryptedKeys = await Promise.all(
    data.keys.map(async (keyData) => {
      const key = base58check.decode(keyData.key);
      const nonce = base58check.decode(keyData.iv);

      return {
        key: decoder.decode(await decrypt(pass, key, salt, nonce)),
      };
    })
  );

  return {
    version,
    activeIndex: 0,
    keys: decryptedKeys,
  };
}

async function readV6(data: KeyFileV6, pass): Promise<KeyFileDecryptedV6> {
  const version = data.version;
  const activeIndex = data.activeIndex;

  const salt = base58check.decode(data.salt);
  const decoder = new TextDecoder();

  const decryptedKeys = await Promise.all(
    data.keys.map(async (keyData) => {
      const key = base58check.decode(keyData.key);
      const nonce = base58check.decode(keyData.iv);

      try {
        return {
          key: decoder.decode(await decrypt(pass, key, salt, nonce)),
          type: keyData.type,
        };
      } catch (e) {
        throw KeystoreError.InvalidPassword;
      }
    })
  );

  return {
    version,
    activeIndex: activeIndex || 0,
    keys: decryptedKeys,
  };
}

export async function readKeyFile(
  data: AllKeyFileTypes,
  pass: string
): Promise<AllKeyFileDecryptedTypes> {
  switch (data.version) {
    case '6.0':
      return await readV6(data as KeyFileV6, pass);
    case '5.0':
      return await readV5(data as KeyFileV5, pass);
    case '4.0':
      return await readV4(data as KeyFileV4, pass);
    case '3.0':
      return await readV3(data as KeyFileV3, pass);
    case '2.0':
      return await readV2(data as KeyFileV2, pass);
    default:
      throw KeystoreError.InvalidVersion;
  }
}

function extractKeysV2({
  keys,
}:
  | KeyFileDecryptedV2
  | KeyFileDecryptedV3
  | KeyFileDecryptedV4): AccessWalletMultipleInput[] {
  return keys.map((key) => {
    const keyBuf = Buffer.from(base58check.decode(key.key));
    const keyHex = keyBuf.toString('hex');
    const paddedKeyHex = keyHex.padStart(64, '0');
    const mnemonic = bip39.entropyToMnemonic(paddedKeyHex);

    return {
      key: mnemonic,
      type: 'mnemonic',
    };
  });
}

function extractKeysV5(file: KeyFileDecryptedV5): AccessWalletMultipleInput[] {
  return file.keys.map((key) => ({
    key: key.key,
    type: 'mnemonic',
  }));
}

function extractKeysV6(file: KeyFileDecryptedV6): AccessWalletMultipleInput[] {
  return file.keys.map((key) => ({
    type: key.type,
    key: key.key,
  }));
}

export function extractKeysFromDecryptedFile(
  file: AllKeyFileDecryptedTypes
): AccessWalletMultipleInput[] {
  switch (file.version) {
    case '6.0':
      return extractKeysV6(file as KeyFileDecryptedV6);
    case '5.0':
      return extractKeysV5(file as KeyFileDecryptedV5);
    case '4.0':
      return extractKeysV2(file as KeyFileDecryptedV4);
    case '3.0':
      return extractKeysV2(file as KeyFileDecryptedV3);
    case '2.0':
      return extractKeysV2(file as KeyFileDecryptedV2);
    default:
      throw KeystoreError.InvalidVersion;
  }
}
