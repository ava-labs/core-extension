import {
  Blockchain,
  BridgeConfig,
  BridgeTransaction,
  Environment,
  EthereumConfigAsset,
  fetchConfig,
  getMinimumConfirmations,
  NativeAsset,
  setBridgeEnvironment,
  trackBridgeTransaction as trackBridgeTransactionSDK,
  transferAsset as transferAssetSDK,
  WrapStatus,
} from '@avalabs/bridge-sdk';
import { EventEmitter } from 'events';
import { NetworkService } from '../network/NetworkService';
import { StorageService } from '../storage/StorageService';
import {
  BRIDGE_STORAGE_KEY,
  BridgeEvents,
  BridgeState,
  DefaultBridgeState,
  TransferEventType,
} from './models';
import { TransactionResponse } from '@ethersproject/providers';
import { WalletService } from '../wallet/WalletService';
import { AccountsService } from '../accounts/AccountsService';
import { deserializeBridgeState } from './utils';
import { singleton } from 'tsyringe';
import {
  OnLock,
  OnStorageReady,
} from '@src/background/runtime/lifecycleCallbacks';
import Big from 'big.js';

@singleton()
export class BridgeService implements OnLock, OnStorageReady {
  private eventEmitter = new EventEmitter();
  private _bridgeState: BridgeState = DefaultBridgeState;
  private config?: BridgeConfig;

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
    private accountsService: AccountsService
  ) {
    this.networkService.activeNetwork.add(() => {
      this.updateBridgeConfig();
    });
  }

  onStorageReady(): void {
    this.activate();
  }

  onLock() {
    this._bridgeState = DefaultBridgeState;
    this.config = undefined;
  }

  async activate() {
    await this.updateBridgeConfig();

    this._bridgeState = deserializeBridgeState(
      (await this.storageService.load<BridgeState>(BRIDGE_STORAGE_KEY)) ??
        DefaultBridgeState
    );
    this.eventEmitter.emit(
      BridgeEvents.BRIDGE_TRANSACTIONS_UPDATED,
      this.bridgeState
    );

    // Track bridgeTransactions from storage
    const envs = Object.values(this.bridgeState.bridgeTransactions).map(
      (bridgeTransaction) =>
        this.getEnv(bridgeTransaction.environment === 'main')
    );
    const prodConfig = envs.includes(Environment.PROD)
      ? await fetchConfig(Environment.PROD)
      : undefined;
    const testConfig = envs.includes(Environment.TEST)
      ? await fetchConfig(Environment.TEST)
      : undefined;
    Object.values(this.bridgeState.bridgeTransactions).forEach(
      (bridgeTransaction) => {
        const config =
          bridgeTransaction.environment === 'main' ? prodConfig : testConfig;
        this.trackBridgeTransaction(bridgeTransaction, config);
      }
    );
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

    trackBridgeTransactionSDK({
      bridgeTransaction,
      onBridgeTransactionUpdate: this.saveBridgeTransaction.bind(this),
      config,
      avalancheProvider,
      ethereumProvider,
      bitcoinProvider,
    });
  }

  private async saveBridgeTransaction(bridgeTransaction: BridgeTransaction) {
    const nextBridgeState = {
      ...this.bridgeState,
      bridgeTransactions: {
        ...this.bridgeState.bridgeTransactions,
        [bridgeTransaction.sourceTxHash]: bridgeTransaction,
      },
    };
    this._bridgeState = nextBridgeState;
    await this.storageService.save(BRIDGE_STORAGE_KEY, this.bridgeState);
    this.eventEmitter.emit(
      BridgeEvents.BRIDGE_TRANSACTIONS_UPDATED,
      this.bridgeState
    );
  }

  async removeBridgeTransaction(sourceTxHash: string) {
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      [sourceTxHash]: _removed,
      ...bridgeTransactions
    } = this.bridgeState.bridgeTransactions;

    this._bridgeState = { ...this.bridgeState, bridgeTransactions };
    await this.storageService.save(BRIDGE_STORAGE_KEY, this.bridgeState);
    this.eventEmitter.emit(
      BridgeEvents.BRIDGE_TRANSACTIONS_UPDATED,
      this.bridgeState
    );
  }

  async transferAsset(
    currentBlockchain: Blockchain,
    amount: Big,
    asset: EthereumConfigAsset | NativeAsset
  ): Promise<TransactionResponse | undefined> {
    if (!this.config?.config) {
      throw new Error('missing bridge config');
    }
    if (!this.accountsService.activeAccount) {
      throw new Error('no active account found');
    }

    const avalancheProvider = await this.networkService.getAvalancheProvider();
    const ethereumProvider = await this.networkService.getEthereumProvider();

    // We have to get the network for the current blockchain
    let network;
    if (currentBlockchain === Blockchain.AVALANCHE) {
      network = await this.networkService.getAvalancheNetwork();
    } else if (currentBlockchain === Blockchain.BITCOIN) {
      network = await this.networkService.getBitcoinNetwork();
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
        return await this.walletService.sign(txData, network);
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

    const addressC = this.accountsService.activeAccount.addressC;
    const addressBTC = this.accountsService.activeAccount.addressBTC;
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
    return isMainnet ? Environment.PROD : Environment.TEST;
  }
}
