import { createContext, useContext, useEffect, useState } from 'react';
import {
  ActiveNetwork,
  MAINNET_NETWORK,
} from '@src/background/services/network/models';
import { useConnectionContext } from './ConnectionProvider';
import { LoadingIcon } from '@avalabs/react-components';
import { filter, map } from 'rxjs';
import { networkUpdatedEventListener } from '@src/background/services/network/events/networkUpdatedEventListener';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';

const NetworkContext = createContext<{
  network?: ActiveNetwork;
  setNetwork(network: ActiveNetwork): void;
  networks?: ActiveNetwork[];
  setDeveloperMode(status: boolean): void;
  supportedNetworks?: ActiveNetwork[];
  isDeveloperMode: boolean;
}>({} as any);

/**
 * Network is being saved to chrome storage so we can share it across all contexts. With that when the
 * user changes the network we write that to storage, storage then fires an event and all contexts recieve that
 * event. Thus updating all instances of the network provider and everything stays in sync.
 */
export function NetworkContextProvider({ children }: { children: any }) {
  const [network, setNetwork] = useState<ActiveNetwork>(MAINNET_NETWORK);
  const [networks, setNetworks] = useState<ActiveNetwork[]>();
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);
  const { request, events } = useConnectionContext();

  useEffect(() => {
    if (!request || !events) {
      return;
    }

    request({
      method: ExtensionRequest.NETWORK_GET_SELECTED,
      params: [],
    }).then((result) => {
      setNetwork(result);
    });

    request({
      method: ExtensionRequest.NETWORK_GET_DEVELOPER_MODE,
    }).then((result) => {
      setIsDeveloperMode(result);
    });

    const subscription = events()
      .pipe(
        filter(networkUpdatedEventListener),
        map((evt) => evt.value)
      )
      .subscribe((network) => {
        setNetwork(network.activeNetwork as ActiveNetwork);
        setIsDeveloperMode(network.isDeveloperMode);
      });
    return () => {
      subscription.unsubscribe();
    };
  }, [events, request]);

  useEffect(() => {
    request({
      method: ExtensionRequest.NETWORK_GET_SUPPORTED_NETWORKS,
    }).then((networks) => {
      setNetworks(networks);
    });
  }, [isDeveloperMode, request]);

  if (!request || !events) {
    return <LoadingIcon />;
  }

  return (
    <NetworkContext.Provider
      value={{
        network,
        setNetwork: (network: ActiveNetwork) =>
          request({
            method: ExtensionRequest.NETWORK_SET_SELECTED,
            params: [network.name],
          }),
        setDeveloperMode: (status: boolean) =>
          request({
            method: ExtensionRequest.NETWORK_SET_DEVELOPER_MODE,
            params: [status],
          }),
        networks,
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
