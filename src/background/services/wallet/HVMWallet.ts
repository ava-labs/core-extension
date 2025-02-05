import type { DerivationPath } from '@avalabs/core-wallets-sdk';
import { getWalletFromMnemonic } from '@avalabs/core-wallets-sdk';
import { ed25519 } from '@noble/curves/ed25519';
import { strip0x } from '@avalabs/core-utils-sdk';
import { base58 } from '@scure/base';
import type { TransactionPayload } from 'hypersdk-client/dist/types';
import type { VMABI } from 'hypersdk-client/dist/Marshaler';
import { ED25519_AUTH_ID, Marshaler } from 'hypersdk-client/dist/Marshaler';

export class HVMWallet {
  #privateKey: string;
  static fromMnemonic(
    mnemonic: string,
    accountIndex: number,
    derivationPath: DerivationPath,
  ) {
    const signer = getWalletFromMnemonic(
      mnemonic,
      accountIndex,
      derivationPath,
    );
    return new HVMWallet(signer.privateKey);
  }
  constructor(privateKey: string) {
    this.#privateKey = strip0x(privateKey);
  }

  async signEd25519(
    txPayload: TransactionPayload,
    abi: VMABI,
  ): Promise<string> {
    const marshaler = new Marshaler(abi);
    const digest = marshaler.encodeTransaction(txPayload);

    const signature = ed25519.sign(digest, this.#privateKey);

    const pubKey = this.getPublicKey();

    const sign = new Uint8Array([
      ...digest,
      ED25519_AUTH_ID,
      ...pubKey,
      ...signature,
    ]);
    return base58.encode(sign);
  }

  getPublicKey(): Uint8Array {
    return ed25519.getPublicKey(this.#privateKey);
  }
}
