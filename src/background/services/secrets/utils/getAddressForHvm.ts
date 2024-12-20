import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';

const ED25519_AUTH_ID = 0x00;

const addressBytesFromPubKey = (pubKey: Uint8Array): Uint8Array => {
  return new Uint8Array([ED25519_AUTH_ID, ...sha256(pubKey)]);
};

export const getAddressForHvm = (pubKey: any) => {
  const addressBytes = addressBytesFromPubKey(pubKey);
  const hash = sha256(addressBytes);
  const checksum = hash.slice(-4); // Take last 4 bytes
  return '0x' + bytesToHex(addressBytes) + bytesToHex(checksum);
};
