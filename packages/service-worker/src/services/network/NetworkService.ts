import { singleton } from 'tsyringe';
import { merge, omit, pick } from 'lodash';
import { OnLock, OnStorageReady } from '../../runtime/lifecycleCallbacks';
import { StorageService } from '../storage/StorageService';
import {
  NETWORK_LIST_STORAGE_KEY,
  NETWORK_STORAGE_KEY,
  NetworkStorage,
  NetworkOverrides,
  NETWORK_OVERRIDES_STORAGE_KEY,
  CustomNetworkPayload,
  ChainList,
  ChainListWithCaipIds,
  NetworkWithCaipId,
  SigningResult,
  FeatureFlagEvents,
  FeatureFlags,
  FeatureGates,
  NETWORKS_ENABLED_FOREVER,
} from '@core/types';
import {
  AVALANCHE_XP_NETWORK,
  AVALANCHE_XP_TEST_NETWORK,
  AvalancheCaip2ChainId,
  BITCOIN_NETWORK,
  BITCOIN_TEST_NETWORK,
  ChainId,
  Network,
  NetworkVMType,
  getChainsAndTokens,
} from '@avalabs/core-chains-sdk';
import { ReadableSignal, Signal, ValueCache } from 'micro-signals';
import {
  Avalanche,
  BitcoinProvider,
  JsonRpcBatchInternal,
} from '@avalabs/core-wallets-sdk';
import { resolve, wait } from '@avalabs/core-utils-sdk';
import { Network as EthersNetwork } from 'ethers';
import { buildCoreEth, isPchainNetwork } from '@core/common';
import { FeatureFlagService } from '../featureFlags/FeatureFlagService';
import { isXchainNetwork } from '@core/common';
import { runtime } from 'webextension-polyfill';
import {
  caipToChainId,
  chainIdToCaip,
  decorateWithCaipId,
  getSyncDomain,
  getExponentialBackoffDelay,
  getProviderForNetwork,
  isSyncDomain,
} from '@core/common';
import { isSolanaNetwork } from '@core/common';
import { GlacierService } from '../glacier/GlacierService';

@singleton()
export class NetworkService implements OnLock, OnStorageReady {
  private _allNetworks = new Signal<ChainList | undefined>();
  private _customNetworks: Record<number, Network> = {};
  private _chainListFetched = new Signal<ChainList>();

  // Complete list of enabled networks ID
  private _enabledNetworks: number[] = [...NETWORKS_ENABLED_FOREVER];
  // Network data that is stored in storage
  private _networkAvailability: Record<number, { isEnabled: boolean }> = {};

  private _fetchedChainListSignal = this._chainListFetched
    .cache(new ValueCache())
    .readOnly();

  public uiActiveNetworkChanged = new Signal<Network | undefined>();
  public developerModeChanged = new Signal<boolean | undefined>();
  public enabledNetworksUpdated = new Signal<number[]>();
  public dappScopeChanged = new Signal<{ domain: string; scope: string }>();

  // Provides a way to read the most recently dispatched _allNetworks
  // signal which is supposed to contain the "raw" chainlist (without
  // config overrides applied to it).
  private _rawNetworks = this._allNetworks.cache(new ValueCache<ChainList>());
  private _uiActiveNetwork: NetworkWithCaipId | undefined;

  #dappScopes: Record<string, string> = {};

  public allNetworks: ReadableSignal<Promise<ChainListWithCaipIds>>;
  public activeNetworks: ReadableSignal<Promise<ChainListWithCaipIds>>;

  get uiActiveNetwork(): NetworkWithCaipId | undefined {
    return this._uiActiveNetwork;
  }

  private set uiActiveNetwork(network: NetworkWithCaipId | undefined) {
    const previousNetwork = this._uiActiveNetwork;

    // Chain ID comparison is not enough here, the active network may
    // need an update even though the chain ID didn't change (for example,
    // a custom URL is configured for the active network).
    const activeNetworkChanged =
      JSON.stringify(previousNetwork) !== JSON.stringify(network);

    if (!activeNetworkChanged) {
      return;
    }

    this._uiActiveNetwork = network;
    this.uiActiveNetworkChanged.dispatch(this._uiActiveNetwork);

    // No need to notify about developer mode being changed when we're only setting
    // the network for the first time (after extension startup or unlocking).
    const developerModeChanged =
      Boolean(previousNetwork?.isTestnet) !== Boolean(network?.isTestnet);

    if (developerModeChanged) {
      this.developerModeChanged.dispatch(this._uiActiveNetwork?.isTestnet);
    }
  }

