import { TxHistoryItem } from '@core/types';
import { format, isThisYear, isToday } from 'date-fns';
import { groupBy } from 'lodash';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityFilter } from '../types';
import { transactionFilterPredicates } from '../utils/transactionFilterPredicates';

export function useGroupedHistory(
  history: TxHistoryItem[],
  filter: ActivityFilter,
) {
  const { t } = useTranslation();
  return useMemo(() => {
    const filterFn = transactionFilterPredicates[filter];
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
