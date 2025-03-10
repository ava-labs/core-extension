import { SolanaCaip2ChainId } from '@avalabs/core-chains-sdk';
import type { PublicKey, SendOptions } from '@solana/web3.js';

export interface CoreEvent {
  connect(...args: unknown[]): unknown;
  disconnect(...args: unknown[]): unknown;
  accountChanged(...args: unknown[]): unknown;
}

export interface CoreEventEmitter {
  on<E extends keyof CoreEvent>(
    event: E,
    listener: CoreEvent[E],
    context?: any,
  ): void;
  off<E extends keyof CoreEvent>(
    event: E,
    listener: CoreEvent[E],
    context?: any,
  ): void;
}

export interface Core extends CoreEventEmitter {
  publicKey: PublicKey | null;
  connect(options?: {
    onlyIfTrusted?: boolean;
  }): Promise<{ publicKey: PublicKey }>;
  disconnect(): Promise<void>;
  signAndSendTransaction(
    account: string,
    caipId: SolanaCaip2ChainId,
    serializedTx: string,
    options?: SendOptions,
  ): Promise<string>;
  signTransaction(
    account: string,
    caip2Id: SolanaCaip2ChainId,
    base64EncodedTx: string,
  ): Promise<string>;
  signAllTransactions(
    account: string,
    caip2Id: SolanaCaip2ChainId,
    base64EncodedTxs: string[],
  ): Promise<string[]>;
  // signMessage(message: Uint8Array): Promise<{ signature: Uint8Array }>;
  // signIn(input?: SolanaSignInInput): Promise<SolanaSignInOutput>;
}
