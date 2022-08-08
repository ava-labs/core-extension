import { singleton } from 'tsyringe';
import {
  OnLock,
  OnStorageReady,
} from '@src/background/runtime/lifecycleCallbacks';
import { StorageService } from '../storage/StorageService';
import {
  NETWORK_STORAGE_KEY,
  NetworkStorage,
  NETWORK_LIST_STORAGE_KEY,
} from './models';
import {
  getChainsAndTokens,
  Network,
  ChainList,
  ChainId,
  NetworkVMType,
  BITCOIN_TEST_NETWORK,
  BITCOIN_NETWORK,
} from '@avalabs/chains-sdk';
import { Signal, ValueCache } from 'micro-signals';
import {
  BlockCypherProvider,
  JsonRpcBatchInternal,
} from '@avalabs/wallets-sdk';
import { resolve } from '@avalabs/utils-sdk';
import { addGlacierAPIKeyIfNeeded } from '@src/utils/addGlacierAPIKeyIfNeeded';

@singleton()
export class NetworkService implements OnLock, OnStorageReady {
  private _chainActiveNetworks = new ValueCache<ChainList>();
  private _activeNetworkCache = new ValueCache<Network>();
  private _activeNetworks = new Signal<ChainList | undefined>();
  private _activeNetwork = new Signal<Network | undefined>();
  private _developerModeChanges = new Signal<boolean>();
  private _isDeveloperMode = false;
  private _customNetworks: Record<number, Network> = {};
  private _favoriteNetworks: number[] = [];
  public developerModeChanges = this._developerModeChanges.readOnly();

  public activeNetworks = this._activeNetworks
    .cache(this._chainActiveNetworks)
    .filter((value) => !!value)
    .map<ChainList>((chainList) =>
      /**
       * Basically if in developer mode we only want to return the testnet
       * networks. Otherwise we want only mainnet networks
       *
       * The logic here allows the consumer to listen for developer mode changed events
       * promisify this data and get the latest expected network set
       */
      Object.values(chainList || {})
        .filter((network) =>
          this._isDeveloperMode ? network.isTestnet : !network.isTestnet
        )
        .reduce((acc: ChainList, network) => {
          return { ...acc, [network.chainId]: network };
        }, {})
    )
    .readOnly();
  public activeNetwork = this._activeNetwork
    .cache(this._activeNetworkCache)
    .readOnly();

  public get isDeveloperMode() {
    return this._isDeveloperMode;
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
    // dispatching a default value so that the
    // `await networkService.activeNetwork.promisfy()` can resolve immediately
    this._activeNetwork.dispatch(undefined);
  }

  public async isMainnet() {
    return await this.activeNetwork
      .promisify()
      .then((network) => !network?.isTestnet);
  }

  onLock(): void {
    this._activeNetwork.dispatch(undefined);
    this._activeNetworks.dispatch(undefined);
    this._customNetworks = {};
    this._favoriteNetworks = [];
  }

  onStorageReady(): void {
    this.init();
  }

