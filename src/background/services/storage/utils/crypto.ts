import nacl from 'tweetnacl';
import { scrypt } from '@noble/hashes/scrypt';
import { sha256 } from '@noble/hashes/sha256';

/**
 * Derives the encryption key from the password
 */
function deriveKey(password: string | Uint8Array, salt: Uint8Array) {
  // takes about 150ms on an i9 mbp, bumping it up to 2 ** 16 would be better but it slows down UX way to much
  return scrypt(password, salt, { N: 2 ** 15, r: 8, p: 1, dkLen: 32 });
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
}> {
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const encryptionKey = await deriveKey(password, salt);

  const { cypher, nonce } = await encryptWithKey({ secret, encryptionKey });

  encryptionKey.fill(0);

  return {
    salt,
    cypher,
    nonce,
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
    key = await deriveKey(encryptionKey, salt);
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
}: {
  cypher: Uint8Array;
  password: string;
  salt: Uint8Array;
  nonce: Uint8Array;
}): Promise<string> {
  const encryptionKey = await deriveKey(password, salt);

  try {
    return decryptWithKey({ cypher, encryptionKey, nonce });
  } finally {
    encryptionKey.fill(0);
  }
}
