import { ChainId, Network } from '@avalabs/core-chains-sdk';
import { Stack } from '@avalabs/k2-alpine';
import { useIsMainnet } from '@core/ui';
import { FC, Suspense, useState } from 'react';
import { ActivityFilterSelector } from './components/ActivityFilterSelector';
import { NetworkFilterSelector } from './components/NetworkFilterSelector';
import {
  TransactionList,
  TransactionListSkeleton,
} from './components/TransactionList';
import { useUrlState } from './hooks/useUrlState';
import { ActivityFilter } from './types';

export const ActivityTab: FC = () => {
  const isMainnet = useIsMainnet();
  const urlState = useUrlState();

  const [filter, setFilter] = useState<ActivityFilter>(
    urlState.filter ?? 'All',
  );
  const [network, setNetwork] = useState<Network['chainId']>(
    urlState.network ||
      (isMainnet ? ChainId.AVALANCHE_MAINNET_ID : ChainId.AVALANCHE_TESTNET_ID),
  );

  return (
    <Stack gap={1.25}>
      <Stack direction="row" justifyContent="space-between">
        <ActivityFilterSelector
          selected={filter}
          onChange={(newFilter) => {
            setFilter(newFilter);
            urlState.update(newFilter, network);
          }}
        />

        <NetworkFilterSelector
          selected={network}
          onChange={(newNetwork) => {
            setNetwork(newNetwork);
            urlState.update(filter, newNetwork);
          }}
        />
      </Stack>
      <Suspense fallback={<TransactionListSkeleton />}>
        <TransactionList filter={filter} network={network} />
      </Suspense>
    </Stack>
  );
};