  // We'll re-initialize the network list when one of these flags is toggled.
  #flagStates: Partial<FeatureFlags> = {};

  constructor(
    private storageService: StorageService,
    private featureFlagService: FeatureFlagService,
    private glacierService: GlacierService,
  ) {
    this._initChainList();

    this.allNetworks = this._allNetworks
      .cache(new ValueCache<ChainList>())
      .map(this.#applyOverrides)
      .map(this.#applyChainAgnosticIds)
      .readOnly();

    this.activeNetworks = this._allNetworks
      .cache(new ValueCache<ChainList>())
      .filter((value) => !!value)
      .map(this.#filterBasedOnDevMode)
      .map(this.#filterBasedOnFeatureFlags)
      .map(this.#applyOverrides)
      .map(this.#applyChainAgnosticIds)
      .readOnly();
  }

  #getTrackedFeatureFlags(flags: FeatureFlags): Partial<FeatureFlags> {
    const trackedFlags = [
      FeatureGates.IN_APP_SUPPORT_P_CHAIN,
      FeatureGates.IN_APP_SUPPORT_X_CHAIN,
      FeatureGates.SOLANA_SUPPORT,
    ];

    return Object.fromEntries(
      Object.entries(flags).filter(([flag]) =>
        trackedFlags.includes(flag as FeatureGates),
      ),
    );
  }

  async setNetwork(domain: string, caipId: string) {
    const isSynced = isSyncDomain(domain);
    // For supported networks, use config from saved chainlist
    // instead of relying on payload that may come from a 3rd party:
    const targetNetwork = await this.getNetwork(caipId);
    if (!targetNetwork) {
      throw new Error(`Network not found: ${caipId}`);
    }

    const changesEnvironment =
      Boolean(this._uiActiveNetwork?.isTestnet) !==
      Boolean(targetNetwork.isTestnet);

    if (isSynced || changesEnvironment) {
      this.uiActiveNetwork = targetNetwork;
    }

    // Save scope for requesting dApp
    await this.#updateDappScopes({ [domain]: targetNetwork.caipId });

    // If change resulted in an environment switch, also notify other dApps
    if (changesEnvironment) {
      const newScopes = Object.fromEntries(
        Object.entries(this.#dappScopes)
          .filter(
            ([savedDomain]) =>
              getSyncDomain(savedDomain) !== getSyncDomain(domain),
          )
          .map(([savedDomain]) => [
            savedDomain,
            chainIdToCaip(
              targetNetwork.isTestnet
                ? ChainId.AVALANCHE_TESTNET_ID
                : ChainId.AVALANCHE_MAINNET_ID,
            ),
          ]),
      );

      await this.#updateDappScopes(newScopes);
    }
  }

  async #updateDappScopes(scopes: Record<string, string>) {
    Object.entries(scopes).forEach(([domain, scope]) => {
      const syncDomain = getSyncDomain(domain);

      this.#dappScopes[syncDomain] = scope;
      this.dappScopeChanged.dispatch({ domain: syncDomain, scope });
    });

    await this.updateNetworkState();
  }

  isMainnet() {
    return !this._uiActiveNetwork?.isTestnet;
  }

  async getInitialNetworkForDapp(domain: string): Promise<Network> {
    const scope = this.#dappScopes[getSyncDomain(domain)];
    const storedNetwork = scope ? await this.getNetwork(scope) : null;

    const isSynced = isSyncDomain(domain);
    // Synchronized dApps can handle our fake chain IDs
    const isActiveEvmBased = this.uiActiveNetwork?.vmName === NetworkVMType.EVM;
    const canFallbackToActive = isActiveEvmBased || isSynced;

    // If it's the first time this dApp connects, default to extension's active network
    // or C-Chain if there is no active network (i.e. extension is locked).
    return (
      storedNetwork ??
      (canFallbackToActive ? this.uiActiveNetwork : null) ??
      (await this.getAvalancheNetwork())
    );
  }

  private set enabledNetworks(networkIds: number[]) {
    const uniqueNetworkIds = [
      ...new Set([...NETWORKS_ENABLED_FOREVER, ...networkIds]),
    ];

    this._enabledNetworks = uniqueNetworkIds;
    this.enabledNetworksUpdated.dispatch(networkIds);
  }

  private set networkAvailability(
    networkAvailability: Record<number, { isEnabled: boolean }>,
  ) {
    this._networkAvailability = networkAvailability;
    this.enabledNetworks =
      this.#convertNetworkAvailabilityToEnabledNetworks(networkAvailability);
  }

  async getEnabledNetworks() {
    return this.#filterByEnvironment(this._enabledNetworks);
  }

  public get customNetworks() {
    return this._customNetworks;
  }

  async enableNetwork(chainId: number) {
    if (
      this._enabledNetworks.includes(chainId) ||
      NETWORKS_ENABLED_FOREVER.includes(chainId)
    ) {
      return this._enabledNetworks;
    }

    this.networkAvailability = {
      ...this._networkAvailability,
      [chainId]: {
        isEnabled: true,
      },
    };
    await this.updateNetworkState();
    return this._enabledNetworks;
  }

  async disableNetwork(chainId: number) {
    this.networkAvailability = {
      ...this._networkAvailability,
      [chainId]: {
        isEnabled: false,
      },
    };
    await this.updateNetworkState();
    return this._enabledNetworks;
  }

  async onLock(): Promise<void> {
    this.uiActiveNetwork = undefined;
    this._customNetworks = {};
    this._enabledNetworks = [];
    this._networkAvailability = {};
    this.#dappScopes = {};
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

    this.featureFlagService.addListener(
      FeatureFlagEvents.FEATURE_FLAG_UPDATED,
      async (flags) => {
        const newFlags = this.#getTrackedFeatureFlags(flags);

        if (JSON.stringify(newFlags) !== JSON.stringify(this.#flagStates)) {
          this.#flagStates = newFlags;
          const chainlist = await this._rawNetworks.promisify();
          this._allNetworks.dispatch({ ...chainlist });
        }
      },
    );

    this.activeNetworks.add(async (chainListPromise) => {
      const chainList = await chainListPromise;

      if (this.uiActiveNetwork && !chainList[this.uiActiveNetwork.chainId]) {
        this.uiActiveNetwork =
          chainList[ChainId.AVALANCHE_TESTNET_ID] ??
          chainList[ChainId.AVALANCHE_MAINNET_ID];
      }
    });
  }

  async updateNetworkState() {
    this.storageService.save<NetworkStorage>(NETWORK_STORAGE_KEY, {
      dappScopes: this.#dappScopes,
      customNetworks: this._customNetworks,
      networkAvailability: this._networkAvailability,
    });
  }

  async init() {
    const storedState =
      await this.storageService.load<NetworkStorage>(NETWORK_STORAGE_KEY);

    this.#dappScopes = storedState?.dappScopes ?? {};

    // At this point the chainlist from Glacier should already be available,
    // as it is fetched when service worker starts (so before extension is unlocked).
    // If it isn't available yet, we'll use the list cached in the storage.

    const chainlist = await Promise.any([
      this._chainListFetched.promisify(),
      this._getCachedChainList(),
    ]);

    if (!chainlist) {
      throw new Error('chainlist failed to load');
    }

    this._customNetworks = storedState?.customNetworks || {};
    const fullChainlist = {
      ...chainlist,
      ...this._customNetworks,
    };

    const previousUiScope = this.#dappScopes[runtime.id];
    const previouslyActiveNetwork = previousUiScope
      ? fullChainlist[caipToChainId(previousUiScope)]
      : null;

    this.uiActiveNetwork = decorateWithCaipId(
      previouslyActiveNetwork ?? fullChainlist[ChainId.AVALANCHE_MAINNET_ID],
    );

    this._allNetworks.dispatch(fullChainlist);

    this.networkAvailability = storedState?.networkAvailability ?? {};
  }

  private async _getCachedChainList(): Promise<ChainList | undefined> {
    const networkList = await this.storageService.load<ChainList>(
      NETWORK_LIST_STORAGE_KEY,
    );

    if (!networkList) {
      throw new Error('No networks cached');
    }

    return networkList;
  }

  private _getPchainNetwork(isTestnet: boolean): Network {
    const network = isTestnet
      ? AVALANCHE_XP_TEST_NETWORK
      : AVALANCHE_XP_NETWORK;
    return decorateWithCaipId({
      ...network,
      isTestnet,
      vmName: NetworkVMType.PVM,
      chainId: isTestnet ? ChainId.AVALANCHE_TEST_P : ChainId.AVALANCHE_P,
      chainName: 'Avalanche (P-Chain)',
      logoUri:
        'https://images.ctfassets.net/gcj8jwzm6086/42aMwoCLblHOklt6Msi6tm/1e64aa637a8cead39b2db96fe3225c18/pchain-square.svg', // from contentful
      networkToken: {
        ...network.networkToken,
        logoUri:
          'https://images.ctfassets.net/gcj8jwzm6086/5VHupNKwnDYJvqMENeV7iJ/3e4b8ff10b69bfa31e70080a4b142cd0/avalanche-avax-logo.svg', // from contentful
      },
      explorerUrl: isTestnet
        ? 'https://subnets-test.avax.network/p-chain'
        : 'https://subnets.avax.network/p-chain',
    });
  }

  private _getXchainNetwork(isTestnet: boolean): NetworkWithCaipId {
    const network = isTestnet
      ? AVALANCHE_XP_TEST_NETWORK
      : AVALANCHE_XP_NETWORK;

    return decorateWithCaipId({
      ...network,
      chainId: isTestnet ? ChainId.AVALANCHE_TEST_X : ChainId.AVALANCHE_X,
      isTestnet,
      vmName: NetworkVMType.AVM,
      chainName: 'Avalanche (X-Chain)',
      logoUri:
        'https://images.ctfassets.net/gcj8jwzm6086/5xiGm7IBR6G44eeVlaWrxi/1b253c4744a3ad21a278091e3119feba/xchain-square.svg', // from contentful
      networkToken: {
        ...network.networkToken,
        logoUri:
          'https://images.ctfassets.net/gcj8jwzm6086/5VHupNKwnDYJvqMENeV7iJ/3e4b8ff10b69bfa31e70080a4b142cd0/avalanche-avax-logo.svg', // from contentful
      },
      explorerUrl: isTestnet
        ? 'https://subnets-test.avax.network/x-chain'
        : 'https://subnets.avax.network/x-chain',
    });
  }

  private async _initChainList(): Promise<ChainList> {
    let chainlist: ChainList | null = null;
    let attempt = 1;

    do {
      const [result] = await resolve(
        getChainsAndTokens(
          process.env.RELEASE === 'production',
          `${process.env.PROXY_URL}/tokenlist?includeSolana`,
        ),
      );

      if (result) {
        chainlist = {
          ...result,
          [BITCOIN_NETWORK.chainId]: BITCOIN_NETWORK,
          [BITCOIN_TEST_NETWORK.chainId]: BITCOIN_TEST_NETWORK,
          [ChainId.AVALANCHE_TEST_P]: this._getPchainNetwork(true),
          [ChainId.AVALANCHE_P]: this._getPchainNetwork(false),
          [ChainId.AVALANCHE_TEST_X]: this._getXchainNetwork(true),
          [ChainId.AVALANCHE_X]: this._getXchainNetwork(false),
        };
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

  async getNetwork(caipScope: string): Promise<NetworkWithCaipId | undefined>;
  async getNetwork(chainId: number): Promise<NetworkWithCaipId | undefined>;
  async getNetwork(
    scopeOrChainId: string | number,
  ): Promise<NetworkWithCaipId | undefined>;
  async getNetwork(
    scopeOrChainId: string | number,
  ): Promise<NetworkWithCaipId | undefined> {
    if (
      scopeOrChainId === AvalancheCaip2ChainId.C ||
      scopeOrChainId === AvalancheCaip2ChainId.C_TESTNET
    ) {
      return this.getCoreEthNetwork();
    }
    const chainId =
      typeof scopeOrChainId === 'string'
        ? scopeOrChainId.startsWith('0x')
          ? Number(scopeOrChainId)
          : caipToChainId(scopeOrChainId)
        : scopeOrChainId;

    const activeNetworks = await this.allNetworks.promisify();
    return activeNetworks?.[chainId];
  }

  /**
   * Returns the network object for Avalanche X/P Chains
   */
  getAvalancheNetworkXP() {
    return this._getXchainNetwork(!this.isMainnet());
  }

  async getAvalancheNetwork() {
    const activeNetworks = await this.activeNetworks.promisify();
    const network =
      activeNetworks[ChainId.AVALANCHE_TESTNET_ID] ??
      activeNetworks[ChainId.AVALANCHE_MAINNET_ID];
    if (!network) {
      throw new Error('Avalanche network not found');
    }
    return network;
  }

  // We don't want to list CoreEth network, so we have a dedicated method to get it
  // for signing things
  async getCoreEthNetwork() {
    return buildCoreEth(await this.getAvalancheNetwork());
  }

  /**
   * Returns the Ethers provider used by the Avalanche C Chain
   */
  async getAvalancheProvider(): Promise<JsonRpcBatchInternal> {
    const network = await this.getAvalancheNetwork();
    return (await getProviderForNetwork(network)) as JsonRpcBatchInternal;
  }

  /**
   * Returns the provider used by Avalanche X/P/CoreEth chains.
   */
  async getAvalanceProviderXP(): Promise<Avalanche.JsonRpcProvider> {
    return (await getProviderForNetwork(
      this.getAvalancheNetworkXP(),
    )) as Avalanche.JsonRpcProvider;
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
    return (await getProviderForNetwork(network)) as JsonRpcBatchInternal;
  }

  async getBitcoinNetwork(): Promise<NetworkWithCaipId> {
    const activeNetworks = await this.activeNetworks.promisify();
    const network =
      activeNetworks[ChainId.BITCOIN] ??
      activeNetworks[ChainId.BITCOIN_TESTNET];
    if (!network) throw new Error('Bitcoin network not found');
    return network;
  }

  async getBitcoinProvider(): Promise<BitcoinProvider> {
    const network = await this.getBitcoinNetwork();
    return (await getProviderForNetwork(network)) as BitcoinProvider;
  }

  /**
   * Sends a signed transaction if needed.
   * @returns the transaction hash
   */
  async sendTransaction(
    { txHash, signedTx }: SigningResult,
    network: Network,
  ): Promise<string> {
    // Sometimes we'll receive the TX hash directly from the wallet
    // device that signed the transaction (it's the case for WalletConnect).
    // In that scenario, we can just return early here with the hash we received.
    if (typeof txHash === 'string') {
      return txHash;
    }

    const provider = await getProviderForNetwork(network);
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
      new EthersNetwork('', chainId),
    );

    try {
      const detectedNetwork = await provider.getNetwork();
      return detectedNetwork.chainId === BigInt(chainId);
    } catch (_err) {
      return false;
    }
  }

  async saveCustomNetwork(customNetworkPayload: CustomNetworkPayload) {
    const customNetwork = decorateWithCaipId(customNetworkPayload);
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

    // Automatically favorite the newly added network
    await this.enableNetwork(chainId);

    return customNetwork;
  }

  async updateNetworkOverrides(network: NetworkOverrides) {
    const overridableProperties: Array<keyof NetworkOverrides> = [
      'rpcUrl',
      'customRpcHeaders',
    ];

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
    if (chainlist && this.uiActiveNetwork?.chainId === network.chainId) {
      // We're getting the pure network config from _allNetworks signal,
      // as that's where we have the network in it's default state.
      const pureActiveNetwork = chainlist[network.chainId];

      // Only then we apply the new overrides
      if (pureActiveNetwork) {
        this.uiActiveNetwork = decorateWithCaipId({
          ...pureActiveNetwork,
          ...overrides,
        });
      }
    }
  }

  async removeCustomNetwork(chainID: number) {
    const networkToRemove = this._customNetworks[chainID];
    const wasTestnet = networkToRemove?.isTestnet;

    const overrides = await this.storageService.load(
      NETWORK_OVERRIDES_STORAGE_KEY,
    );

    if (overrides && overrides[chainID]) {
      // Remove overrides for deleted network if they were configured
      await this.storageService.save(
        NETWORK_OVERRIDES_STORAGE_KEY,
        omit(overrides, chainID),
      );
    }

    // Remove chain ID from customNetworks list and from allNetworks list.
    delete this._customNetworks[chainID];
    const chainlist = await this._rawNetworks.promisify();
    if (chainlist && chainlist[chainID]) {
      delete chainlist[chainID];
    }

    // Update the lsit of all networks.
    this._allNetworks.dispatch({ ...chainlist, ...this._customNetworks });

    // Switch to Avalanache Mainnet or Fuji if the active network was removed.
    if (this.uiActiveNetwork?.chainId === chainID) {
      const network = await this.getNetwork(
        wasTestnet
          ? ChainId.AVALANCHE_TESTNET_ID
          : ChainId.AVALANCHE_MAINNET_ID,
      );

      if (network) {
        await this.setNetwork(runtime.id, network.caipId);
      }
    }

    await this.disableNetwork(chainID);
  }

  async getUnknownUsedNetwork(addressC: string) {
    const chainsForAddress =
      await this.glacierService.getEvmChainsForAddress(addressC);

    const usedIndexedChains =
      chainsForAddress.indexedChains?.map((chainInfo) => chainInfo.chainId) ||
      [];
    const usedUnindexedChains = chainsForAddress.unindexedChains || [];
    const allUsedChains = [...usedIndexedChains, ...usedUnindexedChains];
    const unknownChains = allUsedChains
      .filter(
        (chainId) =>
          this._networkAvailability[chainId] === undefined &&
          !NETWORKS_ENABLED_FOREVER.includes(Number(chainId)),
      )
      .map(Number);
    unknownChains.forEach((chainId) => {
      this.enableNetwork(chainId);
    });
  }

  /**
   * Basically if in testnet mode we only want to return the testnet
   * networks. Otherwise we want only mainnet networks.
   */
  #filterBasedOnDevMode = (chainList?: ChainList) => {
    return Object.values(chainList ?? {})
      .filter(
        (network) =>
          Boolean(this.uiActiveNetwork?.isTestnet) ===
          Boolean(network.isTestnet),
      )
      .reduce(
        (acc, network) => ({
          ...acc,
          [network.chainId]: network,
        }),
        {},
      );
  };

  #filterBasedOnFeatureFlags = (chainList?: ChainList) => {
    return Object.values(chainList ?? {})
      .filter((network) => {
        return (
          !isPchainNetwork(network) ||
          this.featureFlagService.featureFlags[
            FeatureGates.IN_APP_SUPPORT_P_CHAIN
          ]
        );
      })
      .filter((network) => {
        return (
          !isXchainNetwork(network) ||
          this.featureFlagService.featureFlags[
            FeatureGates.IN_APP_SUPPORT_X_CHAIN
          ]
        );
      })
      .filter(
        (network) =>
          !isSolanaNetwork(network) ||
          this.featureFlagService.featureFlags[FeatureGates.SOLANA_SUPPORT],
      )
      .reduce(
        (acc, network) => ({
          ...acc,
          [network.chainId]: network,
        }),
        {},
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
          ([, networkOverrides]) => Object.keys(networkOverrides).length > 0,
        )
        // Filter out overrides that do not apply in the current context,
        // for example if the chain list does not contain the network in question.
        .filter(([chainId]) => chainId in chainList),
    );

    return merge({}, chainList, applicableOverrides) as ChainList;
  };

  #applyChainAgnosticIds = async (chainListPromise: Promise<ChainList>) => {
    const chainList = await chainListPromise;

    return Object.fromEntries(
      Object.entries(chainList ?? {}).map(([chainId, network]) => [
        chainId,
        decorateWithCaipId(network),
      ]),
    );
  };

  #convertNetworkAvailabilityToEnabledNetworks = (
    networkAvailability: Record<number, { isEnabled: boolean }>,
  ) => {
    return Object.entries(networkAvailability)
      .filter(([, network]) => network.isEnabled)
      .map(([chainId]) => Number(chainId));
  };

  #filterByEnvironment = async (networkIds: number[]) => {
    const allNetworks = await this.allNetworks.promisify();
    const isMainnet = this.isMainnet();
    const filteredNetworks = networkIds.filter((id) => {
      if (allNetworks) {
        return isMainnet
          ? !allNetworks[id]?.isTestnet
          : allNetworks[id]?.isTestnet;
      }
      return false;
    });
    return filteredNetworks;
  };
}
