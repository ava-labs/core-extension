import { singleton } from 'tsyringe';
import { merge, pick } from 'lodash';
import {
  OnLock,
  OnStorageReady,
} from '@src/background/runtime/lifecycleCallbacks';
import { StorageService } from '../storage/StorageService';
import {
  NETWORK_LIST_STORAGE_KEY,
  NETWORK_STORAGE_KEY,
  NetworkStorage,
  NetworkOverrides,
  NETWORK_OVERRIDES_STORAGE_KEY,
  CustomNetworkPayload,
} from './models';
import {
  AVALANCHE_XP_NETWORK,
  AVALANCHE_XP_TEST_NETWORK,
  BITCOIN_NETWORK,
  BITCOIN_TEST_NETWORK,
  ChainId,
  ChainList,
  getChainsAndTokens,
  Network,
  NetworkVMType,
} from '@avalabs/chains-sdk';
import { ReadableSignal, Signal, ValueCache } from 'micro-signals';
import {
  Avalanche,
  BitcoinProvider,
  JsonRpcBatchInternal,
} from '@avalabs/wallets-sdk';
import { resolve, wait } from '@avalabs/utils-sdk';
import { addGlacierAPIKeyIfNeeded } from '@src/utils/addGlacierAPIKeyIfNeeded';
import { Network as EthersNetwork } from 'ethers';
import { SigningResult } from '../wallet/models';
import { getExponentialBackoffDelay } from '@src/utils/exponentialBackoff';

@singleton()
export class NetworkService implements OnLock, OnStorageReady {
  private _allNetworks = new Signal<ChainList | undefined>();
  private _activeNetwork: Network | undefined = undefined;
  private _customNetworks: Record<number, Network> = {};
  private _favoriteNetworks: number[] = [];
  private _chainListFetched = new Signal<ChainList>();

  private _fetchedChainListSignal = this._chainListFetched
    .cache(new ValueCache())
    .readOnly();

  public activeNetworkChanged = new Signal<Network | undefined>();
  public developerModeChanged = new Signal<boolean | undefined>();
  public favoriteNetworksUpdated = new Signal<number[]>();

  // Provides a way to read the most recently dispatched _allNetworks
  // signal which is supposed to contain the "raw" chainlist (without
  // config overrides applied to it).
  private _rawNetworks = this._allNetworks.cache(new ValueCache<ChainList>());

  public allNetworks: ReadableSignal<Promise<ChainList>>;
  public activeNetworks: ReadableSignal<Promise<ChainList>>;

