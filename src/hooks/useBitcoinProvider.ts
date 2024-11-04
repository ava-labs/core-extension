import { useEffect, useState } from 'react';
import { ChainId } from '@avalabs/core-chains-sdk';
import { BitcoinProvider } from '@avalabs/core-wallets-sdk';

import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';

export const useBitcoinProvider = (isTestnet) => {
  const { getNetwork } = useNetworkContext();

  const [provider, setProvider] = useState<BitcoinProvider>();

  useEffect(() => {
    const btcNetwork = getNetwork(
      isTestnet ? ChainId.BITCOIN_TESTNET : ChainId.BITCOIN
    );

    if (!btcNetwork) {
      return;
    }

    let isMounted = true;

    getProviderForNetwork(btcNetwork).then((bitcoinProvider) => {
      if (isMounted && bitcoinProvider instanceof BitcoinProvider) {
        setProvider(bitcoinProvider);
      }
    });

    return () => {
      isMounted = false;
    };
  });

  return provider;
};
