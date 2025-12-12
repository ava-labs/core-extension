import { NetworkWithCaipId } from '@core/types';
import { FC, memo } from 'react';
import { useAccountHistory } from '../../hooks';
import { ActivityFilter } from '../../types';

import { HistoryList } from './components/HistoryList';

type Props = {
  filter: ActivityFilter;
  network: NetworkWithCaipId['chainId'];
};

const TransactionList: FC<Props> = ({ filter, network }) => {
  const transactionHistory = useAccountHistory(network);
  console.log({ transactionHistory });
  return (
    <HistoryList filter={filter} transactionHistory={transactionHistory} />
  );
};

const TransactionListMemo = memo(TransactionList);

export { TransactionListMemo as TransactionList };
