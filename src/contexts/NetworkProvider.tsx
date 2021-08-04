import React, { createContext, useContext, useEffect, useState } from 'react';
import { Network, NetworkConstants } from '@avalabs/avalanche-wallet-sdk';
import {
  getFromStorage,
  saveToStorage,
  storageEventListener,
} from '@src/utils/storage';
import { Signal } from 'micro-signals';

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

export const networks = new Map<string, ActiveNetwork>([
  [MAINNET_NETWORK.name, MAINNET_NETWORK],
  [FUJI_NETWORK.name, FUJI_NETWORK],
  [LOCAL_NETWORK.name, LOCAL_NETWORK],
]);

const NetworkContext = createContext<{
  network?: ActiveNetwork;
  setNetwork(network: ActiveNetwork): void;
  networks: ActiveNetwork[];
}>({} as any);

function saveNetworkToStorage(net: ActiveNetwork) {
  saveToStorage({ [NETWORK_STORAGE_KEY]: net.name });
}
/**
 * Network is being saved to chrome storage so we can share it across all contexts. With that when the
 * user changes the network we write that to storage, storage then fires an event and all contexts recieve that
 * event. Thus updating all instances of the network provider and everything stays in sync.
 */
export function NetworkContextProvider({ children }: { children: any }) {
  const [network, _setNetwork] = useState<ActiveNetwork>(MAINNET_NETWORK);

  function setNetwork(net?: ActiveNetwork) {
    if (net) {
      Network.setNetwork(net.config);
      _setNetwork(net);
    }
  }

  useEffect(() => {
    getNetworkChangedUpdates().add((net) => {
      setNetwork(net);
    });
  }, []);

  return (
    <NetworkContext.Provider
      value={{
        network,
        setNetwork: saveNetworkToStorage,
        networks: Array.from(networks.values()),
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetworkContext() {
  return useContext(NetworkContext);
}

/**
 * Since everything syncs with storage we create a stream and update it as
 * storage changes. Additionally we grab the first value from storage and stream
 * that immediately
 *
 * @returns an event listener that is in sync with storage
 */
export function getNetworkChangedUpdates() {
  const networkUpdates = new Signal<ActiveNetwork>();

  const networkUpdatedEvents = storageEventListener<ActiveNetwork>()
    .filter((evt) => !!evt.changes[NETWORK_STORAGE_KEY])
    .map((evt) => {
      const networkStore = evt.changes[NETWORK_STORAGE_KEY].newValue;
      return networks.get(networkStore);
    });

  getNetworkFromStorage().then((net) => networkUpdates.dispatch(net));

  return networkUpdates.merge(networkUpdatedEvents);
}
