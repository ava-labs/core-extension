import { ChainId } from '@avalabs/core-chains-sdk';
import { Stack } from '@avalabs/k2-alpine';
import type { Network } from '@core/types';
import { useIsMainnet, useNetworkContext } from '@core/ui';
import { FC, Suspense, useMemo, useState } from 'react';
import { ActivityFilterNetworkProvider } from './ActivityFilterNetworkContext';
import { ActivityFilterSelector } from './components/ActivityFilterSelector';
import { NetworkFilterSelector } from './components/NetworkFilterSelector';
import { PortfolioTabLoadingSpinner } from '../PortfolioTabLoadingSpinner';
import { TransactionList } from './components/TransactionList';
import { useUrlState } from './hooks/useUrlState';
import { ActivityFilter } from './types';

export const ActivityTab: FC = () => {
  const isMainnet = useIsMainnet();
  const urlState = useUrlState();
  const { networks, getNetwork } = useNetworkContext();

  const [filter, setFilter] = useState<ActivityFilter>(
    urlState.filter ?? 'All',
  );
  const [networkChainId, setNetworkChainId] = useState<Network['chainId']>(
    urlState.network ||
      (isMainnet ? ChainId.AVALANCHE_MAINNET_ID : ChainId.AVALANCHE_TESTNET_ID),
  );

  const activityFilterNetwork = useMemo(
    () =>
      networks.find((candidate) => candidate.chainId === networkChainId) ??
      getNetwork(networkChainId),
    [getNetwork, networkChainId, networks],
  );

  return (
    <ActivityFilterNetworkProvider network={activityFilterNetwork}>
      <Stack gap={1.25}>
        <Stack direction="row" justifyContent="space-between">
          <ActivityFilterSelector
            selected={filter}
            onChange={(newFilter) => {
              setFilter(newFilter);
              urlState.update(newFilter, networkChainId);
            }}
          />

          <NetworkFilterSelector
            selected={networkChainId}
            onChange={(network) => {
              setNetworkChainId(network.chainId);
              urlState.update(filter, network.chainId);
            }}
          />
        </Stack>
        <Suspense fallback={<PortfolioTabLoadingSpinner />}>
          <TransactionList filter={filter} networkChainId={networkChainId} />
        </Suspense>
      </Stack>
    </ActivityFilterNetworkProvider>
  );
};
