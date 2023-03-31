import { TransactionRequest } from '@ethersproject/providers';
import { BN } from 'bn.js';
import { BigNumber } from 'ethers';
import { Transaction } from '@ethereumjs/tx';
import Common from '@ethereumjs/common';
import {
  DataType,
  ETHSignature,
  EthSignRequest,
} from '@keystonehq/bc-ur-registry-eth';

import { rlp } from 'ethereumjs-util';
import {
  hexlify,
  resolveProperties,
  serializeTransaction,
  UnsignedTransaction,
} from 'ethers/lib/utils';
import { CBOR, KeystoneTransport } from './models';
import { convertTxData } from '../bridge/utils';

export class KeystoneWallet {
  constructor(
    private fingerprint: string,
    private activeAccountIndex: number,
    private keystoneTransport: KeystoneTransport,
    private chainId?: number,
    private tabId?: number
  ) {}

  async signTransaction(txRequest: TransactionRequest): Promise<string> {
    const cborBuffer = await this.keystoneTransport.requestSignature(
      this.buildSignatureRequest(
        txRequest,
        this.fingerprint,
        this.activeAccountIndex
      ),
      this.tabId
    );
    const signature = ETHSignature.fromCBOR(cborBuffer).getSignature();

    const r = hexlify(signature.slice(0, 32));
    const s = hexlify(signature.slice(32, 64));
    const v = new BN(signature.slice(64)).toNumber();

    const tx = await resolveProperties(txRequest);
    const baseTx: UnsignedTransaction = {
      chainId: tx.chainId ?? this.chainId ?? undefined,
      data: tx.data || undefined,
      gasLimit: tx.gasLimit || undefined,
      gasPrice: tx.gasPrice || undefined,
      nonce: tx.nonce ? BigNumber.from(tx.nonce).toNumber() : undefined,
      to: tx.to || undefined,
      value: tx.value || undefined,
    };

    return serializeTransaction(baseTx, { r, s, v });
  }

  private buildSignatureRequest(
    txRequest: TransactionRequest,
    fingerprint: string,
    activeAccountIndex: number
  ): CBOR {
    const chainId = txRequest.chainId ?? this.chainId;
    const tx = Transaction.fromTxData(convertTxData(txRequest), {
      common: Common.custom({
        chainId: chainId,
      }),
    });

    const dataType = DataType.transaction;
    const message = Buffer.from(rlp.encode(tx.getMessageToSign(false)));

    // The keyPath below will depend on how the user onboards and should come from WalletService probably,
    // based on activeAccount.index, or fetched based on the address passed in params.from.
    // This here is BIP44 for the first account (index 0). 2nd account should be M/44'/60'/0'/0/1, etc..
    const keyPath = `M/44'/60'/0'/0/${activeAccountIndex}`;
    const ethSignRequest = EthSignRequest.constructETHRequest(
      message,
      dataType,
      keyPath,
      fingerprint,
      crypto.randomUUID(),
      chainId
    );

    const ur = ethSignRequest.toUR();

    return {
      cbor: ur.cbor.toString('hex'),
      type: ur.type,
    };
  }
}
