import { createContext, useContext, useEffect, useState } from 'react';
import { useConnectionContext } from './ConnectionProvider';
import { filter, map } from 'rxjs';
import { networkUpdatedEventListener } from '@src/background/services/network/events/networkUpdatedEventListener';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { Network } from '@avalabs/chains-sdk';
import { networksUpdatedEventListener } from '@src/background/services/network/events/networksUpdatedEventListener';

const NetworkContext = createContext<{
  network?: Network;
  setNetwork(network: Network): void;
  networks: Network[];
  setDeveloperMode(status: boolean): void;
  isDeveloperMode: boolean;
}>({} as any);

/**
 * Network is being saved to chrome storage so we can share it across all contexts. With that when the
 * user changes the network we write that to storage, storage then fires an event and all contexts receive that
 * event. Thus updating all instances of the network provider and everything stays in sync.
 */
export function NetworkContextProvider({ children }: { children: any }) {
  const [network, setNetwork] = useState<Network>();
  const [networks, setNetworks] = useState<Network[]>([]);
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);
  const { request, events } = useConnectionContext();

  useEffect(() => {
    request({
      method: ExtensionRequest.NETWORK_GET_NETWORKS,
    }).then((networks) => {
      setNetworks(networks);
    });

    request({
      method: ExtensionRequest.NETWORK_GET_SELECTED,
    }).then((network) => {
      setNetwork(network);
    });

    request({
      method: ExtensionRequest.NETWORK_GET_DEVELOPER_MODE,
    }).then((result) => {
      setIsDeveloperMode(result);
    });

    events()
      .pipe(
        filter(networkUpdatedEventListener),
        map((evt) => evt.value)
      )
      .subscribe((result) => {
        setNetwork(result);
      });

    events()
      .pipe(
        filter(networksUpdatedEventListener),
        map((evt) => evt.value)
      )
      .subscribe((result) => {
        setNetworks(result.networks);
        setNetwork(result.activeNetwork);
        setIsDeveloperMode(result.isDeveloperMode);
      });
  }, [events, request]);

  return (
    <NetworkContext.Provider
      value={{
        network,
        setNetwork: (network: Network) =>
          request({
            method: ExtensionRequest.NETWORK_SET_SELECTED,
            params: [network.chainId],
          }),
        networks,
        setDeveloperMode: (status: boolean) =>
          request({
            method: ExtensionRequest.NETWORK_SET_DEVELOPER_MODE,
            params: [status],
          }),
        isDeveloperMode,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetworkContext() {
  return useContext(NetworkContext);
}
