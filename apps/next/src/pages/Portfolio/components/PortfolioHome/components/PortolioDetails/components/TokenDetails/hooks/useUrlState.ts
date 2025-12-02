import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { ActivityFilter } from '../../ActivityTab/types';
import { Network } from '@avalabs/vm-module-types';
import { useQueryParams } from '@core/ui';
import { TabName } from '../components/XPChains/Tabs';

const searchKeys = {
  activityFilter: 'tokenActivityFilter',
  network: 'tokenActivityNetwork',
  token: 'tokenActivityToken',
  xpChainTab: 'tokenXpChainTab',
} as const;

export function useUrlState() {
  const { replace } = useHistory();
  const searchParams = useQueryParams();
  const update = useCallback(
    (
      newFilter: ActivityFilter | undefined,
      newNetwork: Network['chainId'],
      newTokenAddress: string,
      newXpChainTab?: TabName,
    ) => {
      const params = new URLSearchParams();

      // Only add params that have values (not undefined)
      if (newFilter) {
        params.set(searchKeys.activityFilter, newFilter);
      }
      if (newNetwork) {
        params.set(searchKeys.network, String(newNetwork));
      }
      if (newTokenAddress) {
        params.set(searchKeys.token, newTokenAddress);
      }
      if (newXpChainTab) {
        params.set(searchKeys.xpChainTab, newXpChainTab);
      }

      replace({ search: params.toString() });
    },
    [replace],
  );

  const filterValue = searchParams.get(searchKeys.activityFilter);
  const xpChainTabValue = searchParams.get(searchKeys.xpChainTab);

  return {
    filter:
      filterValue && filterValue !== 'undefined'
        ? (filterValue as ActivityFilter)
        : undefined,
    network: Number(searchParams.get(searchKeys.network)) || undefined,
    tokenAddress: searchParams.get(searchKeys.token) || undefined,
    xpChainTab:
      xpChainTabValue && xpChainTabValue !== 'undefined'
        ? (xpChainTabValue as TabName)
        : undefined,
    update,
  };
}
