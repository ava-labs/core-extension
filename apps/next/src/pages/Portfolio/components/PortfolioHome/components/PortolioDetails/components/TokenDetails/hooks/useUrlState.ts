import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { ActivityFilter } from '../../ActivityTab/types';
import { Network } from '@avalabs/vm-module-types';
import { useQueryParams } from '@core/ui';

const searchKeys = {
  activityFilter: 'tokenActivityFilter',
  network: 'tokenActivityNetwork',
  token: 'tokenActivityToken',
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
        search: `?${searchKeys.activityFilter}=${newFilter}&${searchKeys.network}=${newNetwork}&${searchKeys.token}=${newTokenAddress}`,
      });
    },
    [replace],
  );

  return {
    filter:
      (searchParams.get(searchKeys.activityFilter) as ActivityFilter) ||
      undefined,
    network: Number(searchParams.get(searchKeys.network)) || undefined,
    tokenAddress: searchParams.get(searchKeys.token) || undefined,
    update,
  };
}
