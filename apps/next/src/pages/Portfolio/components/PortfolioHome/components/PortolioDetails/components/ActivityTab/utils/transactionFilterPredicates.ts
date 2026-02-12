import { TransactionType } from '@avalabs/vm-module-types';
import { isNftTokenType } from '@core/common';
import { ActivityFilter, ActivityFilterPredicate } from '../types';

export const transactionFilterPredicates: Record<
  ActivityFilter,
  ActivityFilterPredicate | undefined
> = {
  All: undefined,
  Bridge: (tx) =>
    tx.txType === TransactionType.BRIDGE || tx.bridgeAnalysis.isBridgeTx,
  Swap: (tx) => tx.txType === TransactionType.SWAP,
  Contract_Call: (tx) =>
    tx.isContractCall &&
    !tx.bridgeAnalysis.isBridgeTx &&
    tx.txType !== TransactionType.SWAP,
  Received: (tx) => tx.isIncoming,
  Sent: (tx) => tx.isOutgoing,
  NFT: (tx) => {
    const [token] = tx.tokens;
    return (
      tx.txType === TransactionType.NFT_BUY ||
      ((tx.txType === TransactionType.TRANSFER ||
        tx.txType === TransactionType.NFT_RECEIVE ||
        tx.txType === TransactionType.UNKNOWN) &&
        !!token &&
        isNftTokenType(token.type))
    );
  },
};
