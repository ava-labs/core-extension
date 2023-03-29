import {
  BitcoinInputUTXO,
  BitcoinOutputUTXO,
  DerivationPath,
} from '@avalabs/wallets-sdk';
import { TransactionRequest } from '@ethersproject/providers';
import { ImportType } from '../accounts/models';
import {
  VM,
  OutputOwners,
  TransferableOutput,
  UnsignedTx,
} from '@avalabs/avalanchejs-v2';
import { GetAssetDescriptionResponse } from '@avalabs/avalanchejs-v2/dist/src/vms/common';

export type SignTransactionRequest =
  | TransactionRequest
  | BtcTransactionRequest
  | AvalancheTransactionRequest;

export interface BtcTransactionRequest {
  inputs: BitcoinInputUTXO[];
  outputs: BitcoinOutputUTXO[];
}

export interface AvalancheTransactionRequest {
  tx: UnsignedTx;
  externalIndices?: number[];
  internalIndices?: number[];
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
  masterFingerprint?: string;
  btcWalletPolicyDetails?: BtcWalletPolicyDetails;
}

export enum WalletEvents {
  WALLET_STATE_UPDATE = 'wallet-state-updated',
}

export const WALLET_STORAGE_KEY = 'wallet';

export enum WalletType {
  MNEMONIC = 'MNEMONIC',
  LEDGER = 'LEDGER',
  KEYSTONE = 'KEYSTONE',
}

export type BtcWalletPolicyDetails = {
  hmacHex: string;
  /**
   * Extended public key of m/44'/60'/n
   */
  xpub: string;
  masterFingerprint: string;
  name: string;
};

/**
 * Used for Ledger Live accounts on ledger.
 */
export type PubKeyType = {
  evm: string;
  /**
   * Public keys used for X/P chain are from a different derivation path.
   */
  xp?: string;
  btcWalletPolicyDetails?: BtcWalletPolicyDetails;
};

/**
 * Types for parsed transaction
 */
export type AvalancheTxType =
  | AddValidatorTx
  | AddDelegatorTx
  | ExportTx
  | ImportTx
  | AvalancheBaseTx
  | UnknownTx;

export interface AvalancheTx {
  type: string;
  chain: VM;
  txFee: bigint;
}

export interface AvalancheBaseTx extends AvalancheTx {
  type: 'base';
  chain: 'AVM';
  outputs: {
    assetId: string;
    locktime: bigint;
    threshold: bigint;
    amount: bigint;
    assetDescription?: GetAssetDescriptionResponse;
    owners: string[];
    isAvax: boolean;
  }[];
  memo?: string;
}

export interface AddValidatorTx extends AvalancheTx {
  type: 'add_validator';
  nodeID: string;
  fee: number;
  start: string;
  end: string;
  rewardOwner: OutputOwners;
  stake: bigint;
  stakeOuts: TransferableOutput[];
}

export interface AddDelegatorTx extends AvalancheTx {
  type: 'add_delegator';
  nodeID: string;
  start: string;
  end: string;
  rewardOwner: OutputOwners;
  stake: bigint;
  stakeOuts: TransferableOutput[];
}

export interface ExportTx extends AvalancheTx {
  type: 'export';
  destination: VM;
  amount: bigint;
  exportOuts: any;
}

export interface ImportTx extends AvalancheTx {
  type: 'import';
  source: VM;
  amount: bigint;
}

export interface UnknownTx extends AvalancheTx {
  type: 'unknown';
}

/**
 * Type Guards
 */

export function isAddValidatorTx(tx: AvalancheTxType): tx is AddValidatorTx {
  return tx.type === 'add_validator';
}
export function isAddDelegatorTx(tx: AvalancheTxType): tx is AddDelegatorTx {
  return tx.type === 'add_delegator';
}
export function isExportTx(tx: AvalancheTxType): tx is ExportTx {
  return tx.type === 'export';
}
export function isImportTx(tx: AvalancheTxType): tx is ImportTx {
  return tx.type === 'import';
}
export function isBaseTx(tx: AvalancheTxType): tx is AvalancheBaseTx {
  return tx.type === 'base';
}
