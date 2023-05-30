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
  Common,
  UnsignedTx,
} from '@avalabs/avalanchejs-v2';

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
export type AvalancheTx =
  | AddValidatorTx
  | AddDelegatorTx
  | ExportTx
  | ImportTx
  | AvalancheBaseTx
  | CreateSubnetTx
  | CreateChainTx
  | AddSubnetValidatorTx
  | UnknownTx;

export interface AvalancheTxBase {
  type: string;
  chain: VM;
  txFee: bigint;
}

export enum AvalancheTxType {
  Base = 'base',
  AddValidator = 'add_validator',
  AddDelegator = 'add_delegator',
  Export = 'export',
  Import = 'import',
  CreateSubnet = 'create_subnet',
  CreateChain = 'create_chain',
  AddSubnetValidator = 'add_subnet_validator',
  Unknown = 'unknown',
}

export interface AvalancheBaseTx extends AvalancheTxBase {
  type: AvalancheTxType.Base;
  chain: 'AVM';
  outputs: {
    assetId: string;
    locktime: bigint;
    threshold: bigint;
    amount: bigint;
    assetDescription?: Common.GetAssetDescriptionResponse;
    owners: string[];
    isAvax: boolean;
  }[];
  memo?: string;
}

export interface AddValidatorTx extends AvalancheTxBase {
  type: AvalancheTxType.AddValidator;
  nodeID: string;
  fee: number;
  start: string;
  end: string;
  rewardOwner: OutputOwners;
  stake: bigint;
  stakeOuts: TransferableOutput[];
}

export interface AddDelegatorTx extends AvalancheTxBase {
  type: AvalancheTxType.AddDelegator;
  nodeID: string;
  start: string;
  end: string;
  rewardOwner: OutputOwners;
  stake: bigint;
  stakeOuts: TransferableOutput[];
}

export interface ExportTx extends AvalancheTxBase {
  type: AvalancheTxType.Export;
  destination: VM;
  amount: bigint;
  exportOuts: any;
}

export interface ImportTx extends AvalancheTxBase {
  type: AvalancheTxType.Import;
  source: VM;
  amount: bigint;
}

export interface CreateSubnetTx extends AvalancheTxBase {
  type: AvalancheTxType.CreateSubnet;
  threshold: number;
  controlKeys: string[];
}

export interface CreateChainTx extends AvalancheTxBase {
  type: AvalancheTxType.CreateChain;
  subnetID: string;
  chainName: string;
  vmID: string;
  fxIDs: string[];
  genesisData: string;
}

export interface AddSubnetValidatorTx extends AvalancheTxBase {
  type: AvalancheTxType.AddSubnetValidator;
  nodeID: string;
  start: string;
  end: string;
  subnetID: string;
}

export interface UnknownTx extends AvalancheTxBase {
  type: AvalancheTxType.Unknown;
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
export function isBaseTx(tx: AvalancheTx): tx is AvalancheBaseTx {
  return tx.type === 'base';
}
export function isCreateSubnetTx(tx: AvalancheTx): tx is CreateSubnetTx {
  return tx.type === 'create_subnet';
}
export function isCreateChainTx(tx: AvalancheTx): tx is CreateChainTx {
  return tx.type === 'create_chain';
}
export function isAddSubnetValidatorTx(
  tx: AvalancheTx
): tx is AddSubnetValidatorTx {
  return tx.type === 'add_subnet_validator';
}
