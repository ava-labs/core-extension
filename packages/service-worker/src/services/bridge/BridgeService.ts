import {
  Asset,
  BitcoinConfigAsset,
  Blockchain,
  BridgeConfig,
  BridgeTransaction,
  btcToSatoshi,
  Environment,
  estimateGas,
  fetchConfig,
  getBtcTransactionDetails,
  getMinimumConfirmations,
  setBridgeEnvironment,
  trackBridgeTransaction as trackBridgeTransactionSDK,
  TrackerSubscription,
} from '@avalabs/core-bridge-sdk';
import { EventEmitter } from 'events';
import { NetworkService } from '../network/NetworkService';
import { StorageService } from '../storage/StorageService';
import { FeatureFlagService } from '../featureFlags/FeatureFlagService';
import {
  BRIDGE_STORAGE_KEY,
  BridgeEvents,
  BridgeState,
  DefaultBridgeState,
  FeatureGates,
} from '@core/types';
import { AccountsService } from '../accounts/AccountsService';
import { singleton } from 'tsyringe';
import { OnLock, OnStorageReady } from '../../runtime/lifecycleCallbacks';
import Big from 'big.js';
import { BalanceAggregatorService } from '../balances/BalanceAggregatorService';
import { TokenType, TokenWithBalanceBTC } from '@avalabs/vm-module-types';

@singleton()
export class BridgeService implements OnLock, OnStorageReady {
  private eventEmitter = new EventEmitter();
  private _bridgeState: BridgeState = DefaultBridgeState;
  private config?: BridgeConfig;
  #subscriptions = new Map<string, TrackerSubscription>();

  public get bridgeState(): BridgeState {
    return this._bridgeState;
  }

  public get bridgeConfig(): BridgeConfig {
    if (!this.config) {
      throw new Error('Bridge config not initialized');
    }
    return this.config;
  }

  constructor(
    private storageService: StorageService,
    private networkService: NetworkService,
    private accountsService: AccountsService,
    private featureFlagService: FeatureFlagService,
    private networkBalancesService: BalanceAggregatorService,
  ) {
    this.networkService.developerModeChanged.add(() => {
      this.updateBridgeConfig();
    });
    this.updateBridgeConfig();
  }

  async onStorageReady(): Promise<void> {
    this._bridgeState =
      (await this.storageService.load<BridgeState>(BRIDGE_STORAGE_KEY)) ??
      DefaultBridgeState;
    this.eventEmitter.emit(
      BridgeEvents.BRIDGE_STATE_UPDATE_EVENT,
      this.bridgeState,
    );

    await this.updateBridgeConfig();
    this.trackBridgeTransactionsFromStorage();
  }

