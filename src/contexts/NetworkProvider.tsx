import { createContext, useContext, useEffect, useState } from 'react';
import {
  ActiveNetwork,
  MAINNET_NETWORK,
  supportedNetworks,
} from '@src/background/services/network/models';
import { useConnectionContext } from './ConnectionProvider';
import { LoadingIcon } from '@avalabs/react-components';
import { concat, filter, from, map } from 'rxjs';
import { networkUpdatedEventListener } from '@src/background/services/network/events/networkUpdatedEventListener';
import { ExtensionRequest } from '@src/background/connections/models';

const NetworkContext = createContext<{
  network?: ActiveNetwork;
  setNetwork(network: ActiveNetwork): void;
  networks: ActiveNetwork[];
}>({} as any);

/**
 * Network is being saved to chrome storage so we can share it across all contexts. With that when the
 * user changes the network we write that to storage, storage then fires an event and all contexts recieve that
 * event. Thus updating all instances of the network provider and everything stays in sync.
 */
export function NetworkContextProvider({ children }: { children: any }) {
  const [network, setNetwork] = useState<ActiveNetwork>(MAINNET_NETWORK);
  const { request, events } = useConnectionContext();

  useEffect(() => {
    if (!request || !events) {
      return;
    }
    concat(
      from(
        request({
          method: ExtensionRequest.NETWORK_GET_SELECTED,
        })
      ),
      events().pipe(
        filter(networkUpdatedEventListener),
        map((evt) => evt.value)
      )
    ).subscribe((result) => {
      setNetwork(result as any);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

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
        networks: Array.from(supportedNetworks.values()),
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetworkContext() {
  return useContext(NetworkContext);
}
