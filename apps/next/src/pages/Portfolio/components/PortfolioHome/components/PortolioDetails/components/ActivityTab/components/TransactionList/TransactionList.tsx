import { NetworkWithCaipId } from '@core/types';
import { FC, memo, useMemo } from 'react';
import { useAccountHistory } from '../../hooks';
import { ActivityFilter } from '../../types';

import { HistoryList } from './components/HistoryList';
import { useNetworkContext } from '@core/ui';

type Props = {
  filter: ActivityFilter;
  networkChainId: NetworkWithCaipId['chainId'];
};

const TransactionList: FC<Props> = ({ filter, networkChainId }) => {
  const transactionHistory = useAccountHistory(networkChainId);
  const { getNetwork } = useNetworkContext();
  const network = useMemo(
    () => getNetwork(networkChainId),
    [networkChainId, getNetwork],
  );

  console.log({ transactionHistory });

  return (
    <HistoryList
      filter={filter}
      transactionHistory={transactionHistory}
      network={network}
    />
  );
};

const TransactionListMemo = memo(TransactionList);

export { TransactionListMemo as TransactionList };
