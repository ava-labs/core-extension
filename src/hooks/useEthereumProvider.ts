import { useEffect, useState } from 'react';
import { ChainId } from '@avalabs/core-chains-sdk';
import { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';

import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';

export const useEthereumProvider = (isTestnet) => {
  const { getNetwork } = useNetworkContext();

  const [provider, setProvider] = useState<JsonRpcBatchInternal>();

  useEffect(() => {
    const ethNetwork = getNetwork(
      isTestnet ? ChainId.ETHEREUM_TEST_SEPOLIA : ChainId.ETHEREUM_HOMESTEAD
    );

    if (!ethNetwork) {
      return;
    }

    let isMounted = true;

    getProviderForNetwork(ethNetwork).then((ethProvider) => {
      if (isMounted && ethProvider instanceof JsonRpcBatchInternal) {
        setProvider(ethProvider);
      }
    });

    return () => {
      isMounted = false;
    };
  });

  return provider;
};
