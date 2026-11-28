import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex, utf8ToBytes } from '@noble/hashes/utils';

/**
 * SHA-256 of a UTF-8 string, hex encoded. Used to compare clipboard content
 * with a copied secret without handing the secret itself to other contexts.
 */
export const sha256Hex = (text: string): string =>
  bytesToHex(sha256(utf8ToBytes(text)));
