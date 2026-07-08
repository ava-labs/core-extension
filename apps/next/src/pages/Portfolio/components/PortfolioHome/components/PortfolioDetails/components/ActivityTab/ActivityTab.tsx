import { ChainId, Network } from '@avalabs/core-chains-sdk';
import { Collapse, Stack } from '@avalabs/k2-alpine';
import { useIsMainnet } from '@core/ui';
import { FC, Suspense, useState } from 'react';
import { ActivityFilterSelector } from './components/ActivityFilterSelector';
import { NetworkFilterSelector } from './components/NetworkFilterSelector';
import {
  ActivityHistoryLoadingIndicator,
  TransactionList,
} from './components/TransactionList';
import { useUrlState } from './hooks/useUrlState';
import { ActivityFilter } from './types';
import {
  useIsRecurringSwapsEnabled,
  useRecurringSwapOrders,
} from '@/pages/Fusion/hooks';
import { RecurringSwapsEntryCard } from '@/pages/Fusion/components/RecurringSwap';

export const ActivityTab: FC = () => {
  const isMainnet = useIsMainnet();
  const urlState = useUrlState();
  const isRecurringSwapsEnabled = useIsRecurringSwapsEnabled();
  const { scheduledCount } = useRecurringSwapOrders();

  const [filter, setFilter] = useState<ActivityFilter>(
    urlState.filter ?? 'All',
  );
  const [networkChainId, setNetworkChainId] = useState<Network['chainId']>(
    urlState.network ||
      (isMainnet ? ChainId.AVALANCHE_MAINNET_ID : ChainId.AVALANCHE_TESTNET_ID),
  );

  return (
    <Stack gap={1.25} data-testid="activity-tab">
      <Collapse in={isRecurringSwapsEnabled && scheduledCount > 0}>
        <RecurringSwapsEntryCard scheduledCount={scheduledCount} />
      </Collapse>
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
          onChange={(newNetworkChainId) => {
            setNetworkChainId(newNetworkChainId);
            urlState.update(filter, newNetworkChainId);
          }}
        />
      </Stack>
      <Suspense fallback={<ActivityHistoryLoadingIndicator />}>
        <TransactionList
          key={networkChainId}
          filter={filter}
          networkChainId={networkChainId}
        />
      </Suspense>
    </Stack>
  );
};
