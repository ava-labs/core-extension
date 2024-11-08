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
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { networksUpdatedEventListener } from '@src/background/services/network/events/networksUpdatedEventListener';
import { useAnalyticsContext } from './AnalyticsProvider';
import { SetDevelopermodeNetworkHandler } from '@src/background/services/network/handlers/setDeveloperMode';
import { GetNetworksStateHandler } from '@src/background/services/network/handlers/getNetworkState';
import { RemoveCustomNetworkHandler } from '@src/background/services/network/handlers/removeCustomNetwork';
import { RemoveFavoriteNetworkHandler } from '@src/background/services/network/handlers/removeFavoriteNetwork';
import { SaveCustomNetworkHandler } from '@src/background/services/network/handlers/saveCustomNetwork';
import { AddFavoriteNetworkHandler } from '@src/background/services/network/handlers/addFavoriteNetwork';
import { UpdateDefaultNetworkHandler } from '@src/background/services/network/handlers/updateDefaultNetwork';
import {
  BitcoinProvider,
  JsonRpcBatchInternal,
} from '@avalabs/core-wallets-sdk';
import {
  CustomNetworkPayload,
  Network,
  NetworkOverrides,
  NetworkWithCaipId,
} from '@src/background/services/network/models';
import { isNetworkUpdatedEvent } from '@src/background/services/network/events/isNetworkUpdatedEvent';
import { SetActiveNetworkHandler } from '@src/background/services/network/handlers/setActiveNetwork';
import { updateIfDifferent } from '@src/utils/updateIfDifferent';
import { getNetworkCaipId } from '@src/utils/caipConversion';
import { networkChanged } from './NetworkProvider/networkChanges';
import { useBitcoinProvider } from '@src/hooks/useBitcoinProvider';
import { useEthereumProvider } from '@src/hooks/useEthereumProvider';
import { useAvalancheCProvider } from '@src/hooks/useAvalancheCProvider';

const NetworkContext = createContext<{
  network?: NetworkWithCaipId | undefined;
  setNetwork(network: Network): void;
  networks: NetworkWithCaipId[];
  setDeveloperMode(status: boolean): void;
  saveCustomNetwork(network: CustomNetworkPayload): Promise<unknown>;
  updateDefaultNetwork(network: NetworkOverrides): Promise<unknown>;
  removeCustomNetwork(chainId: number): Promise<unknown>;
  isDeveloperMode: boolean;
  favoriteNetworks: NetworkWithCaipId[];
  addFavoriteNetwork(chainId: number): void;
  removeFavoriteNetwork(chainId: number): void;
  isFavoriteNetwork(chainId: number): boolean;
  customNetworks: NetworkWithCaipId[];
  isCustomNetwork(chainId: number): boolean;
  isChainIdExist(chainId: number): boolean;
  getNetwork(chainId: number | string): NetworkWithCaipId | undefined;
  avaxProviderC?: JsonRpcBatchInternal;
  ethereumProvider?: JsonRpcBatchInternal;
  bitcoinProvider?: BitcoinProvider;
}>({
  network: undefined,
  setNetwork() {},
  networks: [],
  setDeveloperMode() {},
  async saveCustomNetwork() {},
  async updateDefaultNetwork() {},
  async removeCustomNetwork() {},
  isDeveloperMode: false,
  favoriteNetworks: [],
  addFavoriteNetwork() {},
  removeFavoriteNetwork() {},
  isFavoriteNetwork: () => false,
  customNetworks: [],
  isCustomNetwork: () => false,
  isChainIdExist: () => false,
  getNetwork: () => undefined,
  avaxProviderC: undefined,
  ethereumProvider: undefined,
  bitcoinProvider: undefined,
});

/**
 * Network is being saved to chrome storage so we can share it across all contexts. With that when the
 * user changes the network we write that to storage, storage then fires an event and all contexts receive that
 * event. Thus updating all instances of the network provider and everything stays in sync.
 */
export function NetworkContextProvider({ children }: { children: any }) {
  const [network, setNetwork] = useState<NetworkWithCaipId | undefined>();
  const [networks, setNetworks] = useState<NetworkWithCaipId[]>([]);
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
    (lookupChainId: number | string) => {
      return networks.find(
        ({ chainId, caipId }) =>
          chainId === lookupChainId || caipId === lookupChainId
      );
    },
    [networks]
  );

  const bitcoinProvider = useBitcoinProvider(Boolean(network?.isTestnet));
  const ethereumProvider = useEthereumProvider(Boolean(network?.isTestnet));
  const avaxProviderC = useAvalancheCProvider(Boolean(network?.isTestnet));

  const getNetworkState = useCallback(() => {
    return request<GetNetworksStateHandler>({
      method: ExtensionRequest.NETWORKS_GET_STATE,
    }).then((result) => {
      updateIfDifferent(setNetworks, result.networks);
      updateIfDifferent(setNetwork, result.activeNetwork);
      networkChanged.dispatch(result.activeNetwork?.caipId);
      updateIfDifferent(setFavoriteNetworks, result.favoriteNetworks);
      updateIfDifferent(setCustomNetworks, result.customNetworks);
    });
  }, [request]);

  const removeCustomNetwork = async (chainId: number) => {
    return request<RemoveCustomNetworkHandler>({
      method: ExtensionRequest.NETWORK_REMOVE_CUSTOM,
      params: [chainId],
    }).then(getNetworkState);
  };

  const saveCustomNetwork = async (customNetwork: CustomNetworkPayload) => {
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
        filter(isNetworkUpdatedEvent),
        map((evt) => evt.value)
      )
      .subscribe(async (newNetwork) => {
        if (!newNetwork) {
          return;
        }
        getNetworkState();
        setNetwork(newNetwork);
        networkChanged.dispatch(newNetwork.caipId);
      });

    const networksSubscription = events()
      .pipe(
        filter(networksUpdatedEventListener),
        map((evt) => evt.value)
      )
      .subscribe(async (result) => {
        updateIfDifferent(setNetworks, result.networks);
        updateIfDifferent(setFavoriteNetworks, result.favoriteNetworks);
        setNetwork((currentNetwork) => {
          const newNetwork = result.activeNetwork ?? currentNetwork; // do not delete currently set network
          networkChanged.dispatch(newNetwork?.caipId);

          return newNetwork;
        });
        setCustomNetworks(
          Object.values(result.customNetworks).map(({ chainId }) => chainId)
        );
      });

    return () => {
      activeNetworkSubscription.unsubscribe();
      networksSubscription.unsubscribe();
    };
  }, [events, getNetworkState]);

  return (
    <NetworkContext.Provider
      value={{
        network,
        setNetwork: (newNetwork: Network) =>
          request<SetActiveNetworkHandler>({
            method: ExtensionRequest.NETWORK_SET_ACTIVE,
            params: [getNetworkCaipId(newNetwork)],
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
        avaxProviderC,
        bitcoinProvider,
        ethereumProvider,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetworkContext() {
  return useContext(NetworkContext);
}
