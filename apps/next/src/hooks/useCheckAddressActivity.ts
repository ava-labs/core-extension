import { useCallback } from 'react';
import { getEvmAddressFromPubKey } from '@avalabs/core-wallets-sdk';

import { ExtensionRequest } from '@core/types';
import { useConnectionContext } from '@core/ui';
import { GetHistoryHandler } from '@core/service-worker';

export const useCheckAddressActivity = () => {
  const { request } = useConnectionContext();

  return useCallback(
    async (publicKey: Buffer) => {
      const address = getEvmAddressFromPubKey(publicKey);
      const history = await request<GetHistoryHandler>(
        {
          method: ExtensionRequest.HISTORY_GET,
          params: [address],
        },
        {
          scope: 'eip155:43114',
        },
      );

      return history.length > 0;
    },
    [request],
  );
};
