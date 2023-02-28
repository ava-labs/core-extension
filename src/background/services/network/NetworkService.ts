import { singleton } from 'tsyringe';
import {
  OnLock,
  OnStorageReady,
} from '@src/background/runtime/lifecycleCallbacks';
import { StorageService } from '../storage/StorageService';
import {
  NETWORK_LIST_STORAGE_KEY,
  NETWORK_STORAGE_KEY,
  NetworkStorage,
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
import { Signal, ValueCache } from 'micro-signals';
import {
  Avalanche,
  BlockCypherProvider,
  JsonRpcBatchInternal,
} from '@avalabs/wallets-sdk';
import { resolve } from '@avalabs/utils-sdk';
import { addGlacierAPIKeyIfNeeded } from '@src/utils/addGlacierAPIKeyIfNeeded';

@singleton()
export class NetworkService implements OnLock, OnStorageReady {
  private _allNetworksCache = new ValueCache<ChainList>();
  private _activeNetworksCache = new ValueCache<ChainList>();
  private _allNetworks = new Signal<ChainList | undefined>();
  private _activeNetwork: Network | undefined = undefined;
  public activeNetworkChanged = new Signal<Network | undefined>();
  public developerModeChanged = new Signal<boolean | undefined>();
  private _customNetworks: Record<number, Network> = {};
  private _favoriteNetworks: number[] = [];
  private _initChainListResolved = new Signal<boolean>();
  private _initChainListResolvedCache = new ValueCache<boolean>();
  public initChainListResolved = this._initChainListResolved
    .cache(this._initChainListResolvedCache)
    .readOnly();
  public allNetworks = this._allNetworks
    .cache(this._allNetworksCache)
    .readOnly();
  public activeNetworks = this._allNetworks
    .cache(this._activeNetworksCache)
    .filter((value) => !!value)
    .map<ChainList>((chainList) => {
      /**
       * Basically if in testnet mode we only want to return the testnet
       * networks. Otherwise we want only mainnet networks
       */
      return Object.values(chainList || {})
        .filter((network) =>
          this.activeNetwork?.isTestnet ? network.isTestnet : !network.isTestnet
        )
        .reduce((acc: ChainList, network) => {
          return { ...acc, [network.chainId]: network };
        }, {});
    })
    .readOnly();

  public get activeNetwork() {
    return this._activeNetwork;
  }

  private set activeNetwork(network: Network | undefined) {
    const previousNetwork = this._activeNetwork;
    const activeNetworkChanged = previousNetwork?.chainId !== network?.chainId;

    if (!activeNetworkChanged) {
      return;
    }

    this._activeNetwork = network;
    this.activeNetworkChanged.dispatch(this._activeNetwork);

    // No need to notify about developer mode being changed when we're only setting
    // the network for the first time (after extension startup or unlocking).
    const developerModeChanged =
      Boolean(previousNetwork) &&
      previousNetwork?.isTestnet !== network?.isTestnet;

    if (developerModeChanged) {
      this.developerModeChanged.dispatch(this._activeNetwork?.isTestnet);
    }
  }

  public get favoriteNetworks() {
    return this._favoriteNetworks;
  }

  public get customNetworks() {
    return this._customNetworks;
  }

  async addFavoriteNetwork(chainId?: number) {
    const storedFavoriteNetworks = this.favoriteNetworks;
    if (
      !chainId ||
      storedFavoriteNetworks.find(
        (storedNetworkChainId) => storedNetworkChainId === chainId
      )
    ) {
      return storedFavoriteNetworks;
    }
    this._favoriteNetworks = [...storedFavoriteNetworks, chainId];
    this.updateNetworkState();
    return this._favoriteNetworks;
  }

  async removeFavoriteNetwork(chainId: number) {
    const storedFavoriteNetworks = this.favoriteNetworks;
    this._favoriteNetworks = storedFavoriteNetworks.filter(
      (storedFavoriteNetworkChainId) => storedFavoriteNetworkChainId !== chainId
    );
    this.updateNetworkState();
    return this._favoriteNetworks;
  }

  constructor(private storageService: StorageService) {
    this._initChainList();
  }

  public isMainnet(): boolean {
    return !this.activeNetwork?.isTestnet;
  }

  public isActiveNetwork(chainId: number) {
    return this.activeNetwork?.chainId === chainId;
  }

  onLock(): void {
    this._allNetworks.dispatch(undefined);
    this.activeNetwork = undefined;
    this._customNetworks = {};
    this._favoriteNetworks = [];
    this._initChainListResolved.dispatch(false);
  }

  onStorageReady(): void {
    this.init();
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

    const chainlist = await this.setChainListOrFallback();
    if (!chainlist) throw new Error('chainlist failed to load');

    const allNetworks = { ...chainlist, ...network?.customNetworks };
    this._customNetworks = network?.customNetworks || {};
    this._allNetworks.dispatch(allNetworks);

    // make sure we load a testnet network when in devmode
    const activeNetwork =
      allNetworks[network?.activeNetworkId || ChainId.AVALANCHE_MAINNET_ID];

    this.activeNetwork = activeNetwork;

    this._favoriteNetworks = network?.favoriteNetworks || [
      ChainId.AVALANCHE_MAINNET_ID,
    ];
  }

  private async _initChainList() {
    const [result] = await resolve(
      getChainsAndTokens(
        process.env.RELEASE === 'production',
        process.env.TOKENLIST_OVERRIDE || ''
      )
    );
    if (result) {
      const withBitcoin = {
        ...result,
        [BITCOIN_NETWORK.chainId]: BITCOIN_NETWORK,
        [BITCOIN_TEST_NETWORK.chainId]: BITCOIN_TEST_NETWORK,
      };
      this._allNetworks.dispatch(withBitcoin);
    }

    this._initChainListResolved.dispatch(true);
  }

  async setChainListOrFallback() {
    // getChainsAndTokens has default URL (It changes based on the environment being used) to fetch the chains and tokens.
    // If the URL needs to be overridden, please use TOKENLIST_OVERRIDE to do so.
    await this.initChainListResolved.promisify();

    const allNetworks = await this.allNetworks.promisify();
    if (!allNetworks) {
      const chainlist = await this.storageService.load<ChainList>(
        NETWORK_LIST_STORAGE_KEY
      );
      return chainlist;
    }
    this.storageService.save(NETWORK_LIST_STORAGE_KEY, allNetworks);
    return allNetworks;
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
      activeNetworks[ChainId.ETHEREUM_TEST_GOERLY] ??
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

  async getBitcoinProvider(): Promise<BlockCypherProvider> {
    const network = await this.getBitcoinNetwork();
    return this.getProviderForNetwork(network) as BlockCypherProvider;
  }

  getProviderForNetwork(
    network: Network,
    useMulticall = false
  ): BlockCypherProvider | JsonRpcBatchInternal | Avalanche.JsonRpcProvider {
    if (network.vmName === NetworkVMType.BITCOIN) {
      return new BlockCypherProvider(
        !network.isTestnet,
        process.env.GLACIER_API_KEY,
        `${process.env.PROXY_URL}/proxy/blockcypher`
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
        network.chainId
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
   * Sends a signed transaction.
   * @returns the transaction hash
   */
  async sendTransaction(signedTx: string, network?: Network): Promise<string> {
    const activeNetwork = network || this.activeNetwork;
    if (!activeNetwork) {
      throw new Error('No active network');
    }
    const provider = this.getProviderForNetwork(activeNetwork);
    if (provider instanceof JsonRpcBatchInternal) {
      return (await provider.sendTransaction(signedTx)).hash;
    }

    if (provider instanceof BlockCypherProvider) {
      return (await provider.issueRawTx(signedTx)).hash;
    }

    throw new Error('No provider found');
  }

  async isValidRPCUrl(chainId: number, url: string): Promise<boolean> {
    const provider = new JsonRpcBatchInternal(
      {
        maxCalls: 40,
      },
      url,
      chainId
    );

    try {
      const detectedNetwork = await provider.getNetwork();
      return detectedNetwork.chainId === chainId;
    } catch (e) {
      return false;
    }
  }

  async saveCustomNetwork(customNetwork: Network) {
    // some cases the chainId comes in a hex value, and there will be a duplicated broken entry in the list
    const convertedChainId = parseInt(customNetwork?.chainId.toString(16), 16);
    const chainlist = await this.setChainListOrFallback();
    const isCustomNetworkExist = !!this._customNetworks[convertedChainId];
    const isChainListNetwork = chainlist && !!chainlist[convertedChainId];

    // customNetwork is a default chain -> dont save
    if (isChainListNetwork && !isCustomNetworkExist) {
      throw new Error('chain ID already exists');
    }
    this._customNetworks = {
      ...this._customNetworks,
      [convertedChainId]: customNetwork,
    };
    if (!chainlist) throw new Error('chainlist failed to load');
    this._allNetworks.dispatch({
      ...chainlist,
      ...this._customNetworks,
    });
    if (!isCustomNetworkExist) {
      this.setNetwork(convertedChainId);
    }
  }

  async removeCustomNetwork(chainID: number) {
    delete this._customNetworks[chainID];
    const chainlist = await this.setChainListOrFallback();
    if (chainlist && chainlist[chainID]) {
      delete chainlist[chainID];
    }
    this._allNetworks.dispatch({ ...chainlist, ...this._customNetworks });

    if (this.activeNetwork?.chainId === chainID) {
      this.setNetwork(ChainId.AVALANCHE_MAINNET_ID);
    }
    this.removeFavoriteNetwork(chainID);
    this.updateNetworkState();
  }
}
