import { BN } from 'bn.js';
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
import { uniq } from 'lodash';
import { Signature, TransactionRequest, hexlify } from 'ethers';
import { BufferLike, rlp } from 'ethereumjs-util';
import { Avalanche } from '@avalabs/core-wallets-sdk';
import KeystoneUSBAvalancheSDK from '@keystonehq/hw-app-avalanche';
import KeystoneUSBEthSDK from '@keystonehq/hw-app-eth';
import { createKeystoneTransport } from '@keystonehq/hw-transport-webusb';
import { UREncoder, URDecoder, UR } from '@ngraveio/bc-ur';
import { getAvalancheDerivationPath, makeBNLike } from '@core/common';
import { utils } from '@avalabs/avalanchejs';

import {
  CBOR,
  KeystoneTransport,
  MessageParams,
  MessageType,
} from '@core/types';
import { convertTxData } from './utils';

export const parseResponoseUR = (urPlayload: string): UR => {
  const decoder = new URDecoder();
  decoder.receivePart(urPlayload);
  if (!decoder.isComplete()) {
    throw new Error('UR incomplete');
  }
  const resultUR = decoder.resultUR();
  return resultUR;
};

export class KeystoneWallet {
  constructor(
    private fingerprint: string,
    private activeAccountIndex: number,
    private keystoneTransport: KeystoneTransport,
    private chainId?: number,
    private tabId?: number,
    private xpub?: string,
    private xpubXP?: string,
  ) {}

  async signTransaction(txRequest: TransactionRequest): Promise<string> {
    const isKeystone3 = !!this.xpubXP;
    if (isKeystone3) {
      const ur = await this.buildSignatureUR(
        txRequest,
        this.fingerprint,
        this.activeAccountIndex,
      );

      const sig = await this.deriveEthSignatureFromUR(ur);
      const signedTx = await this.getTxFromTransactionRequest(txRequest, sig);

      return '0x' + signedTx.serialize().toString('hex');
    }
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

  private async buildSignatureUR(
    txRequest: TransactionRequest,
    fingerprint: string,
    activeAccountIndex: number,
  ): Promise<UR> {
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
      message,
      dataType,
      keyPath,
      fingerprint,
      crypto.randomUUID(),
      Number(chainId),
    );

    const ur = ethSignRequest.toUR();

    return ur;
  }

  private async buildSignatureRequest(
    txRequest: TransactionRequest,
    fingerprint: string,
    activeAccountIndex: number,
  ): Promise<CBOR> {
    const ur = await this.buildSignatureUR(
      txRequest,
      fingerprint,
      activeAccountIndex,
    );
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

  /**
   * Avalanche P/X chain transaction signing
   */
  public async signTx(
    txRequest: Avalanche.SignTxRequest,
  ): Promise<Avalanche.SignTxRequest['tx']> {
    const tx = txRequest.tx;
    const app = new KeystoneUSBAvalancheSDK(await createKeystoneTransport());

    const derivationPaths = uniq([
      getAvalancheDerivationPath(this.activeAccountIndex),
      ...(txRequest.externalIndices ?? []).map((index) =>
        getAvalancheDerivationPath(this.activeAccountIndex, index, false),
      ),
      ...(txRequest.internalIndices ?? []).map((index) =>
        getAvalancheDerivationPath(this.activeAccountIndex, index, true),
      ),
    ]);

    const signatures = await app.signTx(
      tx as any,
      derivationPaths,
      [], // Additional UTXOs array reserved for web utxo selector (not provided by current extension)
      this.fingerprint,
    );

    signatures.forEach((sig) => {
      tx.addSignature(utils.hexToBuffer(sig));
    });

    return tx;
  }

  private async deriveEthSignatureFromUR(ur: UR): Promise<{
    r: string;
    s: string;
    v: number;
  }> {
    const app = new KeystoneUSBEthSDK((await createKeystoneTransport()) as any);
    const encodedUR = new UREncoder(ur!, Infinity).nextPart().toUpperCase();
    const payload = (await app.signTransactionFromUr(encodedUR)).payload;
    const signature = ETHSignature.fromCBOR(
      parseResponoseUR(payload).cbor,
    ).getSignature();
    const r = hexlify(new Uint8Array(signature.slice(0, 32)));
    const s = hexlify(new Uint8Array(signature.slice(32, 64)));
    const v = new BN(signature.slice(64)).toNumber();
    return { r, s, v };
  }

  async signMessage(
    messageType: MessageType,
    messageParams: MessageParams,
  ): Promise<string> {
    switch (messageType) {
      case MessageType.AVALANCHE_SIGN: {
        throw new Error('AVALANCHE_SIGN not supported');
      }
      case MessageType.ETH_SIGN:
      case MessageType.PERSONAL_SIGN: {
        const ur = EthSignRequest.constructETHRequest(
          Buffer.from(messageParams.data.replace('0x', ''), 'hex'),
          DataType.personalMessage,
          `M/44'/60'/0'/0/${this.activeAccountIndex}`,
          this.fingerprint,
          crypto.randomUUID(),
        ).toUR();

        const sig = await this.deriveEthSignatureFromUR(ur);

        return Signature.from(sig).serialized;
      }
      case MessageType.SIGN_TYPED_DATA:
      case MessageType.SIGN_TYPED_DATA_V1: {
        throw new Error('SIGN_TYPED_DATA/SIGN_TYPED_DATA_V1 not supported');
      }
      case MessageType.SIGN_TYPED_DATA_V3:
      case MessageType.SIGN_TYPED_DATA_V4: {
        const ur = EthSignRequest.constructETHRequest(
          Buffer.from(JSON.stringify(messageParams.data), 'utf-8'),
          DataType.typedData,
          `M/44'/60'/0'/0/${this.activeAccountIndex}`,
          this.fingerprint,
          crypto.randomUUID(),
        ).toUR();

        const sig = await this.deriveEthSignatureFromUR(ur);

        return Signature.from(sig).serialized;
      }
      default:
        throw new Error('Unknown message type method');
    }
  }
}
