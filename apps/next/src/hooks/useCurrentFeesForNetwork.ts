import { NetworkFee, NetworkWithCaipId } from '@core/types';
import { useEffect, useState } from 'react';

import { useNetworkFeeContext } from '@core/ui';

export const useCurrentFeesForNetwork = (network: NetworkWithCaipId) => {
  const { getNetworkFee } = useNetworkFeeContext();

  const [networkFee, setNetworkFee] = useState<NetworkFee | null>();

  useEffect(() => {
    getNetworkFee(network.caipId).then(setNetworkFee);
  }, [getNetworkFee, network]);

  return networkFee;
};
