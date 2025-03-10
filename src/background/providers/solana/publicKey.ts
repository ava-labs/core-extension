import { base58 } from '@scure/base';
import type { PublicKey } from '@solana/web3.js';

// The wallet adapters expect a PublicKey instance (from @solana/web3.js < 2.0.0),
// but we're already on v2.1.0.
// To just straight up satisfy this requirement, we'd have to either use the legacy
// @solana/web3.js package, which is already deprecated and has its own issues.
// So here, I'm importing only the PublicKey type from @solana/web3.js < 2.0.0
// and satisfying its interface with a custom implementation (minus the static
// methods, which we do not use anyway).
export const legacyPublicKey = (address: string): PublicKey => {
  const byteArray = Buffer.from(base58.decode(address));

  const publicKey = {
    get [Symbol.toStringTag]() {
      return `PublicKey(${this.toString()})`;
    },
    toBase58: () => address,
    toBuffer: () => byteArray,
    toBytes: () => byteArray,
    toJSON: () => address,
    toString: () => address,
    equals: (otherPubKey) => address === otherPubKey.toBase58(),
    encode: () => byteArray,
  } as const;

  return publicKey satisfies PublicKey;
};
