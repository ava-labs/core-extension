import { BitcoinProviderAbstract, createPsbt } from '@avalabs/core-wallets-sdk';
import { CryptoPSBT } from '@keystonehq/bc-ur-registry-eth';
import KeystoneUSBEthSDK from '@keystonehq/hw-app-eth';
import { Psbt, Transaction } from 'bitcoinjs-lib';
import { createKeystoneTransport } from '@keystonehq/hw-transport-webusb';
import { UREncoder } from '@ngraveio/bc-ur';

import { parseResponoseUR } from './KeystoneWallet';
import { BtcTransactionRequest } from '../wallet/models';
import { KeystoneTransport } from './models';

export class BitcoinKeystoneWallet {
  constructor(
    private fingerprint: string,
    private pubKey: Buffer,
    private keyPath: string,
    private keystoneTransport: KeystoneTransport,
    private provider: BitcoinProviderAbstract,
    private tabId?: number,
    private viaUSB?: boolean,
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

    if (outputs.length >= 2) {
      psbt.updateOutput(outputs.length - 1, {
        bip32Derivation: [
          {
            masterFingerprint: Buffer.from(this.fingerprint, 'hex'),
            pubkey: this.pubKey,
            path: this.keyPath,
          },
        ],
      });
    }

    const cryptoPSBT = new CryptoPSBT(psbt.toBuffer());
    const ur = cryptoPSBT.toUR();

    const formatResult = (_psbt: Psbt) => {
      if (_psbt.validateSignaturesOfAllInputs()) {
        _psbt.finalizeAllInputs();
        return _psbt.extractTransaction();
      }
      return _psbt.extractTransaction();
    };

    if (this.viaUSB) {
      const app = new KeystoneUSBEthSDK(
        (await createKeystoneTransport()) as any,
      );
      const encodedUR = new UREncoder(ur!, Infinity).nextPart().toUpperCase();
      const signedCborBuffer = parseResponoseUR(
        (await app.signTransactionFromUr(encodedUR)).payload,
      ).cbor;

      const signedTx = CryptoPSBT.fromCBOR(signedCborBuffer).getPSBT();

      return formatResult(Psbt.fromBuffer(signedTx));
    }

    const signedCborBuffer = await this.keystoneTransport.requestSignature(
      {
        type: ur.type,
        cbor: ur.cbor.toString('hex'),
      },
      this.tabId,
    );

    const signedTx = CryptoPSBT.fromCBOR(signedCborBuffer).getPSBT();

    return Psbt.fromBuffer(signedTx).extractTransaction();
  }
}
