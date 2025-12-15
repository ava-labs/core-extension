import { useCallback } from 'react';

import { isPrimaryAccount } from '@core/common';
import { ExtensionRequest, XPAddresses } from '@core/types';
import { useAccountsContext, useConnectionContext } from '@core/ui';
import { GetXPAddressesForAccountHandler } from '@core/service-worker';

export const useGetXPAddresses = () => {
  const {
    accounts: { active },
  } = useAccountsContext();
  const { request } = useConnectionContext();

  return useCallback(
    (vm: 'AVM' | 'PVM') => (): Promise<XPAddresses> => {
      if (!isPrimaryAccount(active)) {
        return Promise.resolve({
          externalAddresses: [],
          internalAddresses: [],
        });
      }

      return request<GetXPAddressesForAccountHandler>({
        method: ExtensionRequest.ACCOUNT_GET_XP_ADDRESSES,
        params: {
          id: active.id,
          vm,
        },
      });
    },
    [active, request],
  );
};
