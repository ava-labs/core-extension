import {
  Blockchain,
  BridgeConfig,
  BridgeTransaction,
  Environment,
  EthereumConfigAsset,
  fetchConfig,
  NativeAsset,
  setBridgeEnvironment,
  trackBridgeTransaction as trackBridgeTransactionSDK,
  WrapStatus,
  transferAsset as transferAssetSDK,
  getMinimumConfirmations,
} from '@avalabs/bridge-sdk';
import { EventEmitter } from 'events';
import { getAvalancheProvider } from '../network/getAvalancheProvider';
import { getEthereumProvider } from '../network/getEthereumProvider';
import { FUJI_NETWORK, MAINNET_NETWORK } from '../network/models';
import { NetworkService } from '../network/NetworkService';
import { StorageService } from '../storage/StorageService';
import {
  BridgeEvents,
  BridgeState,
  BRIDGE_STORAGE_KEY,
  DefaultBridgeState,
  TransferEventType,
} from './models';
import { Big } from '@avalabs/avalanche-wallet-sdk';
import { TransactionResponse } from '@ethersproject/providers';
import { WalletService } from '../wallet/WalletService';
import { AccountsService } from '../accounts/AccountsService';
import Common, { Chain } from '@ethereumjs/common';
import { Transaction } from '@ethereumjs/tx';
import { convertTxData } from './utils';
import { singleton } from 'tsyringe';
import {
  OnLock,
  OnStorageReady,
} from '@src/background/runtime/lifecycleCallbacks';

@singleton()
export class BridgeService implements OnLock, OnStorageReady {
  private eventEmitter = new EventEmitter();
  private _bridgeState: BridgeState = DefaultBridgeState;
  private config?: BridgeConfig;

  public get bridgeState(): BridgeState {
    return this._bridgeState;
  }

  constructor(
    private storageService: StorageService,
    private networkService: NetworkService,
    private walletService: WalletService,
    private accountsService: AccountsService
  ) {}

  onStorageReady(): void {
    this.activate();
  }

  onLock() {
    this._bridgeState = DefaultBridgeState;
    this.config = undefined;
  }

  async activate() {
    await this.updateBridgeConfig();

    this._bridgeState =
      (await this.storageService.load<BridgeState>(BRIDGE_STORAGE_KEY)) ??
      DefaultBridgeState;
    this.eventEmitter.emit(
      BridgeEvents.BRIDGE_TRANSACTIONS_UPDATED,
      this.bridgeState
    );

    Object.values(this.bridgeState.bridgeTransactions).forEach(
      (bridgeTransaction) => {
        this.trackBridgeTransaction(bridgeTransaction);
      }
    );
  }

  async updateBridgeConfig() {
    setBridgeEnvironment(
      this.networkService.isMainnet ? Environment.PROD : Environment.DEV
    );
    const config = await fetchConfig();

    this.config = config;
    this.eventEmitter.emit(
      BridgeEvents.BRIDGE_CONFIG_UPDATE_EVENT,
      this.config
    );
    return config;
  }

  private trackBridgeTransaction(bridgeTransaction: BridgeTransaction) {
    if (!this.config?.config) {
      throw new Error('Bridge config not initialized');
    }
    const network =
      bridgeTransaction.environment === 'main' ? MAINNET_NETWORK : FUJI_NETWORK;
    const avalancheProvider = getAvalancheProvider(network);
    const ethereumProvider = getEthereumProvider(network);

    trackBridgeTransactionSDK({
      bridgeTransaction,
      onBridgeTransactionUpdate: this.saveBridgeTransaction.bind(this),
      config: this.config.config,
      avalancheProvider,
      ethereumProvider,
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

    if (!this.networkService.activeNetwork) {
      throw new Error('missing network');
    }

    const avalancheProvider = getAvalancheProvider(
      this.networkService.activeNetwork
    );
    const ethereumProvider = getEthereumProvider(
      this.networkService.activeNetwork
    );

    const common =
      currentBlockchain === Blockchain.AVALANCHE
        ? Common.custom({
            networkId: this.networkService.activeNetwork.config.networkID,
            chainId: parseInt(this.networkService.activeNetwork.chainId),
          })
        : new Common({
            chain: this.networkService.isMainnet
              ? Chain.Mainnet
              : Chain.Rinkeby,
          });

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
        const tx = Transaction.fromTxData(convertTxData(txData), {
          common:
            common as any /* fix "private property '_chainParams'" conflict */,
        });
        const signedTx = await this.walletService.signEvm(tx);
        const txHex = '0x' + signedTx.serialize().toString('hex');
        return txHex;
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
      environment: this.networkService.isMainnet ? 'main' : 'test',
      requiredConfirmationCount,
    };
    await this.saveBridgeTransaction(bridgeTransaction);
    this.trackBridgeTransaction(bridgeTransaction);
  }

  addListener(event: BridgeEvents, callback: (data: unknown) => void) {
    this.eventEmitter.on(event, callback);
  }
}
