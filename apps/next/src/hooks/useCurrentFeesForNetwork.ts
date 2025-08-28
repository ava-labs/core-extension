import { NetworkFee, NetworkWithCaipId } from '@core/types';
import { useEffect, useState } from 'react';

import { useNetworkFeeContext } from '@core/ui';

export const useCurrentFeesForNetwork = (network: NetworkWithCaipId) => {
  const { getNetworkFee } = useNetworkFeeContext();

  const [networkFee, setNetworkFee] = useState<NetworkFee | null>();

  useEffect(() => {
    let isMounted = true;

    getNetworkFee(network.caipId).then((newFee) => {
      if (isMounted) {
        setNetworkFee(newFee);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [getNetworkFee, network]);

  return networkFee;
};
