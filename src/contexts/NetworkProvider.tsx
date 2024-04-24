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
import { networksUpdatedEventListener } from '@src/background/services/network/events/networksUpdatedEventListener';
import { useAnalyticsContext } from './AnalyticsProvider';
import { SetSelectedNetworkHandler } from '@src/background/services/network/handlers/setSelectedNetwork';
import { SetDevelopermodeNetworkHandler } from '@src/background/services/network/handlers/setDeveloperMode';
import { GetNetworksStateHandler } from '@src/background/services/network/handlers/getNetworkState';
import { RemoveCustomNetworkHandler } from '@src/background/services/network/handlers/removeCustomNetwork';
import { RemoveFavoriteNetworkHandler } from '@src/background/services/network/handlers/removeFavoriteNetwork';
import { SaveCustomNetworkHandler } from '@src/background/services/network/handlers/saveCustomNetwork';
import { AddFavoriteNetworkHandler } from '@src/background/services/network/handlers/addFavoriteNetwork';
import { UpdateDefaultNetworkHandler } from '@src/background/services/network/handlers/updateDefaultNetwork';
import {
  Network,
  NetworkOverrides,
} from '@src/background/services/network/models';
import { JsonRpcBatchInternal } from '@avalabs/wallets-sdk';
import { ChainId } from '@avalabs/chains-sdk';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';

const NetworkContext = createContext<{
  network?: Network | undefined;
  setNetwork(network: Network): void;
  networks: Network[];
  setDeveloperMode(status: boolean): void;
  saveCustomNetwork(network: Network): Promise<unknown>;
  updateDefaultNetwork(network: NetworkOverrides): Promise<unknown>;
  removeCustomNetwork(chainId: number): Promise<unknown>;
  isDeveloperMode: boolean;
  favoriteNetworks: Network[];
  addFavoriteNetwork(chainId: number): void;
  removeFavoriteNetwork(chainId: number): void;
  isFavoriteNetwork(chainId: number): boolean;
  customNetworks: Network[];
  isCustomNetwork(chainId: number): boolean;
  isChainIdExist(chainId: number): boolean;
  getNetwork(chainId: number): Network | undefined;
  avalancheProvider?: JsonRpcBatchInternal;
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
  const { request, events } = useConnectionContext();
  const { capture } = useAnalyticsContext();

  const getFavoriteNetworks = useMemo(
    () =>
      networks
        .filter((networkItem) => favoriteNetworks.includes(networkItem.chainId))
        .filter((n) => {
          return (
            (!network?.isTestnet && !n.isTestnet) ||
            (network?.isTestnet && n.isTestnet)
          );
        }),
    [favoriteNetworks, network, networks]
  );

  const getCustomNetworks = useMemo(
    () =>
      networks.filter((networkItem) =>
        customNetworks.includes(networkItem.chainId)
      ),
    [customNetworks, networks]
  );

  const isChainIdExist = useCallback(
    (lookupChainId: number) =>
      (networks ?? []).some(({ chainId }) => chainId === lookupChainId),
    [networks]
  );

  const isCustomNetwork = useCallback(
    (chainId: number) => customNetworks.includes(chainId),
    [customNetworks]
  );

  const getNetwork = useCallback(
    (lookupChainId: number) => {
      if (isNaN(lookupChainId)) {
        return;
      }

      return networks.find(({ chainId }) => chainId === lookupChainId);
    },
    [networks]
  );

  const avalancheProvider = useMemo(() => {
    const avaxNetwork = getNetwork(
      network?.isTestnet
        ? ChainId.AVALANCHE_TESTNET_ID
        : ChainId.AVALANCHE_MAINNET_ID
    );

    if (!avaxNetwork) {
      return;
    }

    return getProviderForNetwork(avaxNetwork) as JsonRpcBatchInternal;
  }, [network?.isTestnet, getNetwork]);

  const getNetworkState = useCallback(() => {
    return request<GetNetworksStateHandler>({
      method: ExtensionRequest.NETWORKS_GET_STATE,
    }).then((result) => {
      setNetworks(result.networks);
      setNetwork(result.activeNetwork);
      setFavoriteNetworks(result.favoriteNetworks);
      setCustomNetworks(result.customNetworks);
    });
  }, [request]);

  const removeCustomNetwork = async (chainId: number) => {
    return request<RemoveCustomNetworkHandler>({
      method: ExtensionRequest.NETWORK_REMOVE_CUSTOM,
      params: [chainId],
    }).then(getNetworkState);
  };

  const saveCustomNetwork = async (customNetwork: Network) => {
    return request<SaveCustomNetworkHandler>({
      method: ExtensionRequest.NETWORK_SAVE_CUSTOM,
      params: [customNetwork],
    }).then(getNetworkState);
  };

  const updateDefaultNetwork = async (networkOverrides: NetworkOverrides) => {
    return request<UpdateDefaultNetworkHandler>({
      method: ExtensionRequest.NETWORK_UPDATE_DEFAULT,
      params: { network: networkOverrides },
    }).then(getNetworkState);
  };

  useEffect(() => {
    getNetworkState();
    const activeNetworkSubscription = events()
      .pipe(
        filter(networkUpdatedEventListener),
        map((evt) => evt.value)
      )
      .subscribe((result) => {
        if (!result) {
          return;
        }
        getNetworkState();
        setNetwork(result);
      });

    const networksSubscription = events()
      .pipe(
        filter(networksUpdatedEventListener),
        map((evt) => evt.value)
      )
      .subscribe((result) => {
        setNetworks(result.networks);
        setNetwork((currentNetwork) => result.activeNetwork ?? currentNetwork); // do not delete currently set network
        setFavoriteNetworks(result.favoriteNetworks);
        setCustomNetworks(
          Object.values(result.customNetworks).map(({ chainId }) => chainId)
        );
      });

    return () => {
      activeNetworkSubscription.unsubscribe();
      networksSubscription.unsubscribe();
    };
  }, [events, getNetworkState, request]);

  return (
    <NetworkContext.Provider
      value={{
        network,
        setNetwork: ({ chainId }: Network) =>
          request<SetSelectedNetworkHandler>({
            method: ExtensionRequest.NETWORK_SET_SELECTED,
            params: [chainId],
          }),
        networks,
        setDeveloperMode: (status: boolean) =>
          request<SetDevelopermodeNetworkHandler>({
            method: ExtensionRequest.NETWORK_SET_DEVELOPER_MODE,
            params: [status],
          }),
        saveCustomNetwork,
        updateDefaultNetwork,
        removeCustomNetwork,
        isDeveloperMode: !!network?.isTestnet,
        favoriteNetworks: getFavoriteNetworks,
        addFavoriteNetwork: (chainId: number) => {
          request<AddFavoriteNetworkHandler>({
            method: ExtensionRequest.NETWORK_ADD_FAVORITE_NETWORK,
            params: [chainId],
          }).then((result) => {
            setFavoriteNetworks(result);
            capture('NetworkFavoriteAdded', {
              networkChainId: chainId,
              isCustom: isCustomNetwork(chainId),
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
              isCustom: isCustomNetwork(chainId),
            });
          });
        },
        isFavoriteNetwork: (chainId: number) =>
          favoriteNetworks.includes(chainId),
        customNetworks: getCustomNetworks,
        isCustomNetwork,
        isChainIdExist,
        getNetwork,
        avalancheProvider,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetworkContext() {
  return useContext(NetworkContext);
}
