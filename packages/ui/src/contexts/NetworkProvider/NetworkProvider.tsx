import { AvalancheCaip2ChainId, ChainId } from '@avalabs/core-chains-sdk';
import {
  Avalanche,
  BitcoinProvider,
  JsonRpcBatchInternal,
} from '@avalabs/core-wallets-sdk';
import {
  CustomNetworkPayload,
  ExtensionRequest,
  Network,
  NetworkOverrides,
  NetworkWithCaipId,
} from '@core/types';

import {
  buildCoreEth,
  getNetworkCaipId,
  getProviderForNetwork,
  updateIfDifferent,
} from '@core/common';
import {
  AddEnabledNetworkHandler,
  AddFavoriteNetworkHandler,
  GetNetworksStateHandler,
  RemoveCustomNetworkHandler,
  RemoveEnabledNetworkHandler,
  RemoveFavoriteNetworkHandler,
  SaveCustomNetworkHandler,
  SetActiveNetworkHandler,
  SetDevelopermodeNetworkHandler,
  UpdateDefaultNetworkHandler,
} from '@core/service-worker';
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { filter, map } from 'rxjs';
import { useAnalyticsContext } from '../AnalyticsProvider';
import { useConnectionContext } from '../ConnectionProvider';
import { isNetworkUpdatedEvent } from './isNetworkUpdatedEvent';
import { networkChanged } from './networkChanges';
import { promoteAvalancheNetworks } from './networkSortingFn';
import { networksUpdatedEventListener } from './networksUpdatedEventListener';

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
  enabledNetworks: NetworkWithCaipId[];
  addFavoriteNetwork(chainId: number): void;
  removeFavoriteNetwork(chainId: number): void;
  isFavoriteNetwork(chainId: number): boolean;
  enableNetwork(chainId: number): void;
  disableNetwork(chainId: number): void;
  customNetworks: NetworkWithCaipId[];
  isCustomNetwork(chainId: number): boolean;
  isChainIdExist(chainId: number): boolean;
  getNetwork(chainId: number | string): NetworkWithCaipId | undefined;
  avaxProviderC?: JsonRpcBatchInternal;
  avaxProviderP?: Avalanche.JsonRpcProvider;
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
  enabledNetworks: [],
  addFavoriteNetwork() {},
  removeFavoriteNetwork() {},
  isFavoriteNetwork: () => false,
  enableNetwork() {},
  disableNetwork() {},
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
export function NetworkContextProvider({ children }: PropsWithChildren) {
  const [network, setNetwork] = useState<NetworkWithCaipId | undefined>();
  const [networks, setNetworks] = useState<NetworkWithCaipId[]>([]);
  const [customNetworks, setCustomNetworks] = useState<number[]>([]);
  const [favoriteNetworks, setFavoriteNetworks] = useState<number[]>([]);
  const [enabledNetworks, setEnabledNetworks] = useState<number[]>([]);
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
    [favoriteNetworks, network, networks],
  );

  const getEnabledNetworks = useMemo(
    () =>
      networks
        .filter((networkItem) => {
          return enabledNetworks
            ? enabledNetworks.includes(networkItem.chainId)
            : false;
        })
        .filter((n) => {
          return (
            (!network?.isTestnet && !n.isTestnet) ||
            (network?.isTestnet && n.isTestnet)
          );
        }),
    [enabledNetworks, network?.isTestnet, networks],
  );

  const getCustomNetworks = useMemo(
    () =>
      networks.filter((networkItem) =>
        customNetworks.includes(networkItem.chainId),
      ),
    [customNetworks, networks],
  );

  const isChainIdExist = useCallback(
    (lookupChainId: number) =>
      (networks ?? []).some(({ chainId }) => chainId === lookupChainId),
    [networks],
  );

  const isCustomNetwork = useCallback(
    (chainId: number) => customNetworks.includes(chainId),
    [customNetworks],
  );

  const getNetwork = useCallback(
    (lookupChainId: number | string) => {
      // If Core Eth is requested, we need to build it (it is not present on the network list).
      if (lookupChainId === AvalancheCaip2ChainId.C) {
        return buildCoreEth(getNetwork(ChainId.AVALANCHE_MAINNET_ID));
      } else if (lookupChainId === AvalancheCaip2ChainId.C_TESTNET) {
        return buildCoreEth(getNetwork(ChainId.AVALANCHE_TESTNET_ID));
      }

      return networks.find(
        ({ chainId, caipId }) =>
          chainId === lookupChainId || caipId === lookupChainId,
      );
    },
    [networks],
  );

  const [bitcoinProvider, setBitcoinProvider] = useState<BitcoinProvider>();
  const [ethereumProvider, setEthereumProvider] =
    useState<JsonRpcBatchInternal>();
  const [avaxProviderC, setAvaxProviderC] = useState<JsonRpcBatchInternal>();

  useEffect(() => {
    if (!network) {
      setBitcoinProvider(undefined);
      setEthereumProvider(undefined);
      setAvaxProviderC(undefined);
      return;
    }

    let isMounted = true;

    const avaxNetworkC = getNetwork(
      network.isTestnet
        ? ChainId.AVALANCHE_TESTNET_ID
        : ChainId.AVALANCHE_MAINNET_ID,
    );
    const ethNetwork = getNetwork(
      network.isTestnet
        ? ChainId.ETHEREUM_TEST_SEPOLIA
        : ChainId.ETHEREUM_HOMESTEAD,
    );
    const btcNetwork = getNetwork(
      network.isTestnet ? ChainId.BITCOIN_TESTNET : ChainId.BITCOIN,
    );

    function updateIfMounted(setter: Dispatch<SetStateAction<any>>) {
      return (p) => {
        if (isMounted) {
          setter(p);
        }
      };
    }

    if (avaxNetworkC) {
      getProviderForNetwork(avaxNetworkC).then(
        updateIfMounted(setAvaxProviderC),
      );
    }
    if (ethNetwork) {
      getProviderForNetwork(ethNetwork).then(
        updateIfMounted(setEthereumProvider),
      );
    }
    if (btcNetwork) {
      getProviderForNetwork(btcNetwork).then(
        updateIfMounted(setBitcoinProvider),
      );
    }

    return () => {
      isMounted = false;
    };
  }, [getNetwork, network]);

  const getNetworkState = useCallback(() => {
    return request<GetNetworksStateHandler>({
      method: ExtensionRequest.NETWORKS_GET_STATE,
    }).then((result) => {
      updateIfDifferent(
        setNetworks,
        result.networks.sort(promoteAvalancheNetworks),
      );
      updateIfDifferent(setNetwork, result.activeNetwork);
      networkChanged.dispatch(result.activeNetwork?.caipId);
      updateIfDifferent(
        setFavoriteNetworks,
        result.favoriteNetworks.sort(promoteAvalancheNetworks),
      );
      updateIfDifferent(
        setEnabledNetworks,
        result.enabledNetworks.sort(promoteAvalancheNetworks),
      );
      updateIfDifferent(
        setCustomNetworks,
        result.customNetworks.sort(promoteAvalancheNetworks),
      );
    });
  }, [request]);

  const removeCustomNetwork = async (chainId: number) => {
    return request<RemoveCustomNetworkHandler>({
      method: ExtensionRequest.NETWORK_REMOVE_CUSTOM,
      params: [chainId],
    }).then(getNetworkState);
  };

  const saveCustomNetwork = async (customNetwork: CustomNetworkPayload) => {
    const result = await request<SaveCustomNetworkHandler>({
      method: ExtensionRequest.NETWORK_SAVE_CUSTOM,
      params: [customNetwork],
    }).then(getNetworkState);

    const chainId =
      typeof customNetwork.chainId === 'string'
        ? parseInt(customNetwork.chainId, 16)
        : customNetwork.chainId;

    capture('NetworkFavoriteAdded', {
      networkChainId: chainId,
      isCustom: true,
    });

    return result;
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
        map((evt) => evt.value),
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
        map((evt) => evt.value),
      )
      .subscribe(async (result) => {
        updateIfDifferent(
          setNetworks,
          result.networks.sort(promoteAvalancheNetworks),
        );
        updateIfDifferent(
          setFavoriteNetworks,
          result.favoriteNetworks.sort(promoteAvalancheNetworks),
        );
        updateIfDifferent(
          setEnabledNetworks,
          result.enabledNetworks.sort(promoteAvalancheNetworks),
        );
        setNetwork((currentNetwork) => {
          const newNetwork = result.activeNetwork ?? currentNetwork; // do not delete currently set network
          networkChanged.dispatch(newNetwork?.caipId);

          return newNetwork;
        });
        setCustomNetworks(
          Object.values(result.customNetworks)
            .sort(promoteAvalancheNetworks)
            .map(({ chainId }) => chainId),
        );
      });

    return () => {
      activeNetworkSubscription.unsubscribe();
      networksSubscription.unsubscribe();
    };
  }, [events, getNetworkState]);

  const enableNetwork = useCallback(
    (chainId: number) => {
      request<AddEnabledNetworkHandler>({
        method: ExtensionRequest.ENABLE_NETWORK,
        params: chainId,
      }).then((result) =>
        setEnabledNetworks(result.sort(promoteAvalancheNetworks)),
      );
    },
    [request],
  );

  const disableNetwork = useCallback(
    (chainId: number) => {
      request<RemoveEnabledNetworkHandler>({
        method: ExtensionRequest.DISABLE_NETWORK,
        params: chainId,
      }).then((result) =>
        setEnabledNetworks(result.sort(promoteAvalancheNetworks)),
      );
    },
    [request],
  );

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
        enabledNetworks: getEnabledNetworks,
        addFavoriteNetwork: (chainId: number) => {
          request<AddFavoriteNetworkHandler>({
            method: ExtensionRequest.NETWORK_ADD_FAVORITE_NETWORK,
            params: [chainId],
          }).then((result) => {
            setFavoriteNetworks(result.sort(promoteAvalancheNetworks));
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
        enableNetwork,
        disableNetwork,
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
