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
  ETHEREUM_TEST_NETWORK_RINKEBY,
  ETHEREUM_NETWORK,
  BITCOIN_TEST_NETWORK,
  BITCOIN_NETWORK,
} from '@avalabs/chains-sdk';
import { Signal, ValueCache } from 'micro-signals';
import {
  BlockCypherProvider,
  JsonRpcBatchInternal,
} from '@avalabs/wallets-sdk';
import { resolve } from '@avalabs/utils-sdk';
import { InfuraProvider } from '@ethersproject/providers';

@singleton()
export class NetworkService implements OnLock, OnStorageReady {
  private _chainActiveNetworks = new ValueCache<ChainList>();
  private _activeNetworkCache = new ValueCache<Network>();
  private _activeNetworks = new Signal<ChainList | undefined>();
  private _activeNetwork = new Signal<Network | undefined>();
  private _developerModeChanges = new Signal<boolean>();
  private _isDeveloperMode = false;
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
    .filter((value?: Network) => !!value)
    .readOnly();

  public get isDeveloperMode() {
    return this._isDeveloperMode;
  }

  constructor(private storageService: StorageService) {}

  public async isMainnet() {
    return await this.activeNetwork
      .promisify()
      .then((network) => !network?.isTestnet);
  }

  onLock(): void {
    this._activeNetwork.dispatch(undefined);
    this._activeNetworks.dispatch(undefined);
  }

  onStorageReady(): void {
    this.init();
  }

  async init() {
    const chainlist = await this.setChainListOrFallback();
    if (!chainlist) throw new Error('chainlist failed to load');
    const network = await this.storageService.load<NetworkStorage>(
      NETWORK_STORAGE_KEY
    );

    this._isDeveloperMode = network?.isDeveloperMode || false;
    this._activeNetwork.dispatch(
      chainlist[network?.activeNetworkId || ChainId.AVALANCHE_MAINNET_ID]
    );
    this._developerModeChanges.dispatch(this._isDeveloperMode);
  }

  async setChainListOrFallback() {
    const [result] = await resolve(getChainsAndTokens());

    if (result) {
      const withBitcoin = {
        ...result,
        [BITCOIN_NETWORK.chainId]: BITCOIN_NETWORK,
        [BITCOIN_TEST_NETWORK.chainId]: BITCOIN_TEST_NETWORK,
      };
      this.storageService.save(NETWORK_LIST_STORAGE_KEY, withBitcoin);
      this._activeNetworks.dispatch(withBitcoin);
      return withBitcoin;
    } else {
      const chainlist = await this.storageService.load<ChainList>(
        NETWORK_LIST_STORAGE_KEY
      );
      this._activeNetworks.dispatch(chainlist);
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
    this.storageService.save<NetworkStorage>(NETWORK_STORAGE_KEY, {
      isDeveloperMode: this.isDeveloperMode,
      activeNetworkId: selectedNetwork.chainId,
    });
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

    this.storageService.save<NetworkStorage>(NETWORK_STORAGE_KEY, {
      activeNetworkId: selectedNetwork.chainId || null,
      isDeveloperMode: this.isDeveloperMode,
    });
  }

  async getAvalancheNetwork(): Promise<Network> {
    const activeNetworks = await this.activeNetworks.promisify();
    return this._isDeveloperMode
      ? activeNetworks[ChainId.AVALANCHE_TESTNET_ID]
      : activeNetworks[ChainId.AVALANCHE_MAINNET_ID];
  }

  async getAvalancheProvider(): Promise<JsonRpcBatchInternal> {
    const network = await this.getAvalancheNetwork();
    return this.getProviderForNetwork(network) as JsonRpcBatchInternal;
  }

  async getEthereumNetwork(): Promise<Network> {
    return this._isDeveloperMode
      ? ETHEREUM_TEST_NETWORK_RINKEBY
      : ETHEREUM_NETWORK;
  }

  async getEthereumProvider() {
    const network = await this.getEthereumNetwork();
    return new InfuraProvider(
      network.isTestnet ? 'rinkeby' : 'homestead',
      process.env.INFURA_API_KEY
    );
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
        undefined,
        `${process.env.GLACIER_URL}/proxy/blockcypher`
      );
    } else if (network.vmName === NetworkVMType.EVM) {
      const provider = new JsonRpcBatchInternal(
        {
          maxCalls: 40,
          multiContractAddress: network.utilityAddresses?.multicall,
        },
        network.rpcUrl,
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
}
