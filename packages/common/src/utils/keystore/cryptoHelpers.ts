/**
 * Helper utilities for encryption and password hashing, browser-safe.
 * Encryption is using AES-GCM with a random public nonce.
 */

import { sha256 } from '@noble/hashes/sha256';
import { concatBytes, randomBytes, utf8ToBytes } from '@noble/hashes/utils';

const SALT_SIZE = 16;

const AES_LENGTH = 256;

const TAG_LENGTH = 128;

const KEYGEN_ITERATIONS_V3 = 200000; // v3 and and any version above

const makeSalt = () => randomBytes(SALT_SIZE);

export const getHash = (password: string, salt: Uint8Array): Uint8Array =>
  sha256(concatBytes(utf8ToBytes(password), salt));

export const calculatePasswordHash = (
  password: string,
  salt: Uint8Array,
): { salt: Uint8Array; hash: Uint8Array } => {
  let slt: Uint8Array;

  if (salt instanceof Uint8Array) {
    slt = salt;
  } else {
    slt = makeSalt();
  }

  const hash = getHash(password, getHash(password, slt));
  return { salt: slt, hash };
};

const importKey = async (pwkey: Uint8Array): Promise<CryptoKey> =>
  crypto.subtle.importKey('raw', pwkey, { name: 'PBKDF2' }, false, [
    'deriveKey',
  ]);

const deriveKey = async (
  keyMaterial: CryptoKey,
  salt: Uint8Array,
  iterations = KEYGEN_ITERATIONS_V3,
): Promise<CryptoKey> =>
  crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: AES_LENGTH },
    false,
    ['encrypt', 'decrypt'],
  );

export const decrypt = async (
  password: string,
  ciphertext: Uint8Array,
  salt: Uint8Array,
  iv: Uint8Array,
  keygenIterations?: number,
): Promise<Uint8Array> => {
  const pwkey = getHash(password, salt);
  const keyMaterial = await importKey(pwkey);
  const pkey = await deriveKey(keyMaterial, salt, keygenIterations);

  const pt = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv, // The initialization vector you used to encrypt
      additionalData: salt, // The additionalData you used to encrypt (if any)
      tagLength: TAG_LENGTH, // The tagLength you used to encrypt (if any)
    },
    pkey, // from importKey above
    ciphertext, // ArrayBuffer of the data
  );

  return new Uint8Array(pt);
};
