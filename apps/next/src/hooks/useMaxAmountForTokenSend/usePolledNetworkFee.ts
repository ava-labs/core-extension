import { useEffect, useState } from 'react';

import { NetworkFee } from '@core/types';
import { useNetworkFeeContext } from '@core/ui';

export const NETWORK_FEE_REFRESH_INTERVAL_MS = 30_000;

type PolledFee = { chainId: number; fee: NetworkFee };

export const usePolledNetworkFee = (chainId?: number): NetworkFee | null => {
  const { getNetworkFee } = useNetworkFeeContext();
  const [polled, setPolled] = useState<PolledFee | null>(null);

  useEffect(() => {
    if (chainId === undefined) {
      return;
    }

    let isActive = true;
    let timer: ReturnType<typeof setTimeout>;

    const refresh = () => {
      getNetworkFee(chainId)
        .then((fee) => {
          if (isActive && fee) {
            setPolled({ chainId, fee });
          }
        })
        .catch((error) => {
          console.warn('Failed to refresh the network fee:', error);
        })
        .finally(() => {
          if (isActive) {
            timer = setTimeout(refresh, NETWORK_FEE_REFRESH_INTERVAL_MS);
          }
        });
    };

    refresh();

    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [chainId, getNetworkFee]);

  return polled && polled.chainId === chainId ? polled.fee : null;
};