  onLock() {
    this._bridgeState = DefaultBridgeState;
    this.config = undefined;

    // Stop tracking when extension gets locked to avoid storage errors.
    this.#subscriptions.forEach((sub, key) => {
      sub.unsubscribe();
      this.#subscriptions.delete(key);
    });
  }

  async setIsDevEnv(enabled: boolean) {
    this.saveBridgeState({ isDevEnv: enabled });
    this.updateBridgeConfig();
  }

  async updateBridgeConfig() {
    setBridgeEnvironment(this.getEnv(this.networkService.isMainnet()));
    const config = await fetchConfig();

    this.config = config;
    this.eventEmitter.emit(
      BridgeEvents.BRIDGE_CONFIG_UPDATE_EVENT,
      this.config,
    );
    return config;
  }

  private async trackBridgeTransaction(
    bridgeTransaction: BridgeTransaction,
    bridgeConfig: BridgeConfig | undefined,
  ) {
    const config = bridgeConfig?.config;
    if (!config) {
      throw new Error('Bridge config not initialized');
    }

    const avalancheProvider = await this.networkService.getAvalancheProvider();
    const ethereumProvider = await this.networkService.getEthereumProvider();
    const bitcoinProvider = await this.networkService.getBitcoinProvider();

    const subscription = trackBridgeTransactionSDK({
      bridgeTransaction,
      onBridgeTransactionUpdate: this.saveBridgeTransaction.bind(this),
      config,
      avalancheProvider,
      ethereumProvider,
      bitcoinProvider,
    });

    this.#subscriptions.set(bridgeTransaction.sourceTxHash, subscription);
  }

  private async saveBridgeTransaction(bridgeTransaction: BridgeTransaction) {
    this.saveBridgeState({
      bridgeTransactions: {
        ...this.bridgeState.bridgeTransactions,
        [bridgeTransaction.sourceTxHash]: bridgeTransaction,
      },
    });
  }

  private async saveBridgeState(updates: Partial<BridgeState>) {
    this._bridgeState = {
      ...this.bridgeState,
      ...updates,
    };
    await this.storageService.save(BRIDGE_STORAGE_KEY, this.bridgeState);
    this.eventEmitter.emit(
      BridgeEvents.BRIDGE_STATE_UPDATE_EVENT,
      this.bridgeState,
    );
  }

  async removeBridgeTransaction(sourceTxHash: string) {
    const { [sourceTxHash]: _removed, ...bridgeTransactions } =
      this.bridgeState.bridgeTransactions;

    this.#subscriptions.get(sourceTxHash)?.unsubscribe();
    this.#subscriptions.delete(sourceTxHash);

    this._bridgeState = { ...this.bridgeState, bridgeTransactions };
    await this.storageService.save(BRIDGE_STORAGE_KEY, this.bridgeState);
    this.eventEmitter.emit(
      BridgeEvents.BRIDGE_STATE_UPDATE_EVENT,
      this.bridgeState,
    );
  }

  async estimateGas(
    currentBlockchain: Blockchain,
    amount: Big,
    asset: Asset,
  ): Promise<bigint | undefined> {
    if (!this.config?.config) {
      throw new Error('missing bridge config');
    }
    const activeAccount = await this.accountsService.getActiveAccount();
    if (!activeAccount) {
      throw new Error('no active account found');
    }
    this.featureFlagService.ensureFlagEnabled(FeatureGates.BRIDGE);

    if (currentBlockchain === Blockchain.BITCOIN) {
      const btcNetwork = await this.networkService.getBitcoinNetwork();
      const addressBtc = activeAccount.addressBTC;

      if (!addressBtc) {
        throw new Error('No BTC address');
      }

      const balances = await this.networkBalancesService.getBalancesForNetworks(
        {
          chainIds: [btcNetwork.chainId],
          accounts: [activeAccount],
          tokenTypes: [TokenType.NATIVE], // We only care about BTC here, which is a native token
        },
      );

      const token = balances.tokens[btcNetwork.chainId]?.[addressBtc]?.[
        'BTC'
      ] as TokenWithBalanceBTC;

      const utxos = token?.utxos ?? [];

      // Bitcoin's formula for fee is `transactionByteLength * feeRate`.
      // By setting the feeRate here to 1, we'll receive the transaction's byte length,
      // which is what we need to have the dynamic fee calculations in the UI.
      // Think of the byteLength as gasLimit for EVM transactions.
      const feeRate = 1;
      const { fee: byteLength } = getBtcTransactionDetails(
        this.config.config,
        addressBtc,
        utxos,
        btcToSatoshi(amount),
        feeRate,
      );

      return BigInt(byteLength);
    } else {
      const avalancheProvider =
        await this.networkService.getAvalancheProvider();
      const ethereumProvider = await this.networkService.getEthereumProvider();

      return estimateGas(
        amount,
        activeAccount.addressC,
        asset as Exclude<Asset, BitcoinConfigAsset>,
        {
          ethereum: ethereumProvider,
          avalanche: avalancheProvider,
        },
        this.config.config,
        currentBlockchain,
      );
    }
  }

  async createTransaction(
    sourceChain: Blockchain,
    sourceTxHash: string,
    sourceStartedAt: number,
    targetChain: Blockchain,
    amount: Big,
    symbol: string,
  ) {
    const { config } = await this.updateBridgeConfig();
    const activeAccount = await this.accountsService.getActiveAccount();
    if (!activeAccount || !config) {
      throw new Error('wallet not ready');
    }

    if (this.bridgeState.bridgeTransactions[sourceTxHash]) {
      throw new Error('bridge tx already exists');
    }

    this.featureFlagService.ensureFlagEnabled(FeatureGates.BRIDGE);

    const addressC = activeAccount.addressC;
    const addressBTC = activeAccount.addressBTC ?? '';

    const requiredConfirmationCount = getMinimumConfirmations(
      sourceChain,
      config,
    );
    const environment = this.networkService.isMainnet() ? 'main' : 'test';
    const bridgeTransaction: BridgeTransaction = {
      /* from params */
      sourceChain,
      sourceTxHash,
      sourceStartedAt,
      targetChain,
      amount,
      symbol,
      /* new fields */
      addressC,
      addressBTC,
      complete: false,
      confirmationCount: 0,
      environment,
      requiredConfirmationCount,
    };
    await this.saveBridgeTransaction(bridgeTransaction);
    this.trackBridgeTransaction(bridgeTransaction, this.config);
  }

  addListener(event: BridgeEvents, callback: (data: unknown) => void) {
    this.eventEmitter.on(event, callback);
  }

  private getEnv(isMainnet: boolean) {
    return isMainnet
      ? Environment.PROD
      : this.bridgeState.isDevEnv
        ? Environment.DEV
        : Environment.TEST;
  }

  /**
   * Must be called after bridgeTransactions have been loaded from storage.
   */
  private async trackBridgeTransactionsFromStorage() {
    const configs: { [env in Environment]?: BridgeConfig } = {};

    Object.values(this.bridgeState.bridgeTransactions).forEach(
      async (bridgeTransaction) => {
        const env = this.getEnv(bridgeTransaction.environment === 'main');
        let config = configs[env];
        if (!config) {
          config = await fetchConfig(env);
          configs[env] = config;
        }
        this.trackBridgeTransaction(bridgeTransaction, config);
      },
    );
  }
}
