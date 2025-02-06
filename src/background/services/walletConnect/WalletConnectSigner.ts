import { TransactionRequest } from 'ethers';
import { Avalanche } from '@avalabs/core-wallets-sdk';
import { AVM, PVM } from '@avalabs/avalanchejs';

import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';

import { WalletConnectTransport } from './models';
import { MessageType } from '../messages/models';
import { SigningResult } from '../wallet/models';
import { makeBNLike } from '@src/utils/makeBNLike';

export class WalletConnectSigner {
  constructor(
    private transport: WalletConnectTransport,
    private chainId: number,
    private address: string,
    private tabId?: number,
    private requestExpiry?: number,
  ) {}

  /**
   * EVM (Ethereum, C-Chain) transaction signing
   */
  async signTransaction(txRequest: TransactionRequest): Promise<SigningResult> {
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

    const txHash = await this.transport.request(
      {
        method: 'eth_sendTransaction',
        params: [
          {
            to,
            from: this.address,
            nonce: makeBNLike(nonce),
            maxFeePerGas: makeBNLike(maxFeePerGas),
            maxPriorityFeePerGas: makeBNLike(maxPriorityFeePerGas),
            gasLimit: makeBNLike(gasLimit),
            value: makeBNLike(value),
            data,
            type: type,
          },
        ],
      },
      {
        chainId: this.chainId,
        tabId: this.tabId,
        fromAddress: this.address,
        expiry: this.requestExpiry,
      },
    );

    return {
      txHash,
    };
  }

  /**
   * Avalanche P/X chain transaction signing
   */
  async signTx(
    request: Avalanche.SignTxRequest,
    method?: string,
  ): Promise<SigningResult> {
    const { externalIndices, internalIndices, tx } = request;

    const transactionHex = `0x${Buffer.from(tx.toBytes()).toString('hex')}`;
    const vm = tx.getVM();
    const chainAlias = vm === AVM ? 'X' : vm === PVM ? 'P' : 'C';

    /**
     * Core Mobile is the only mobile wallet that supports avalanche_*
     * transactions, but it does not list the P/X chains in the session
     * namespaces. Since those chain IDs are not present in the session's
     * definition, WalletConnect SDKs would not allow us to send such requests.
     *
     * That being said, with Core Mobile we can specify any chain id supported
     * by the current WalletConnect session (e.g. the C-Chain's ID), and the
     * app will still allow us to send requests specific to P/X chain.
     *
     * That's why we're getting the chain id from the session here,
     * instead of relying on this.chainId.
     */
    const session = await this.transport.getSessionInfo(this.address);
    const chainId = session?.chains[0] ?? this.chainId;

    const result = await this.transport.request(
      {
        method: method ?? DAppProviderRequest.AVALANCHE_SIGN_TRANSACTION,
        params: {
          transactionHex,
          chainAlias,
          externalIndices,
          internalIndices,
        } as any, // Core Mobile expects an object for Avalanche transactions, not an array
      },
      {
        chainId,
        tabId: this.tabId,
        fromAddress: this.address,
        expiry: this.requestExpiry,
      },
    );

    const isDispatched = method === 'avalanche_sendTransaction';

    if (isDispatched) {
      return { txHash: result };
    }

    return { signedTx: JSON.stringify(result) };
  }

  async signMessage(messageType: MessageType, requestParams: any) {
    return await this.transport.request(
      {
        method: messageType,
        params: requestParams,
      },
      {
        chainId: this.chainId,
        tabId: this.tabId,
        fromAddress: this.address,
        expiry: this.requestExpiry,
      },
    );
  }
}
