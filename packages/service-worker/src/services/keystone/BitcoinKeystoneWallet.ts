import { BitcoinProviderAbstract, createPsbt } from '@avalabs/core-wallets-sdk';
import { CryptoPSBT } from '@keystonehq/bc-ur-registry-eth';
import { Psbt, Transaction } from 'bitcoinjs-lib';

import { BtcTransactionRequest } from '@core/types/src/models';
import { KeystoneTransport } from './models';

export class BitcoinKeystoneWallet {
  constructor(
    private fingerprint: string,
    private pubKey: Buffer,
    private keyPath: string,
    private keystoneTransport: KeystoneTransport,
    private provider: BitcoinProviderAbstract,
    private tabId?: number,
  ) {}

  async signTx(
    inputs: BtcTransactionRequest['inputs'],
    outputs: BtcTransactionRequest['outputs'],
  ): Promise<Transaction> {
    const psbt = createPsbt(inputs, outputs, this.provider.getNetwork());

    inputs.forEach((_, index) => {
      psbt.updateInput(index, {
        bip32Derivation: [
          {
            masterFingerprint: Buffer.from(this.fingerprint, 'hex'),
            pubkey: this.pubKey,
            path: this.keyPath,
          },
        ],
      });
    });

    const cryptoPSBT = new CryptoPSBT(psbt.toBuffer());
    const { type, cbor } = cryptoPSBT.toUR();

    const signedCborBuffer = await this.keystoneTransport.requestSignature(
      {
        type,
        cbor: cbor.toString('hex'),
      },
      this.tabId,
    );

    const signedTx = CryptoPSBT.fromCBOR(signedCborBuffer).getPSBT();

    return Psbt.fromBuffer(signedTx).extractTransaction();
  }
}
