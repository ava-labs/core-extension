import { KeyTypeApi, Secp256k1, Ed25519 } from '@cubist-labs/cubesigner-sdk';

export const REQUIRED_KEY_TYPES: KeyTypeApi[] = [Secp256k1.Evm];
export const OPTIONAL_KEY_TYPES: KeyTypeApi[] = [
  // {Secp256k1.Ava} becomes optional with the X/P account model change:
  // the user may have the legacy X/P keys derived, but the new ones may not be present yet.
  Secp256k1.Ava,
  Ed25519.Solana,
];

export const SUPPORTED_KEY_TYPES: KeyTypeApi[] = [
  ...REQUIRED_KEY_TYPES,
  ...OPTIONAL_KEY_TYPES,
];
