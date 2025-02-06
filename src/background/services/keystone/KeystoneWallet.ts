import { BN } from 'bn.js';
import type { FeeMarketEIP1559TxData } from '@ethereumjs/tx';
import { FeeMarketEIP1559Transaction, Transaction } from '@ethereumjs/tx';
import Common, { Hardfork } from '@ethereumjs/common';
import {
  DataType,
  ETHSignature,
  EthSignRequest,
} from '@keystonehq/bc-ur-registry-eth';
import type { TransactionRequest } from 'ethers';
import { hexlify } from 'ethers';
import type { BufferLike } from 'ethereumjs-util';
import { rlp } from 'ethereumjs-util';

import { makeBNLike } from '@src/utils/makeBNLike';

import type { CBOR, KeystoneTransport } from './models';
import { convertTxData } from './utils';

export class KeystoneWallet {
  constructor(
    private fingerprint: string,
    private activeAccountIndex: number,
    private keystoneTransport: KeystoneTransport,
    private chainId?: number,
    private tabId?: number,
  ) {}

  async signTransaction(txRequest: TransactionRequest): Promise<string> {
    const cborBuffer = await this.keystoneTransport.requestSignature(
      await this.buildSignatureRequest(
        txRequest,
        this.fingerprint,
        this.activeAccountIndex,
      ),
      this.tabId,
    );
    const signature = ETHSignature.fromCBOR(cborBuffer).getSignature();

    const r = hexlify(new Uint8Array(signature.slice(0, 32)));
    const s = hexlify(new Uint8Array(signature.slice(32, 64)));
    const v = new BN(signature.slice(64)).toNumber();

    const signedTx = await this.getTxFromTransactionRequest(txRequest, {
      r,
      s,
      v,
    });

    return '0x' + signedTx.serialize().toString('hex');
  }

  private async buildSignatureRequest(
    txRequest: TransactionRequest,
    fingerprint: string,
    activeAccountIndex: number,
  ): Promise<CBOR> {
    const chainId = txRequest.chainId ?? this.chainId;
    const isLegacyTx = typeof txRequest.gasPrice !== 'undefined';

    const tx = await this.getTxFromTransactionRequest(txRequest);

    const message =
      tx instanceof FeeMarketEIP1559Transaction
        ? tx.getMessageToSign(false)
        : rlp.encode(tx.getMessageToSign(false)); // Legacy transactions are not RLP-encoded

    const dataType = isLegacyTx
      ? DataType.transaction
      : DataType.typedTransaction;

    // The keyPath below will depend on how the user onboards and should come from WalletService probably,
    // based on activeAccount.index, or fetched based on the address passed in params.from.
    // This here is BIP44 for the first account (index 0). 2nd account should be M/44'/60'/0'/0/1, etc..
    const keyPath = `M/44'/60'/0'/0/${activeAccountIndex}`;
    const ethSignRequest = EthSignRequest.constructETHRequest(
      Buffer.from(message),
      dataType,
      keyPath,
      fingerprint,
      crypto.randomUUID(),
      Number(chainId),
    );

    const ur = ethSignRequest.toUR();

    return {
      cbor: ur.cbor.toString('hex'),
      type: ur.type,
    };
  }

  private async getTxFromTransactionRequest(
    txRequest: TransactionRequest,
    signature?: { r: string; s: string; v: number },
  ) {
    return typeof txRequest.gasPrice !== 'undefined'
      ? Transaction.fromTxData(
          {
            ...(await convertTxData(txRequest)),
            ...signature,
          },
          {
            common: Common.custom({
              chainId: Number(txRequest.chainId ?? this.chainId),
            }),
          },
        )
      : FeeMarketEIP1559Transaction.fromTxData(
          { ...this.txRequestToFeeMarketTxData(txRequest), ...signature },
          {
            common: Common.custom(
              { chainId: Number(txRequest.chainId ?? this.chainId) },
              {
                // "London" hardfork introduced EIP-1559 proposal. Setting it here allows us
                // to use the new TX props (maxFeePerGas and maxPriorityFeePerGas) in combination
                // with the custom chainId.
                hardfork: Hardfork.London,
              },
            ),
          },
        );
  }

  private txRequestToFeeMarketTxData(
    txRequest: TransactionRequest,
  ): FeeMarketEIP1559TxData {
    const {
      to,
      nonce,
      gasLimit,
      value,
      data,
      type,
      maxFeePerGas,
      maxPriorityFeePerGas,
    } = txRequest;

    return {
      to: to?.toString() || undefined,
      nonce: makeBNLike(nonce),
      maxFeePerGas: makeBNLike(maxFeePerGas),
      maxPriorityFeePerGas: makeBNLike(maxPriorityFeePerGas),
      gasLimit: makeBNLike(gasLimit),
      value: makeBNLike(value),
      data: data as BufferLike,
      type: type || undefined,
    };
  }
}
