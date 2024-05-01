import { resolve } from '@avalabs/utils-sdk';
import {
  Asset,
  BitcoinConfigAsset,
  Blockchain,
  BridgeConfig,
  BridgeTransaction,
  btcToSatoshi,
  Environment,
  estimateGas,
  EthereumConfigAsset,
  fetchConfig,
  getBtcTransactionDetails,
  getMinimumConfirmations,
  NativeAsset,
  setBridgeEnvironment,
  trackBridgeTransaction as trackBridgeTransactionSDK,
  TrackerSubscription,
  transferAsset as transferAssetSDK,
  WrapStatus,
} from '@avalabs/bridge-sdk';
import { isNil, omit, omitBy } from 'lodash';
import { EventEmitter } from 'events';
import { NetworkService } from '../network/NetworkService';
import { StorageService } from '../storage/StorageService';
import { FeatureFlagService } from '../featureFlags/FeatureFlagService';
import {
  BRIDGE_STORAGE_KEY,
  BridgeEvents,
  BridgeState,
  DefaultBridgeState,
  TransferEventType,
  BtcTransactionResponse,
  CustomGasSettings,
} from './models';
import { WalletService } from '../wallet/WalletService';
import { AccountsService } from '../accounts/AccountsService';
import { singleton } from 'tsyringe';
import {
  OnLock,
  OnStorageReady,
} from '@src/background/runtime/lifecycleCallbacks';
import Big from 'big.js';
import { NetworkFeeService } from '../networkFee/NetworkFeeService';
import { BalanceAggregatorService } from '../balances/BalanceAggregatorService';
import { Avalanche, JsonRpcBatchInternal } from '@avalabs/wallets-sdk';
import { isWalletConnectAccount } from '../accounts/utils/typeGuards';
import { FeatureGates } from '../featureFlags/models';
import { TransactionResponse } from 'ethers';
import { wrapError } from '@src/utils/errors';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';

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
    private walletService: WalletService,
    private accountsService: AccountsService,
    private featureFlagService: FeatureFlagService,
    private networkFeeService: NetworkFeeService,
    private networkBalancesService: BalanceAggregatorService
  ) {
    this.networkService.developerModeChanged.add(() => {
      this.updateBridgeConfig();
    });
  }

  async onStorageReady(): Promise<void> {
    this._bridgeState =
      (await this.storageService.load<BridgeState>(BRIDGE_STORAGE_KEY)) ??
      DefaultBridgeState;
    this.eventEmitter.emit(
      BridgeEvents.BRIDGE_STATE_UPDATE_EVENT,
      this.bridgeState
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
    setBridgeEnvironment(this.getEnv(await this.networkService.isMainnet()));
    const config = await fetchConfig();

    this.config = config;
    this.eventEmitter.emit(
      BridgeEvents.BRIDGE_CONFIG_UPDATE_EVENT,
      this.config
    );
    return config;
  }

  private async trackBridgeTransaction(
    bridgeTransaction: BridgeTransaction,
    bridgeConfig: BridgeConfig | undefined
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
      this.bridgeState
    );
  }

  async removeBridgeTransaction(sourceTxHash: string) {
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      [sourceTxHash]: _removed,
      ...bridgeTransactions
    } = this.bridgeState.bridgeTransactions;

    this.#subscriptions.get(sourceTxHash)?.unsubscribe();
    this.#subscriptions.delete(sourceTxHash);

    this._bridgeState = { ...this.bridgeState, bridgeTransactions };
    await this.storageService.save(BRIDGE_STORAGE_KEY, this.bridgeState);
    this.eventEmitter.emit(
      BridgeEvents.BRIDGE_STATE_UPDATE_EVENT,
      this.bridgeState
    );
  }

  async transferBtcAsset(
    amount: Big,
    customGasSettings?: CustomGasSettings,
    tabId?: number
  ): Promise<BtcTransactionResponse> {
    if (!this.config?.config) {
      throw new Error('Missing bridge config');
    }

    const { activeAccount } = this.accountsService;

    if (isWalletConnectAccount(activeAccount)) {
      throw new Error('WalletConnect accounts are not supported by Bridge yet');
    }

    const addressBtc = activeAccount?.addressBTC;

    if (!addressBtc) {
      throw new Error('No active account found');
    }

    const btcNetwork = await this.networkService.getBitcoinNetwork();

    const provider = getProviderForNetwork(btcNetwork);
    if (
      provider instanceof JsonRpcBatchInternal ||
      provider instanceof Avalanche.JsonRpcProvider
    ) {
      throw new Error('Wrong provider found.');
    }

    const amountInSatoshis = btcToSatoshi(amount);

    // mimicing the same feeRate in useBtcBridge
    const feeRate =
      customGasSettings?.maxFeePerGas ??
      Number(
        (await this.networkFeeService.getNetworkFee(btcNetwork))?.high.maxFee ??
          0
      );

    const token =
      this.networkBalancesService.balances[btcNetwork.chainId]?.[addressBtc]?.[
        'BTC'
      ];

    const utxos = token?.utxos ?? [];

    const { inputs, outputs } = getBtcTransactionDetails(
      this.config.config,
      addressBtc,
      utxos,
      amountInSatoshis,
      Number(feeRate)
    );

    const inputsWithScripts = await provider.getScriptsForUtxos(inputs);

    const signResult = await this.walletService
      .sign({ inputs: inputsWithScripts, outputs }, tabId, btcNetwork)
      .catch(wrapError('Failed to sign transaction'));

    // If we received a signed tx, we need to issue it ourselves.
    if (typeof signResult.signedTx === 'string') {
      const [sendResult, sendError] = await resolve(
        provider.issueRawTx(signResult.signedTx)
      );

      if (!sendResult || sendError) {
        throw new Error('Failed to send transaction.');
      }

      const [tx, txError] = await resolve(provider.waitForTx(sendResult));

      if (!tx || txError) {
        throw new Error('Failed to fetch transaction details.');
      }

      return {
        hash: tx.hash,
        gasLimit: BigInt(tx.fees),
        value: BigInt(amountInSatoshis),
        confirmations: tx.confirmations,
        from: addressBtc,
      };
    }

    // If we received the tx hash, we can look it up for details.
    if (typeof signResult.txHash === 'string') {
      const [tx, txError] = await resolve(
        provider.waitForTx(signResult.txHash)
      );

      if (!tx || txError) {
        throw new Error('Transaction not found');
      }

      return {
        hash: tx.hash,
        gasLimit: BigInt(tx.fees),
        value: BigInt(amountInSatoshis),
        confirmations: tx.confirmations,
        from: addressBtc,
      };
    }

    throw new Error(
      'Unsupported signing result format. Signed TX or TX hash expected'
    );
  }

  async estimateGas(
    currentBlockchain: Blockchain,
    amount: Big,
    asset: Asset
  ): Promise<bigint | undefined> {
    if (!this.config?.config) {
      throw new Error('missing bridge config');
    }
    if (!this.accountsService.activeAccount) {
      throw new Error('no active account found');
    }
    this.featureFlagService.ensureFlagEnabled(FeatureGates.BRIDGE);

    if (currentBlockchain === Blockchain.BITCOIN) {
      const btcNetwork = await this.networkService.getBitcoinNetwork();
      const addressBtc = this.accountsService.activeAccount.addressBTC;

      if (!addressBtc) {
        throw new Error('No BTC address');
      }

      const token =
        this.networkBalancesService.balances[btcNetwork.chainId]?.[
          addressBtc
        ]?.['BTC'];

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
        feeRate
      );

      return BigInt(byteLength);
    } else {
      const avalancheProvider =
        await this.networkService.getAvalancheProvider();
      const ethereumProvider = await this.networkService.getEthereumProvider();

      return estimateGas(
        amount,
        this.accountsService.activeAccount.addressC,
        asset as Exclude<Asset, BitcoinConfigAsset>,
        {
          ethereum: ethereumProvider,
          avalanche: avalancheProvider,
        },
        this.config.config,
        currentBlockchain
      );
    }
  }

  async transferAsset(
    currentBlockchain: Blockchain,
    amount: Big,
    asset: EthereumConfigAsset | NativeAsset,
    customGasSettings?: CustomGasSettings,
    tabId?: number
  ): Promise<TransactionResponse | undefined> {
    if (!this.config?.config) {
      throw new Error('missing bridge config');
    }
    if (!this.accountsService.activeAccount) {
      throw new Error('no active account found');
    }
    this.featureFlagService.ensureFlagEnabled(FeatureGates.BRIDGE);

    const avalancheProvider = await this.networkService.getAvalancheProvider();
    const ethereumProvider = await this.networkService.getEthereumProvider();

    // We have to get the network for the current blockchain
    let network;
    if (currentBlockchain === Blockchain.AVALANCHE) {
      network = await this.networkService.getAvalancheNetwork();
    } else if (currentBlockchain === Blockchain.ETHEREUM) {
      network = await this.networkService.getEthereumNetwork();
    }

    return await transferAssetSDK(
      currentBlockchain,
      amount,
      this.accountsService.activeAccount.addressC,
      asset,
      avalancheProvider,
      ethereumProvider,
      this.config.config,
      (status: WrapStatus) =>
        this.eventEmitter.emit(BridgeEvents.BRIDGE_TRANSFER_EVENT, {
          type: TransferEventType.WRAP_STATUS,
          status,
        }),
      (txHash: string) =>
        this.eventEmitter.emit(BridgeEvents.BRIDGE_TRANSFER_EVENT, {
          type: TransferEventType.TX_HASH,
          txHash,
        }),
      async (txData) => {
        // ignore our gas estimation, use whatever the SDK estimated at the time of signing
        const gasSettings = omit(customGasSettings ?? {}, 'gasLimit');

        const tx = {
          ...txData,
          // do not override gas-related properties with nullish values
          ...omitBy(gasSettings ?? {}, isNil),
        };
        return this.walletService.sign(
          {
            ...tx,
            gasPrice: tx.maxFeePerGas ? undefined : tx.gasPrice, // erase gasPrice if maxFeePerGas can be used
            type: tx.maxFeePerGas ? undefined : 0, // use type: 0 if it's not an EIP-1559 transaction
          },
          tabId,
          network
        );
      }
    );
  }

  async createTransaction(
    sourceChain: Blockchain,
    sourceTxHash: string,
    sourceStartedAt: number,
    targetChain: Blockchain,
    amount: Big,
    symbol: string
  ) {
    const { config } = await this.updateBridgeConfig();
    if (!this.accountsService.activeAccount || !config) {
      throw new Error('wallet not ready');
    }

    if (this.bridgeState.bridgeTransactions[sourceTxHash]) {
      throw new Error('bridge tx already exists');
    }

    this.featureFlagService.ensureFlagEnabled(FeatureGates.BRIDGE);

    const addressC = this.accountsService.activeAccount.addressC;
    const addressBTC = this.accountsService.activeAccount.addressBTC ?? '';

    const requiredConfirmationCount = getMinimumConfirmations(
      sourceChain,
      config
    );
    const isMainnet = await this.networkService.isMainnet();
    const environment = isMainnet ? 'main' : 'test';
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
      }
    );
  }
}
