import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useConnectionContext } from './ConnectionProvider';
import { filter, map } from 'rxjs';
import { networkUpdatedEventListener } from '@src/background/services/network/events/networkUpdatedEventListener';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { Network } from '@avalabs/chains-sdk';
import { networksUpdatedEventListener } from '@src/background/services/network/events/networksUpdatedEventListener';
import { useAnalyticsContext } from './AnalyticsProvider';
import { SetSelectedNetworkHandler } from '@src/background/services/network/handlers/setSelectedNetwork';
import { SetDevelopermodeNetworkHandler } from '@src/background/services/network/handlers/setDeveloperMode';
import { GetNetworksStateHandler } from '@src/background/services/network/handlers/getNetworkState';
import { RemoveCustomNetworkHandler } from '@src/background/services/network/handlers/removeCustomNetwork';
import { RemoveFavoriteNetworkHandler } from '@src/background/services/network/handlers/removeFavoriteNetwork';
import { SaveCustomNetworkHandler } from '@src/background/services/network/handlers/saveCustomNetwork';
import { AddFavoriteNetworkHandler } from '@src/background/services/network/handlers/addFavoriteNetwork';

const NetworkContext = createContext<{
  network?: Network | undefined;
  setNetwork(network: Network): void;
  networks: Network[];
  setDeveloperMode(status: boolean): void;
  saveCustomNetwork(network: Network): Promise<unknown>;
  removeCustomNetwork(chainId: number): Promise<unknown>;
  isDeveloperMode: boolean;
  favoriteNetworks: Network[];
  addFavoriteNetwork(chainId: number): void;
  removeFavoriteNetwork(chainId: number): void;
  isFavoriteNetwork(chainId: number): boolean;
  customNetworks: Network[];
  isCustomNetwork(chainId: number): boolean;
  isChainIdExist(chainId: number): boolean;
}>({} as any);

/**
 * Network is being saved to chrome storage so we can share it across all contexts. With that when the
 * user changes the network we write that to storage, storage then fires an event and all contexts receive that
 * event. Thus updating all instances of the network provider and everything stays in sync.
 */
export function NetworkContextProvider({ children }: { children: any }) {
  const [network, setNetwork] = useState<Network | undefined>();
  const [networks, setNetworks] = useState<Network[]>([]);
  const [customNetworks, setCustomNetworks] = useState<number[]>([]);
  const [favoriteNetworks, setFavoriteNetworks] = useState<number[]>([]);
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);
  const { request, events } = useConnectionContext();
  const { capture } = useAnalyticsContext();

  const getFavoriteNetworks = useMemo(
    () =>
      networks
        .filter((networkItem) => favoriteNetworks.includes(networkItem.chainId))
        .filter(
          (network) =>
            (!isDeveloperMode && !network.isTestnet) ||
            (isDeveloperMode && network.isTestnet)
        ),
    [favoriteNetworks, isDeveloperMode, networks]
  );

  const getCustomNetworks = useMemo(
    () =>
      networks.filter((networkItem) =>
        customNetworks.includes(networkItem.chainId)
      ),
    [customNetworks, networks]
  );

  const isChainIdExist = useMemo(
    () => (chainId: number) =>
      networks && !!networks.find((network) => network.chainId === chainId),
    [networks]
  );

  const getNetworkState = useCallback(() => {
    request<GetNetworksStateHandler>({
      method: ExtensionRequest.NETWORKS_GET_STATE,
    }).then((result) => {
      const {
        networks,
        isDeveloperMode,
        network,
        favoriteNetworks,
        customNetworks,
      } = result;
      setNetworks(networks);
      setNetwork(network);
      setIsDeveloperMode(isDeveloperMode);
      setFavoriteNetworks(favoriteNetworks);
      setCustomNetworks(customNetworks);
    });
  }, [request]);

  const removeCustomNetwork = async (chainId: number) => {
    return request<RemoveCustomNetworkHandler>({
      method: ExtensionRequest.NETWORK_REMOVE_CUSTOM,
      params: [chainId],
    }).then(() => {
      getNetworkState();
    });
  };

  const saveCustomNetwork = async (network: Network) => {
    return request<SaveCustomNetworkHandler>({
      method: ExtensionRequest.NETWORK_SAVE_CUSTOM,
      params: [network],
    }).then(() => {
      getNetworkState();
    });
  };

  useEffect(() => {
    getNetworkState();
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
  }, [events, getNetworkState, request]);

  return (
    <NetworkContext.Provider
      value={{
        network,
        setNetwork: (network: Network) =>
          request<SetSelectedNetworkHandler>({
            method: ExtensionRequest.NETWORK_SET_SELECTED,
            params: [network.chainId],
          }),
        networks,
        setDeveloperMode: (status: boolean) =>
          request<SetDevelopermodeNetworkHandler>({
            method: ExtensionRequest.NETWORK_SET_DEVELOPER_MODE,
            params: [status],
          }),
        saveCustomNetwork,
        removeCustomNetwork,
        isDeveloperMode,
        favoriteNetworks: getFavoriteNetworks,
        addFavoriteNetwork: (chainId: number) => {
          request<AddFavoriteNetworkHandler>({
            method: ExtensionRequest.NETWORK_ADD_FAVORITE_NETWORK,
            params: [chainId],
          }).then((result) => {
            setFavoriteNetworks(result);
            capture('NetworkFavoriteAdded', {
              networkChainId: chainId,
            });
          });
        },
        removeFavoriteNetwork: async (chainId: number) => {
          await request<RemoveFavoriteNetworkHandler>({
            method: ExtensionRequest.NETWORK_REMOVE_FAVORITE_NETWORK,
            params: [chainId],
          }).then((result) => {
            setFavoriteNetworks(result);
            capture('NetworkFavoriteRemoved', {
              networkChainId: chainId,
            });
          });
        },
        isFavoriteNetwork: (chainId: number) =>
          favoriteNetworks.includes(chainId),
        customNetworks: getCustomNetworks,
        isCustomNetwork: (chainId: number) => customNetworks.includes(chainId),
        isChainIdExist,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetworkContext() {
  return useContext(NetworkContext);
}
