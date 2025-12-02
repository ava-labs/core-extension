import { Slide, Stack } from '@avalabs/k2-alpine';
import { ActivityFilterSelector } from '../../ActivityTab/components/ActivityFilterSelector';
import { useUrlState } from '../../ActivityTab/hooks/useUrlState';

import { FC, Suspense, useState } from 'react';
import { ActivityFilter } from '../../ActivityTab/types';
import { useTokenHistory } from '../hooks/useTokenHistory';
import { TransactionListSkeleton } from '../../ActivityTab/components/TransactionList';
import { HistoryList } from '../../ActivityTab/components/TransactionList/components/HistoryList';

type Props = {
  networkId: number;
  tokenAddress: string;
};
export const GeneralTokenDetails: FC<Props> = ({ networkId, tokenAddress }) => {
  const urlState = useUrlState();

  const [filter, setFilter] = useState<ActivityFilter>(
    urlState.filter ?? 'All',
  );

  const transactionHistory = useTokenHistory({
    networkId,
    tokenAddress,
  });

  return (
    <>
      <Stack direction="row" gap={1.25} mb={2}>
        <Slide direction="right" in>
          <ActivityFilterSelector
            selected={filter}
            exclude={['NFTs']}
            onChange={(newFilter) => {
              setFilter(newFilter);
              urlState.update(newFilter, networkId, tokenAddress);
            }}
          />
        </Slide>
      </Stack>
      <Suspense fallback={<TransactionListSkeleton />}>
        <HistoryList
          filter={filter}
          transactionHistory={transactionHistory}
          showChainBadge={false}
        />
      </Suspense>
    </>
  );
};
