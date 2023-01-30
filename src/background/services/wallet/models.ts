import {
  BitcoinInputUTXO,
  BitcoinOutputUTXO,
  DerivationPath,
} from '@avalabs/wallets-sdk';
import { TransactionRequest } from '@ethersproject/providers';
import { ImportType } from '../accounts/models';
import { VM, OutputOwners, TransferableOutput } from '@avalabs/avalanchejs-v2';

export type SignTransactionRequest =
  | TransactionRequest
  | BtcTransactionRequest
  | AvalancheTransactionRequest;

export interface BtcTransactionRequest {
  inputs: BitcoinInputUTXO[];
  outputs: BitcoinOutputUTXO[];
}

export interface AvalancheTransactionRequest {
  tx: Buffer;
  chain: 'X' | 'P' | 'C';
}

export interface WalletLockedState {
  locked: boolean;
}

export interface WalletSecretInStorage {
  derivationPath: DerivationPath;
  mnemonic?: string;
  // Extended public key of m/44'/60'/0'
  xpub?: string;
  /**
   * 	Extended public key of m/44'/9000'/0'
   * 	Used X/P chain derivation on mnemonic and Ledger (BIP44) wallets.
   */
  xpubXP?: string;
  pubKeys?: PubKeyType[];
  imported?: Record<
    string,
    {
      type: ImportType;
      secret: string;
    }
  >;
}

export enum WalletEvents {
  WALLET_STATE_UPDATE = 'wallet-state-updated',
}

export const WALLET_STORAGE_KEY = 'wallet';

export enum WalletType {
  MNEMONIC = 'MNEMONIC',
  LEDGER = 'LEDGER',
}

/**
 * Used for Ledger Live accounts on ledger.
 */
export type PubKeyType = {
  evm: string;
  /**
   * Public keys used for X/P chain are from a different derivation path.
   */
  xp?: string;
};

/**
 * Types for parsed transaction
 */
export type AvalancheTx =
  | AddValidatorTx
  | AddDelegatorTx
  | ExportTx
  | ImportTx
  | UnknownTx;

export interface AvalancheBaseTx {
  type: string;
  chain: VM;
}

export interface AddValidatorTx extends AvalancheBaseTx {
  type: 'add_validator';
  nodeID: string;
  fee: number;
  start: string;
  end: string;
  rewardOwner: OutputOwners;
  stake: bigint;
  stakeOuts: TransferableOutput[];
}

export interface AddDelegatorTx extends AvalancheBaseTx {
  type: 'add_delegator';
  nodeID: string;
  start: string;
  end: string;
  rewardOwner: OutputOwners;
  stake: bigint;
  stakeOuts: TransferableOutput[];
}

export interface ExportTx extends AvalancheBaseTx {
  type: 'export';
  destination: VM;
  amount: bigint;
}

export interface ImportTx extends AvalancheBaseTx {
  type: 'import';
  source: VM;
  amount: bigint;
}

export interface UnknownTx extends AvalancheBaseTx {
  type: 'unknown';
}

/**
 * Type Guards
 */
export function isAddValidatorTx(tx: AvalancheTx): tx is AddValidatorTx {
  return tx.type === 'add_validator';
}
export function isAddDelegatorTx(tx: AvalancheTx): tx is AddDelegatorTx {
  return tx.type === 'add_delegator';
}
export function isExportTx(tx: AvalancheTx): tx is ExportTx {
  return tx.type === 'export';
}
export function isImportTx(tx: AvalancheTx): tx is ImportTx {
  return tx.type === 'import';
}
