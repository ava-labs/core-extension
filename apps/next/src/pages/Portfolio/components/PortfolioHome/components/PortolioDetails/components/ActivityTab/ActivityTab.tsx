import { ChainId, Network } from '@avalabs/core-chains-sdk';
import { Slide, Stack } from '@avalabs/k2-alpine';
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
    <Stack pt={0.5} gap={2}>
      <Stack direction="row" justifyContent="space-between">
        <Slide direction="right" in>
          <ActivityFilterSelector
            selected={filter}
            onChange={(newFilter) => {
              setFilter(newFilter);
              urlState.update(newFilter, network);
            }}
          />
        </Slide>
        <Slide direction="left" in>
          <NetworkFilterSelector
            selected={network}
            onChange={(newNetwork) => {
              setNetwork(newNetwork);
              urlState.update(filter, newNetwork);
            }}
          />
        </Slide>
      </Stack>
      <Suspense fallback={<TransactionListSkeleton />}>
        <TransactionList filter={filter} network={network} />
      </Suspense>
    </Stack>
  );
};
