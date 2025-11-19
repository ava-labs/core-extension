import { TransactionType } from '@avalabs/vm-module-types';
import { isNftTokenType } from '@core/common';
import { TxHistoryItem } from '@core/types';
import { format, isThisYear, isToday } from 'date-fns';
import { groupBy } from 'lodash';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityFilter, ActivityFilterPredicate } from '../types';

export function useGroupedHistory(
  history: TxHistoryItem[],
  filter: ActivityFilter,
) {
  const { t } = useTranslation();
  return useMemo(() => {
    const filterFn = txFilters[filter];
    const filtered = filterFn ? history.filter(filterFn) : history;
    return groupBy(filtered, (tx) => {
      if (isToday(tx.timestamp)) {
        return t('Today');
      }

      return format(
        tx.timestamp,
        isThisYear(tx.timestamp) ? 'MMMM' : 'MMMM yyyy',
      );
    });
  }, [filter, history, t]);
}

const txFilters: Record<ActivityFilter, ActivityFilterPredicate | undefined> = {
  All: undefined,
  Bridge: (tx) =>
    tx.txType === TransactionType.BRIDGE || tx.bridgeAnalysis.isBridgeTx,
  Swap: (tx) => tx.txType === TransactionType.SWAP,
  Contract_Call: (tx) =>
    tx.isContractCall &&
    !tx.bridgeAnalysis.isBridgeTx &&
    tx.txType !== TransactionType.SWAP,
  Incoming: (tx) => tx.isIncoming,
  Outgoing: (tx) => tx.isOutgoing,
  NFTs: (tx) =>
    tx.txType === TransactionType.NFT_BUY ||
    ((tx.txType === TransactionType.TRANSFER ||
      tx.txType === TransactionType.NFT_RECEIVE ||
      tx.txType === TransactionType.UNKNOWN) &&
      !!tx.tokens[0] &&
      isNftTokenType(tx.tokens[0].type)),
};
