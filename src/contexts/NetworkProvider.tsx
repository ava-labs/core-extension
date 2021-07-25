import React, { createContext, useContext, useEffect, useState } from 'react';
import { Network, NetworkConstants } from '@avalabs/avalanche-wallet-sdk';
import {
  getFromStorage,
  saveToStorage,
  storageEventListener,
} from '@src/utils/storage';

export const MAINNET_NETWORK = {
  config: NetworkConstants.MainnetConfig,
  name: 'Avalanche Mainnet C-Chain',
  chainId: '0xa86a',
};
export const FUJI_NETWORK = {
  config: NetworkConstants.TestnetConfig,
  name: ' Avalanche FUJI C-Chain',
  chainId: '0xa869',
};
export const LOCAL_NETWORK = {
  config: NetworkConstants.LocalnetConfig,
  name: 'Avalanche Local',
  chainId: '43112',
};

export interface ActiveNetwork {
  config: Network.NetworkConfig;
  name: string;
  chainId: string;
}

export const NETWORK_STORAGE_KEY = 'network';

export const getNetworkFromStorage = () =>
  getFromStorage<{ network: string }>(NETWORK_STORAGE_KEY).then((result) => {
    const { network } = result;
    return networks.get(network) || MAINNET_NETWORK;
  });

const networks = new Map<string, ActiveNetwork>([
  [MAINNET_NETWORK.name, MAINNET_NETWORK],
  [FUJI_NETWORK.name, FUJI_NETWORK],
  [LOCAL_NETWORK.name, LOCAL_NETWORK],
]);

const NetworkContext = createContext<{
  network?: ActiveNetwork;
  setNetwork(network: ActiveNetwork): void;
  networks: ActiveNetwork[];
}>({} as any);

export function NetworkContextProvider({ children }: { children: any }) {
  const [network, _setNetwork] = useState<ActiveNetwork>(MAINNET_NETWORK);

  function setNetwork(net: ActiveNetwork) {
    Network.setNetwork(net.config);
    _setNetwork(net);
    saveToStorage({ [NETWORK_STORAGE_KEY]: net.name });
  }

  useEffect(() => {
    getNetworkFromStorage().then(setNetwork);
  }, []);

  return (
    <NetworkContext.Provider
      value={{ network, setNetwork, networks: Array.from(networks.values()) }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetworkContext() {
  return useContext(NetworkContext);
}

export function getNetworkChangedUpdates() {
  return storageEventListener<ActiveNetwork>()
    .filter((evt) => !!evt.changes[NETWORK_STORAGE_KEY])
    .map((evt) => {
      const networkStore = evt.changes[NETWORK_STORAGE_KEY].newValue;
      return networks.get(networkStore);
    });
}
