import nacl from 'tweetnacl';
import { scrypt } from '@noble/hashes/scrypt';

/**
 * Derives the encryption key from the password
 */
async function deriveKey(password: string, salt: Uint8Array) {
  // takes about 150ms on an i9 mbp, bumping it up to 2 ** 16 would be better but it slows down UX way to much
  return scrypt(password, salt, { N: 2 ** 15, r: 8, p: 1, dkLen: 32 });
}

export async function encrypt(
  secret: string,
  encryptionKey: string,
  derive = true
): Promise<{ cypher: Uint8Array; nonce: Uint8Array; salt: Uint8Array }> {
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const key =
    derive || encryptionKey.length !== 32
      ? await deriveKey(encryptionKey, salt)
      : Buffer.from(encryptionKey);
  // generate initialization vektor, used to randomize the encryption
  // this value is needed for the decription but it doesn't have to be encrypted itself
  const nonce = crypto.getRandomValues(new Uint8Array(24));

  const cypher = nacl.secretbox(new TextEncoder().encode(secret), nonce, key);

  key.fill(0);

  return {
    cypher,
    nonce,
    salt,
  };
}

export async function decrypt(
  cypher: Uint8Array,
  encryptionKey: string,
  salt: Uint8Array,
  nonce: Uint8Array,
  derive = true
): Promise<string> {
  const key =
    derive || encryptionKey.length !== 32
      ? await deriveKey(encryptionKey, salt)
      : Buffer.from(encryptionKey);
  try {
    // throws error when using the wrong key
    const bytes = nacl.secretbox.open(cypher, nonce, key);

    if (bytes === null) {
      throw Error('decryption failed');
    }

    return new TextDecoder().decode(bytes);
  } finally {
    key.fill(0);
  }
}

export async function generateKey(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return await deriveKey(password, salt);
}
