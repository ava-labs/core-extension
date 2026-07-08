import { NetworkWithCaipId } from '@core/types';
import { FC, memo } from 'react';
import { useAccountHistory } from '../../hooks';
import { ActivityFilter } from '../../types';

import { HistoryList } from './components/HistoryList';

type Props = {
  filter: ActivityFilter;
  networkChainId: NetworkWithCaipId['chainId'];
};

const TransactionList: FC<Props> = ({ filter, networkChainId }) => {
  const transactionHistory = useAccountHistory(networkChainId);

  return (
    <HistoryList filter={filter} transactionHistory={transactionHistory} />
  );
};

const TransactionListMemo = memo(TransactionList);

export { TransactionListMemo as TransactionList };
