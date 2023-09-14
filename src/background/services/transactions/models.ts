/* eslint-disable no-prototype-builtins */

import { DomainMetadata } from '@src/background/models';
import { ContractCall } from '@src/contracts/contractParsers/models';
import { TransactionDescription } from 'ethers';

// A helper generic that turns only given keys (K) of type T
// from optional to required.
export type EnsureDefined<T, K extends keyof T> = T & Required<Pick<T, K>>;

export enum TxStatus {
  // user has been shown the UI and we are waiting on approval
  PENDING = 'pending',
  // user has approved and we are waiting on the background to confirm
  SUBMITTING = 'submitting',
  // tx was submitted and returned successful
  SIGNED = 'signed',
  ERROR = 'error',
  ERROR_USER_CANCELED = 'error-user-canceled',
}

export enum AvalancheChainStrings {
  AVM = 'X Chain',
  PVM = 'P Chain',
  EVM = 'C Chain',
}

export enum TransactionEvent {
  TRANSACTIONS_UPDATED = 'transactions-updated',
  TRANSACTION_FINALIZED = 'transaction-finalized',
}

export interface TransactionDisplayValues {
  fromAddress?: string;
  toAddress?: string;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  contractType?: ContractCall;
  gasLimit?: number;
  fee?: string;
  feeUSD?: number;
  site?: DomainMetadata;
  description?: TransactionDescription;
  [key: string]: any;
}

export type TransactionDisplayValuesWithGasData = EnsureDefined<
  TransactionDisplayValues,
  'maxFeePerGas' | 'gasLimit'
>;

export interface Transaction {
  id: number | string | void;
  method: string;
  time: number;
  status: TxStatus;
  metamaskNetworkId: string;
  chainId: string;
  txParams: txParams;
  type: string;
  transactionCategory: string;
  txHash?: string;
  displayValues: TransactionDisplayValues;
  error?: string;
  tabId?: number;
}

export function isTxParams(params: Partial<txParams>): params is txParams {
  return !!params.from;
}

export type PendingTransactions = {
  [id: string]: Transaction;
};

export interface txParams {
  from: string;
  to: string;
  value?: string;
  data?: string;
  gas?: number;
  type?: number;
  gasPrice?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
}
/**
 * This is updating the gasPrice and gasEstimate for a pending tx
 */
export interface txParamsUpdate {
  id: any;
  params: txParams;
  tabId?: number;
}
/**
 * This is updating the result with the txHash or the status
 */
export interface txStatusUpdate {
  status: TxStatus;
  id: Transaction['id'];
  result?: string;
  error?: string;
  tabId?: number;
}

export function isTxParamsUpdate(
  update: txParamsUpdate | txStatusUpdate
): update is txParamsUpdate {
  return update?.hasOwnProperty('id') && update.hasOwnProperty('params');
}

export function isTxStatusUpdate(
  update: txParamsUpdate | txStatusUpdate
): update is txStatusUpdate {
  return (
    update?.hasOwnProperty('id') &&
    update.hasOwnProperty('status') &&
    !update.hasOwnProperty('result') &&
    (update as txStatusUpdate).status !== TxStatus.SIGNED
  );
}

export function isTxFinalizedUpdate(
  update: txParamsUpdate | txStatusUpdate
): update is txStatusUpdate {
  return (
    (update as txStatusUpdate).status === TxStatus.ERROR ||
    (update as txStatusUpdate).status === TxStatus.ERROR_USER_CANCELED ||
    (update?.hasOwnProperty('id') &&
      update.hasOwnProperty('result') &&
      update.hasOwnProperty('status') &&
      (update as txStatusUpdate).status === TxStatus.SIGNED)
  );
}

export const TRANSACTIONS_STORAGE_KEY = 'transactions';