  constructor(private storageService: StorageService) {
    this._initChainList();

    this.allNetworks = this._allNetworks
      .cache(new ValueCache<ChainList>())
      .map(this.#applyOverrides)
      .readOnly();

    this.activeNetworks = this._allNetworks
      .cache(new ValueCache<ChainList>())
      .filter((value) => !!value)
      .map(this.#filterBasedOnDevMode)
      .map(this.#applyOverrides)
      .readOnly();
  }

  public get activeNetwork() {
    return this._activeNetwork;
  }

  private set activeNetwork(network: Network | undefined) {
    const previousNetwork = this._activeNetwork;

    // Chain ID comparison is not enough here, the active network may
    // need an update even though the chain ID didn't change (for example,
    // a custom URL is configured for the active network).
    const activeNetworkChanged =
      JSON.stringify(previousNetwork) !== JSON.stringify(network);

    if (!activeNetworkChanged) {
      return;
    }

    this._activeNetwork = network;
    this.activeNetworkChanged.dispatch(this._activeNetwork);

    // No need to notify about developer mode being changed when we're only setting
    // the network for the first time (after extension startup or unlocking).
    const developerModeChanged =
      Boolean(previousNetwork) &&
      Boolean(network) &&
      previousNetwork?.isTestnet !== network?.isTestnet;

    if (developerModeChanged) {
      this.developerModeChanged.dispatch(this._activeNetwork?.isTestnet);
    }
  }

  private set favoriteNetworks(networkIds: number[]) {
    this._favoriteNetworks = networkIds;
    this.favoriteNetworksUpdated.dispatch(networkIds);
  }

  async getFavoriteNetworks() {
    const isTestnet = this.activeNetwork?.isTestnet;
    const allNetworks = await this.allNetworks.promisify();
    const filteredFavoriteNetworks = this._favoriteNetworks.filter((id) => {
      if (allNetworks) {
        return isTestnet
          ? allNetworks[id]?.isTestnet
          : !allNetworks[id]?.isTestnet;
      }
      return false;
    });
    return filteredFavoriteNetworks;
  }

  public get customNetworks() {
    return this._customNetworks;
  }

  async addFavoriteNetwork(chainId?: number) {
    const storedFavoriteNetworks = this._favoriteNetworks;
    if (
      !chainId ||
      storedFavoriteNetworks.find(
        (storedNetworkChainId) => storedNetworkChainId === chainId
      )
    ) {
      return storedFavoriteNetworks;
    }
    this.favoriteNetworks = [...storedFavoriteNetworks, chainId];
    this.updateNetworkState();
    return this._favoriteNetworks;
  }

  async removeFavoriteNetwork(chainId: number) {
    const storedFavoriteNetworks = this._favoriteNetworks;
    this.favoriteNetworks = storedFavoriteNetworks.filter(
      (storedFavoriteNetworkChainId) => storedFavoriteNetworkChainId !== chainId
    );
    this.updateNetworkState();
    return this._favoriteNetworks;
  }

  public isMainnet(): boolean {
    return !this.activeNetwork?.isTestnet;
  }

  public isActiveNetwork(chainId: number) {
    return this.activeNetwork?.chainId === chainId;
  }

  async onLock(): Promise<void> {
    const allNetworks = await this.allNetworks.promisify();

    // Set active network so that dApps do not break connection when
    // extension gets locked. This is an issue with RainbowKit as an example.
    this.activeNetwork = allNetworks?.[ChainId.AVALANCHE_MAINNET_ID];

    this._allNetworks.dispatch(undefined);
    this._customNetworks = {};
    this._favoriteNetworks = [];
  }

  onStorageReady(): void {
    this.init();

    // We have access to storage now, so we can start listening for
    // chainlist updates & store them locally.

    // If the list was updated before we started listening here,
    // it doesn't matter - the signal is cached, so we'll get the latest
    // value anyway.
    this._fetchedChainListSignal.addOnce((chainlist) => {
      this.storageService.save(NETWORK_LIST_STORAGE_KEY, chainlist);
    });
  }

  async updateNetworkState() {
    this.storageService.save<NetworkStorage>(NETWORK_STORAGE_KEY, {
      activeNetworkId: this.activeNetwork?.chainId || null,
      customNetworks: this._customNetworks,
      favoriteNetworks: this._favoriteNetworks,
    });
  }

  async init() {
    const network = await this.storageService.load<NetworkStorage>(
      NETWORK_STORAGE_KEY
    );

    // At this point the chainlist from Glacier should already be available,
    // as it is fetched when service worker starts (so before extension is unlocked).
    // If it isn't available yet, we'll use the list cached in the storage.
    const chainlist = await Promise.race([
      this._chainListFetched.promisify(),
      this._getCachedChainList(),
    ]);

    if (!chainlist) {
      throw new Error('chainlist failed to load');
    }

    const allNetworks = {
      ...chainlist,
      ...network?.customNetworks,
    };
    this._customNetworks = network?.customNetworks || {};
    this._allNetworks.dispatch(allNetworks);

    // Fall back to Avalanche network if we don't know what previous network was,
    // or if that network is no longer available in the network list.
    const previouslyActiveNetwork = network?.activeNetworkId
      ? allNetworks[network.activeNetworkId]
      : null;
    const avalancheMainnet = allNetworks[ChainId.AVALANCHE_MAINNET_ID];

    this.activeNetwork = previouslyActiveNetwork ?? avalancheMainnet;

    this.favoriteNetworks = network?.favoriteNetworks || [
      ChainId.AVALANCHE_MAINNET_ID,
    ];
  }

  private async _getCachedChainList(): Promise<ChainList | undefined> {
    return this.storageService.load<ChainList>(NETWORK_LIST_STORAGE_KEY);
  }

  private async _initChainList(): Promise<ChainList> {
    let chainlist: ChainList | null = null;
    let attempt = 1;

    do {
      const [result] = await resolve(
        getChainsAndTokens(
          process.env.RELEASE === 'production',
          process.env.TOKENLIST_OVERRIDE || ''
        )
      );

      if (result) {
        chainlist = {
          ...result,
          [BITCOIN_NETWORK.chainId]: BITCOIN_NETWORK,
          [BITCOIN_TEST_NETWORK.chainId]: BITCOIN_TEST_NETWORK,
        };

        if (!this.activeNetwork) {
          this.activeNetwork = result[ChainId.AVALANCHE_MAINNET_ID];
        }
      } else {
        attempt += 1;
        await wait(getExponentialBackoffDelay({ attempt }));
      }
    } while (!chainlist);

    // Dispatch the freshly fetched chainlist, so it can be cached in storage when it is unlocked.
    this._chainListFetched.dispatch(chainlist);

    // Dispatch the chainlist even if storage is not unlocked yet (for onboarding)
    this._allNetworks.dispatch(chainlist);

    return chainlist;
  }

  async getNetwork(networkId: number): Promise<Network | undefined> {
    const activeNetworks = await this.allNetworks.promisify();
    return activeNetworks?.[networkId];
  }

  /**
   * Returns the network object for Avalanche X/P Chains
   */
  getAvalancheNetworkXP() {
    return this.isMainnet() ? AVALANCHE_XP_NETWORK : AVALANCHE_XP_TEST_NETWORK;
  }

  async setNetwork(networkId: number) {
    const selectedNetwork = await this.getNetwork(networkId);
    if (!selectedNetwork) {
      throw new Error('selected network not supported');
    }

    this.activeNetwork = selectedNetwork;
    this.updateNetworkState();
  }

  /**
   * Returns the network object used for Avalanche EVM chain
   */
  async getAvalancheNetwork(): Promise<Network> {
    const activeNetworks = await this.activeNetworks.promisify();
    const network =
      activeNetworks[ChainId.AVALANCHE_TESTNET_ID] ??
      activeNetworks[ChainId.AVALANCHE_MAINNET_ID];
    if (!network) throw new Error('Avalanche network not found');
    return network;
  }

  /**
   * Returns the Ethers provider used by the Avalanche C Chain
   */
  async getAvalancheProvider(): Promise<JsonRpcBatchInternal> {
    const network = await this.getAvalancheNetwork();
    return this.getProviderForNetwork(network) as JsonRpcBatchInternal;
  }

  /**
   * Returns the provider used by Avalanche X/P/CoreEth chains.
   */
  async getAvalanceProviderXP(): Promise<Avalanche.JsonRpcProvider> {
    const network = this.getAvalancheNetworkXP();
    return this.getProviderForNetwork(network) as Avalanche.JsonRpcProvider;
  }

  async getEthereumNetwork(): Promise<Network> {
    const activeNetworks = await this.activeNetworks.promisify();
    const network =
      activeNetworks[ChainId.ETHEREUM_TEST_SEPOLIA] ??
      activeNetworks[ChainId.ETHEREUM_HOMESTEAD];
    if (!network) throw new Error('Ethereum network not found');
    return network;
  }

  async getEthereumProvider() {
    const network = await this.getEthereumNetwork();
    return this.getProviderForNetwork(network) as JsonRpcBatchInternal;
  }

  async getBitcoinNetwork(): Promise<Network> {
    const activeNetworks = await this.activeNetworks.promisify();
    const network =
      activeNetworks[ChainId.BITCOIN] ??
      activeNetworks[ChainId.BITCOIN_TESTNET];
    if (!network) throw new Error('Bitcoin network not found');
    return network;
  }

  async getBitcoinProvider(): Promise<BitcoinProvider> {
    const network = await this.getBitcoinNetwork();
    return this.getProviderForNetwork(network) as BitcoinProvider;
  }

  getProviderForNetwork(
    network: Network,
    useMulticall = false
  ): BitcoinProvider | JsonRpcBatchInternal | Avalanche.JsonRpcProvider {
    if (network.vmName === NetworkVMType.BITCOIN) {
      return new BitcoinProvider(
        !network.isTestnet,
        undefined,
        `${process.env.PROXY_URL}/proxy/nownodes/${
          network.isTestnet ? 'btcbook-testnet' : 'btcbook'
        }`,
        `${process.env.PROXY_URL}/proxy/nownodes/${
          network.isTestnet ? 'btc-testnet' : 'btc'
        }`,
        process.env.GLACIER_API_KEY
          ? { token: process.env.GLACIER_API_KEY }
          : {}
      );
    } else if (network.vmName === NetworkVMType.EVM) {
      const provider = new JsonRpcBatchInternal(
        useMulticall
          ? {
              maxCalls: 40,
              multiContractAddress: network.utilityAddresses?.multicall,
            }
          : 40,
        addGlacierAPIKeyIfNeeded(network.rpcUrl),
        new EthersNetwork(network.chainName, network.chainId)
      );

      provider.pollingInterval = 2000;

      return provider;
    } else if (
      network.vmName === NetworkVMType.AVM ||
      network.vmName === NetworkVMType.PVM
    ) {
      return network.isTestnet
        ? Avalanche.JsonRpcProvider.getDefaultFujiProvider()
        : Avalanche.JsonRpcProvider.getDefaultMainnetProvider();
    } else {
      throw new Error('unsupported network');
    }
  }

  /**
   * Sends a signed transaction if needed.
   * @returns the transaction hash
   */
  async sendTransaction(
    { txHash, signedTx }: SigningResult,
    network?: Network
  ): Promise<string> {
    // Sometimes we'll receive the TX hash directly from the wallet
    // device that signed the transaction (it's the case for WalletConnect).
    // In that scenario, we can just return early here with the hash we received.
    if (typeof txHash === 'string') {
      return txHash;
    }

    const activeNetwork = network || this.activeNetwork;
    if (!activeNetwork) {
      throw new Error('No active network');
    }
    const provider = this.getProviderForNetwork(activeNetwork);
    if (provider instanceof JsonRpcBatchInternal) {
      return (await provider.broadcastTransaction(signedTx)).hash;
    }

    if (provider instanceof BitcoinProvider) {
      return await provider.issueRawTx(signedTx);
    }

    throw new Error('No provider found');
  }

  async isValidRPCUrl(chainId: number, url: string): Promise<boolean> {
    const provider = new JsonRpcBatchInternal(
      {
        maxCalls: 40,
      },
      url,
      new EthersNetwork('', chainId)
    );

    try {
      const detectedNetwork = await provider.getNetwork();
      return detectedNetwork.chainId === BigInt(chainId);
    } catch (e) {
      return false;
    }
  }

  async saveCustomNetwork(customNetwork: CustomNetworkPayload) {
    const chainId = parseInt(customNetwork.chainId.toString(16), 16);
    const chainlist = await this._rawNetworks.promisify();

    if (!chainlist) {
      throw new Error('chainlist failed to load');
    }

    const isCustomNetworkExist = !!this._customNetworks[chainId];
    const isChainListNetwork = chainlist && !!chainlist[chainId];

    // customNetwork is a default chain -> dont save
    if (isChainListNetwork && !isCustomNetworkExist) {
      throw new Error('chain ID already exists');
    }

    this._customNetworks = {
      ...this._customNetworks,
      [chainId]: customNetwork,
    };

    this._allNetworks.dispatch({
      ...chainlist,
      ...this._customNetworks,
    });
    if (!isCustomNetworkExist) {
      this.setNetwork(chainId);
    }
    if (this._activeNetwork?.chainId === customNetwork.chainId) {
      this._activeNetwork = customNetwork;
      this.activeNetworkChanged.dispatch(customNetwork);
    }
    this.updateNetworkState();
  }

  async updateNetworkOverrides(network: NetworkOverrides) {
    const overridableProperties = ['rpcUrl'];

    const overrides = pick(network, overridableProperties);

    const chainId = parseInt(network?.chainId.toString(16), 16).toString();

    const existingOverrides = await this.storageService.load<
      Record<string, NetworkOverrides>
    >(NETWORK_OVERRIDES_STORAGE_KEY);

    const newOverrides = {
      ...existingOverrides,
      [chainId]: Object.keys(overrides).length > 0 ? overrides : undefined,
    };

    await this.storageService.save(NETWORK_OVERRIDES_STORAGE_KEY, newOverrides);

    // Dispatch _allNetworks signal to trigger an update of overrides.
    const chainlist = await this._rawNetworks.promisify();
    this._allNetworks.dispatch({ ...chainlist });

    // If we're editing the active network, apply the changes to it as well.
    if (chainlist && this.activeNetwork?.chainId === network.chainId) {
      // We're getting the pure network config from _allNetworks signal,
      // as that's where we have the network in it's default state.
      const pureActiveNetwork = chainlist[network.chainId];

      // Only then we apply the new overrides
      if (pureActiveNetwork) {
        this.activeNetwork = {
          ...pureActiveNetwork,
          ...overrides,
        };
      }
    }
  }

  async removeCustomNetwork(chainID: number) {
    const networkToRemove = this._customNetworks[chainID];
    const wasTestnet = networkToRemove?.isTestnet;

    // Remove chain ID from customNetworks list and from allNetworks list.
    delete this._customNetworks[chainID];
    const chainlist = await this._rawNetworks.promisify();
    if (chainlist && chainlist[chainID]) {
      delete chainlist[chainID];
    }

    // Update the lsit of all networks.
    this._allNetworks.dispatch({ ...chainlist, ...this._customNetworks });

    // Switch to Avalanache Mainnet or Fuji if the active network was removed.
    if (this.activeNetwork?.chainId === chainID) {
      this.setNetwork(
        wasTestnet ? ChainId.AVALANCHE_TESTNET_ID : ChainId.AVALANCHE_MAINNET_ID
      );
    }
    this.removeFavoriteNetwork(chainID);

    // Update storage
    this.updateNetworkState();
  }

  /**
   * Basically if in testnet mode we only want to return the testnet
   * networks. Otherwise we want only mainnet networks.
   */
  #filterBasedOnDevMode = (chainList?: ChainList) => {
    return Object.values(chainList ?? {})
      .filter(
        (network) =>
          Boolean(this.activeNetwork?.isTestnet) === Boolean(network.isTestnet)
      )
      .reduce(
        (acc, network) => ({
          ...acc,
          [network.chainId]: network,
        }),
        {}
      );
  };

  #applyOverrides = async (chainList?: ChainList) => {
    let overrides: Record<string, NetworkOverrides> | undefined;

    if (!chainList) {
      return {};
    }

    try {
      overrides = await this.storageService.load(NETWORK_OVERRIDES_STORAGE_KEY);
    } catch {
      // This can be called before storage is decrypted, in that case
      // no overrides will be applied.
      return merge({}, chainList);
    }

    if (!overrides) {
      return merge({}, chainList);
    }

    const applicableOverrides = Object.fromEntries(
      Object.entries(overrides)
        // Filter out empty overrides
        .filter(
          ([, networkOverrides]) => Object.keys(networkOverrides).length > 0
        )
        // Filter out overrides that do not apply in the current context,
        // for example if the chain list does not contain the network in question.
        .filter(([chainId]) => chainId in chainList)
    );

    return merge({}, chainList, applicableOverrides) as ChainList;
  };
}
