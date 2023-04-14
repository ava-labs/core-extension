import { TransactionRequest } from '@ethersproject/providers';
import { BN } from 'bn.js';
import { BigNumber } from 'ethers';
import {
  FeeMarketEIP1559Transaction,
  FeeMarketEIP1559TxData,
  Transaction,
} from '@ethereumjs/tx';
import Common, { Hardfork } from '@ethereumjs/common';
import {
  DataType,
  ETHSignature,
  EthSignRequest,
} from '@keystonehq/bc-ur-registry-eth';

import { BufferLike, rlp } from 'ethereumjs-util';
import {
  hexlify,
  resolveProperties,
  serializeTransaction,
  UnsignedTransaction,
} from 'ethers/lib/utils';
import { CBOR, KeystoneTransport } from './models';
import { convertTxData, makeBNLike } from './utils';

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
    const gasPriceData =
      typeof tx.gasPrice !== 'undefined'
        ? {
            gasPrice: tx.gasPrice || undefined,
          }
        : {
            maxFeePerGas: tx.maxFeePerGas || undefined,
            maxPriorityFeePerGas: tx.maxPriorityFeePerGas || undefined,
          };
    const baseTx: UnsignedTransaction = {
      ...gasPriceData,
      chainId: tx.chainId ?? this.chainId ?? undefined,
      data: tx.data || undefined,
      gasLimit: tx.gasLimit || undefined,
      nonce: tx.nonce ? BigNumber.from(tx.nonce).toNumber() : undefined,
      to: tx.to || undefined,
      type: tx.type,
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
    const isLegacyTx = typeof txRequest.gasPrice !== 'undefined';

    const tx = isLegacyTx
      ? Transaction.fromTxData(convertTxData(txRequest), {
          common: Common.custom({ chainId }),
        })
      : FeeMarketEIP1559Transaction.fromTxData(
          this.txRequestToFeeMarketTxData(txRequest),
          {
            common: Common.custom(
              { chainId },
              {
                // "London" hardfork introduced EIP-1559 proposal. Setting it here allows us
                // to use the new TX props (maxFeePerGas and maxPriorityFeePerGas) in combination
                // with the custom chainId.
                hardfork: Hardfork.London,
              }
            ),
          }
        );

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
      chainId
    );

    const ur = ethSignRequest.toUR();

    return {
      cbor: ur.cbor.toString('hex'),
      type: ur.type,
    };
  }

  private txRequestToFeeMarketTxData(
    txRequest: TransactionRequest
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
      to,
      nonce: makeBNLike(nonce),
      maxFeePerGas: makeBNLike(maxFeePerGas),
      maxPriorityFeePerGas: makeBNLike(maxPriorityFeePerGas),
      gasLimit: makeBNLike(gasLimit),
      value: makeBNLike(value),
      data: data as BufferLike,
      type: type,
    };
  }
}
