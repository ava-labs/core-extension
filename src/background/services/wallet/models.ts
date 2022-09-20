import { BitcoinInputUTXO, BitcoinOutputUTXO } from '@avalabs/wallets-sdk';
import { TransactionRequest } from '@ethersproject/providers';

export type SignTransactionRequest = TransactionRequest | BtcTransactionRequest;
export interface BtcTransactionRequest {
  inputs: BitcoinInputUTXO[];
  outputs: BitcoinOutputUTXO[];
}

export interface WalletLockedState {
  locked: boolean;
}

export interface WalletSecretInStorage {
  derivationType?: DerivationType;
  mnemonic?: string;
  // Extended public key of m/44'/60'/0'
  xpub?: string;
  pubKeys?: PubKeyType[];
}

export enum WalletEvents {
  WALLET_STATE_UPDATE = 'wallet-state-updated',
}

export const WALLET_STORAGE_KEY = 'wallet';
export enum DerivationType {
  BIP44 = 'BIP44',
  LEDGER_LIVE = 'LEDGER_LIVE',
}
export enum WalletType {
  MNEMONIC = 'MNEMONIC',
  LEDGER = 'LEDGER',
}

export type PubKeyType = { evm: string };
