import React, { createContext, useContext, useEffect, useState } from 'react';
import { Network, NetworkConstants } from '@avalabs/avalanche-wallet-sdk';

export const MAINNET_NETWORK = {
  config: NetworkConstants.MainnetConfig,
  name: 'Avalanche Mainnet C-Chain',
};
export const FUJI_NETWORK = {
  config: NetworkConstants.TestnetConfig,
  name: ' Avalanche FUJI C-Chain',
};
export const LOCAL_NETWORK = {
  config: NetworkConstants.LocalnetConfig,
  name: 'Avalanche Local',
};

export interface ActiveNetwork {
  config: Network.NetworkConfig;
  name: string;
}

export const networks = [MAINNET_NETWORK, FUJI_NETWORK, LOCAL_NETWORK];
const NetworkContext = createContext<{
  network?: ActiveNetwork;
  setNetwork(network: ActiveNetwork): void;
  networks: typeof networks;
}>({} as any);

export function NetworkContextProvider({ children }: { children: any }) {
  const [network, _setNetwork] = useState<ActiveNetwork>(MAINNET_NETWORK);

  function setNetwork(net: ActiveNetwork) {
    Network.setNetwork(net.config);
    _setNetwork(net);
  }

  useEffect(() => {
    Network.setNetwork(network.config);
  }, []);

  return (
    <NetworkContext.Provider value={{ network, setNetwork, networks }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetworkContext() {
  return useContext(NetworkContext);
}
