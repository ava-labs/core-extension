import { useEffect, useState } from 'react';
import { ChainId } from '@avalabs/core-chains-sdk';
import { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';

import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';

export const useAvalancheCProvider = (isTestnet) => {
  const { getNetwork } = useNetworkContext();

  const [provider, setProvider] = useState<JsonRpcBatchInternal>();

  useEffect(() => {
    const cChain = getNetwork(
      isTestnet ? ChainId.AVALANCHE_MAINNET_ID : ChainId.AVALANCHE_TESTNET_ID
    );

    if (!cChain) {
      return;
    }

    let isMounted = true;

    getProviderForNetwork(cChain).then((cChainProvider) => {
      if (isMounted && cChainProvider instanceof JsonRpcBatchInternal) {
        setProvider(cChainProvider);
      }
    });

    return () => {
      isMounted = false;
    };
  });

  return provider;
};
