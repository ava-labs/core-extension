import nacl from 'tweetnacl';
import { scrypt } from '@noble/hashes/scrypt';
import { sha256 } from '@noble/hashes/sha256';
import { KeyDerivationVersion } from '@core/types';
import argon2Browser from 'argon2-browser';

/**
 * Derives the encryption key from the password
 */
async function deriveKey(
  password: string | Uint8Array,
  salt: Uint8Array,
  keyDerivationVersion: KeyDerivationVersion,
): Promise<Uint8Array> {
  // takes about 150ms on an i9 mbp, bumping it up to 2 ** 16 would be better but it slows down UX way to much

  if (keyDerivationVersion === KeyDerivationVersion.V1) {
    return scrypt(password, salt, { N: 2 ** 15, r: 8, p: 1, dkLen: 32 });
  }

  const hashResult: { hash: Uint8Array; encoded: string; hashHex: string } =
    await argon2Browser.hash({
      // required
      pass: password,
      salt: salt,
      // optional
      time: 3, // the number of iterations
      parallelism: 1,
      mem: 2 ** 16, // 64 MiB
      hashLen: 32, // desired hash length
      type: argon2Browser.ArgonType.Argon2id,
    });

  return hashResult.hash;
}

export async function encryptWithPassword({
  secret,
  password,
}: {
  secret: string;
  password: string;
}): Promise<{
  cypher: Uint8Array;
  nonce: Uint8Array;
  salt: Uint8Array;
  keyDerivationVersion: KeyDerivationVersion;
}> {
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const encryptionKey = await deriveKey(
    password,
    salt,
    KeyDerivationVersion.V2,
  );

  const { cypher, nonce } = await encryptWithKey({ secret, encryptionKey });

  encryptionKey.fill(0);

  return {
    salt,
    cypher,
    nonce,
    keyDerivationVersion: KeyDerivationVersion.V2,
  };
}

export async function encryptWithKey({
  secret,
  encryptionKey,
}: {
  secret: string;
  encryptionKey: Uint8Array;
}): Promise<{ cypher: Uint8Array; nonce: Uint8Array }> {
  if (encryptionKey.length !== 32 && encryptionKey.length !== 64) {
    throw new Error('invalid encryption key');
  }

  // Legacy users have a 64 byte encryption key. Shorten it to 32 bytes via hashing so it can be used with secretbox
  const key =
    encryptionKey.length === 64 ? sha256(encryptionKey) : encryptionKey;

  // generate initialization vektor, used to randomize the encryption
  // this value is needed for the decription but it doesn't have to be encrypted itself
  const nonce = crypto.getRandomValues(new Uint8Array(24));

  const cypher = nacl.secretbox(new TextEncoder().encode(secret), nonce, key);

  return {
    cypher,
    nonce,
  };
}

export async function decryptWithKey({
  cypher,
  encryptionKey,
  nonce,
  salt,
}: {
  cypher: Uint8Array;
  encryptionKey: Uint8Array;
  nonce: Uint8Array;
  salt?: Uint8Array;
}): Promise<string> {
  // derived encryption keys are 32 bytes and the secretKey is 64 bytes
  if (encryptionKey.length !== 32 && encryptionKey.length !== 64) {
    throw new Error('invalid decryption key');
  }

  let key: Uint8Array;
  // If there is a salt provided we always need to derive the key
  if (salt && salt.length > 0) {
    // we have data for legacy users that has been encrypted with a hashed derivation key
    key = await deriveKey(encryptionKey, salt, KeyDerivationVersion.V1);
  } else if (encryptionKey.length === 64) {
    // legacy users have a 64 byte encryption key which is not supported by secretbox
    // shorten it to 32 bytes via hashing
    key = sha256(encryptionKey);
  } else {
    key = encryptionKey;
  }

  // throws error when using the wrong key
  const bytes = nacl.secretbox.open(cypher, nonce, key);

  if (bytes === null) {
    throw Error('decryption failed');
  }

  return new TextDecoder().decode(bytes);
}

export async function decryptWithPassword({
  cypher,
  password,
  salt,
  nonce,
  keyDerivationVersion,
}: {
  cypher: Uint8Array;
  password: string;
  salt: Uint8Array;
  nonce: Uint8Array;
  keyDerivationVersion: KeyDerivationVersion;
}): Promise<string> {
  const encryptionKey = await deriveKey(password, salt, keyDerivationVersion);

  try {
    return decryptWithKey({ cypher, encryptionKey, nonce });
  } finally {
    encryptionKey.fill(0);
  }
}
