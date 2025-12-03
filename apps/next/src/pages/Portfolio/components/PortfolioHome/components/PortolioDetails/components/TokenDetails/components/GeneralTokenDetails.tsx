import { Slide, Stack } from '@avalabs/k2-alpine';
import { ActivityFilterSelector } from '../../ActivityTab/components/ActivityFilterSelector';

import { FC, Suspense, useState } from 'react';
import { ActivityFilter } from '../../ActivityTab/types';
import { useTokenHistory } from '../hooks/useTokenHistory';
import { TransactionListSkeleton } from '../../ActivityTab/components/TransactionList';
import { HistoryList } from '../../ActivityTab/components/TransactionList/components/HistoryList';
import { useUrlState } from '../hooks/useUrlState';
import { NoTokenActivity } from './NoTokenActivity';

type Props = {
  networkId: number;
  tokenAddress: string;
};
export const GeneralTokenDetails: FC<Props> = ({ networkId, tokenAddress }) => {
  const urlState = useUrlState();
  const initialFilter = urlState.filter ?? 'All';

  const [filter, setFilter] = useState<ActivityFilter>(initialFilter);

  const transactionHistory = useTokenHistory({
    networkId,
    tokenAddress,
  });

  if (transactionHistory.length === 0) {
    return <NoTokenActivity networkId={networkId} />;
  }

  return (
    <>
      <Stack direction="row" gap={1.25} mb={2}>
        <Slide direction="right" in>
          <ActivityFilterSelector
            selected={filter}
            exclude={['NFTs']}
            onChange={(newFilter) => {
              setFilter(newFilter);
              urlState.update(newFilter, networkId, tokenAddress, 'activity');
            }}
          />
        </Slide>
      </Stack>
      <Suspense fallback={<TransactionListSkeleton />}>
        <HistoryList filter={filter} transactionHistory={transactionHistory} />
      </Suspense>
    </>
  );
};