  async updateNetworkState() {
    const currentActiveNetwork = await this.activeNetwork
      .promisify()
      .then((network) => network);
    this.storageService.save<NetworkStorage>(NETWORK_STORAGE_KEY, {
      isDeveloperMode: this.isDeveloperMode,
      activeNetworkId: currentActiveNetwork?.chainId || null,
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
    this._activeNetworks.dispatch(allNetworks);
    this._isDeveloperMode = network?.isDeveloperMode || false;
    this._activeNetwork.dispatch(
      allNetworks[network?.activeNetworkId || ChainId.AVALANCHE_MAINNET_ID]
    );
    this._developerModeChanges.dispatch(this._isDeveloperMode);

    this._favoriteNetworks = network?.favoriteNetworks || [
      ChainId.AVALANCHE_MAINNET_ID,
    ];
  }

  async setChainListOrFallback() {
    // getChainsAndTokens has default URL (It changes based on the environment being used) to fetch the chains and tokens.
    // If the URL needs to be overridden, please use TOKENLIST_OVERRIDE to do so.
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
      this.storageService.save(NETWORK_LIST_STORAGE_KEY, withBitcoin);
      return withBitcoin;
    } else {
      const chainlist = await this.storageService.load<ChainList>(
        NETWORK_LIST_STORAGE_KEY
      );
      return chainlist;
    }
  }

  async getNetwork(networkId: number): Promise<Network | undefined> {
    const activeNetworks = await this.activeNetworks.promisify();
    return activeNetworks[networkId];
  }

  async setNetwork(networkId: number) {
    const selectedNetwork = await this.getNetwork(networkId);
    if (!selectedNetwork) {
      throw new Error('selected network not supported');
    }

    this._activeNetwork.dispatch(selectedNetwork);
    this.updateNetworkState();
  }

  async setDeveloperMode(status: boolean) {
    this._isDeveloperMode = status;

    const activeNetworks = await this.activeNetworks.promisify();

    const selectedNetwork =
      activeNetworks[
        this.isDeveloperMode
          ? ChainId.AVALANCHE_TESTNET_ID
          : ChainId.AVALANCHE_MAINNET_ID
      ];
    this._activeNetwork.dispatch(selectedNetwork);
    this._developerModeChanges.dispatch(this._isDeveloperMode);
    this.updateNetworkState();
  }

  async getAvalancheNetwork(): Promise<Network> {
    const activeNetworks = await this.activeNetworks.promisify();
    const network = this._isDeveloperMode
      ? activeNetworks[ChainId.AVALANCHE_TESTNET_ID]
      : activeNetworks[ChainId.AVALANCHE_MAINNET_ID];
    if (!network) throw new Error('Avalanche network not found');
    return network;
  }

  async getAvalancheProvider(): Promise<JsonRpcBatchInternal> {
    const network = await this.getAvalancheNetwork();
    return this.getProviderForNetwork(network) as JsonRpcBatchInternal;
  }

  async getEthereumNetwork(): Promise<Network> {
    const activeNetworks = await this.activeNetworks.promisify();
    const network = this._isDeveloperMode
      ? activeNetworks[ChainId.ETHEREUM_TEST_RINKEBY]
      : activeNetworks[ChainId.ETHEREUM_HOMESTEAD];
    if (!network) throw new Error('Ethereum network not found');
    return network;
  }

  async getEthereumProvider() {
    const network = await this.getEthereumNetwork();
    return this.getProviderForNetwork(network) as JsonRpcBatchInternal;
  }

  async getBitcoinNetwork(): Promise<Network> {
    return this._isDeveloperMode ? BITCOIN_TEST_NETWORK : BITCOIN_NETWORK;
  }

  async getBitcoinProvider(): Promise<BlockCypherProvider> {
    const network = await this.getBitcoinNetwork();
    return this.getProviderForNetwork(network) as BlockCypherProvider;
  }

  getProviderForNetwork(
    network: Network
  ): BlockCypherProvider | JsonRpcBatchInternal {
    if (network.vmName === NetworkVMType.BITCOIN) {
      return new BlockCypherProvider(
        !network.isTestnet,
        process.env.GLACIER_API_KEY,
        `${process.env.GLACIER_URL}/proxy/blockcypher`
      );
    } else if (network.vmName === NetworkVMType.EVM) {
      const provider = new JsonRpcBatchInternal(
        {
          maxCalls: 40,
          multiContractAddress: network.utilityAddresses?.multicall,
        },
        addGlacierAPIKeyIfNeeded(network.rpcUrl),
        network.chainId
      );

      provider.pollingInterval = 2000;

      return provider;
    } else {
      throw new Error('unsupported network');
    }
  }

  /**
   * Sends a signed transaction.
   * @returns the transaction hash
   */
  async sendTransaction(signedTx: string, network?: Network): Promise<string> {
    const activeNetwork = network || (await this.activeNetwork.promisify());
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
    if (isChainListNetwork) {
      return;
    }
    this._customNetworks = {
      ...this._customNetworks,
      [convertedChainId]: customNetwork,
    };
    if (!chainlist) throw new Error('chainlist failed to load');
    this._activeNetworks.dispatch({
      ...chainlist,
      ...this._customNetworks,
    });
    if (!isCustomNetworkExist) {
      this.setDeveloperMode(false);
      this.setNetwork(convertedChainId);
    }
  }

  async removeCustomNetwork(chainID: number) {
    delete this._customNetworks[chainID];
    const chainlist = await this.setChainListOrFallback();
    this._activeNetworks.dispatch({ ...chainlist, ...this._customNetworks });
    const activeNetwork = await this.activeNetwork.promisify();
    if (activeNetwork?.chainId === chainID) {
      this.setNetwork(ChainId.AVALANCHE_MAINNET_ID);
    }
    this.removeFavoriteNetwork(chainID);
    this.updateNetworkState();
  }
}
