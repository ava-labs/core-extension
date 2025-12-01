import { Network } from '@avalabs/vm-module-types';
import { useQueryParams } from '@core/ui';
import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { ActivityFilter } from '../types';

const searchKeys = {
  activityFilter: 'activityFilter',
  network: 'activityNetwork',
  tokenAddress: 'activityTokenAddress',
} as const;

export function useUrlState() {
  const { replace } = useHistory();
  const searchParams = useQueryParams();

  const update = useCallback(
    (
      newFilter: ActivityFilter,
      newNetwork: Network['chainId'],
      newTokenAddress: string,
    ) => {
      replace({
        search: `?${searchKeys.activityFilter}=${newFilter}&${searchKeys.network}=${newNetwork}&${searchKeys.tokenAddress}=${newTokenAddress}`,
      });
    },
    [replace],
  );

  return {
    filter:
      (searchParams.get(searchKeys.activityFilter) as ActivityFilter) ||
      undefined,
    network: Number(searchParams.get(searchKeys.network)) || undefined,
    tokenAddress: searchParams.get(searchKeys.tokenAddress) || undefined,
    update,
  };
}
