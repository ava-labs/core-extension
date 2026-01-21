import { TxHistoryItem } from '@core/types';
import {
  XChainTransactionType,
  PChainTransactionType,
} from '@avalabs/glacier-sdk';

/**
 * Checks if a transaction is a CCT (Cross-Chain Transfer) import transaction
 */
export function isCctImportTransaction(transaction: TxHistoryItem): boolean {
  return (
    transaction.txType === XChainTransactionType.IMPORT_TX ||
    transaction.txType === PChainTransactionType.IMPORT_TX
  );
}

/**
 * Checks if a transaction is a CCT (Cross-Chain Transfer) export transaction
 */
export function isCctExportTransaction(transaction: TxHistoryItem): boolean {
  return (
    transaction.txType === XChainTransactionType.EXPORT_TX ||
    transaction.txType === PChainTransactionType.EXPORT_TX
  );
}

/**
 * Checks if a transaction is a CCT (Cross-Chain Transfer) import or export transaction
 */
export function isCctTransaction(transaction: TxHistoryItem): boolean {
  return (
    isCctImportTransaction(transaction) || isCctExportTransaction(transaction)
  );
}
