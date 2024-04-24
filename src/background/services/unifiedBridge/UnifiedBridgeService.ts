import { singleton } from 'tsyringe';
import {
  BridgeTransfer,
  BridgeType,
  Chain,
  ChainAssetMap,
  createUnifiedBridgeService,
  Environment,
  TokenType,
} from '@avalabs/bridge-unified';
import { JsonRpcApiProvider, TransactionRequest } from 'ethers';
import { ethErrors } from 'eth-rpc-errors';
import EventEmitter from 'events';

import { chainIdToCaip } from '@src/utils/caipConversion';
import { OnStorageReady } from '@src/background/runtime/lifecycleCallbacks';
import { CommonError } from '@src/utils/errors';

import { WalletService } from '../wallet/WalletService';
import { NetworkService } from '../network/NetworkService';
import { AccountsService } from '../accounts/AccountsService';
import { NetworkFeeService } from '../networkFee/NetworkFeeService';
import { StorageService } from '../storage/StorageService';

import {
  UNIFIED_BRIDGE_DEFAULT_STATE,
  UNIFIED_BRIDGE_STATE_STORAGE_KEY,
  UNIFIED_BRIDGE_TRACKED_FLAGS,
  UnifiedBridgeError,
  UnifiedBridgeEstimateGasParams,
  UnifiedBridgeEvent,
  UnifiedBridgeState,
  UnifiedBridgeTransferParams,
} from './models';
import { isBitcoinNetwork } from '../network/utils/isBitcoinNetwork';
import { FeatureFlagService } from '../featureFlags/FeatureFlagService';
import {
  FeatureFlagEvents,
  FeatureFlags,
  FeatureGates,
} from '../featureFlags/models';
import sentryCaptureException, {
  SentryExceptionTypes,
} from '@src/monitoring/sentryCaptureException';
import { FeeRate } from '../networkFee/models';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';
import { JsonRpcBatchInternal } from '@avalabs/wallets-sdk';

@singleton()
export class UnifiedBridgeService implements OnStorageReady {
  #core: ReturnType<typeof createUnifiedBridgeService>;
  #eventEmitter = new EventEmitter();
  #state = UNIFIED_BRIDGE_DEFAULT_STATE;

  // We'll re-create the #core instance when one of these flags is toggled.
  #flagStates: Partial<FeatureFlags> = {};

  get state() {
    return this.#state;
  }

  async getAssets(): Promise<ChainAssetMap> {
    return this.#core.getAssets();
  }

  constructor(
    private networkService: NetworkService,
    private accountsService: AccountsService,
    private walletService: WalletService,
    private feeService: NetworkFeeService,
    private storageService: StorageService,
    private featureFlagService: FeatureFlagService
  ) {
    this.#flagStates = this.#getTrackedFlags(
      this.featureFlagService.featureFlags
    );
    this.#core = this.#createService();

    // When testnet mode is toggled, we need to recreate the instance.
    this.networkService.developerModeChanged.add(() => {
      this.#core = this.#createService();
    });

    // When some of the feature flags change, we need to recreate the instance.
    // Some of the bridge types may have gotten disabled via a feature flag.
    this.featureFlagService.addListener(
      FeatureFlagEvents.FEATURE_FLAG_UPDATED,
      (flags) => {
        const newFlags = this.#getTrackedFlags(flags);

        if (JSON.stringify(newFlags) !== JSON.stringify(this.#flagStates)) {
          this.#flagStates = newFlags;
          this.#core = this.#createService();
        }
      }
    );
  }

  #getTrackedFlags(flags: FeatureFlags): Partial<FeatureFlags> {
    return Object.fromEntries(
      Object.entries(flags).filter(([flag]) =>
        UNIFIED_BRIDGE_TRACKED_FLAGS.includes(flag as FeatureGates)
      )
    );
  }

  async onStorageReady() {
    const state =
      (await this.storageService.load<UnifiedBridgeState>(
        UNIFIED_BRIDGE_STATE_STORAGE_KEY
      )) ?? UNIFIED_BRIDGE_DEFAULT_STATE;

    this.#saveState(state);
  }

  #trackPendingTransfers() {
    Object.values(this.#state.pendingTransfers)
      .filter((transfer) => !transfer.completedAt)
      .forEach((transfer) => {
        try {
          this.trackTransfer(transfer);
        } catch {
          // Unified Bridge SDK may raise an error if we're asking about a transfer
          // while we're on the wrong environment (it won't find it).
          // We do nothing when it happens. Just let it be - we'll track this transfer
          // when user switches back to mainnet/testnet.
        }
      });
  }

  #updateBridgeAddresses() {
    const addresses: string[] = [];

    this.#core.bridges.forEach((bridge) => {
      if (bridge.config) {
        addresses.push(
          ...bridge.config.map(
            ({ tokenRouterAddress }) => tokenRouterAddress as string
          )
        );
      }
    });

    this.#saveState({
      ...this.#state,
      addresses,
    });
  }

  #getDisabledBridges(): BridgeType[] {
    const bridges: BridgeType[] = [];

    if (!this.#flagStates[FeatureGates.UNIFIED_BRIDGE_CCTP]) {
      bridges.push(BridgeType.CCTP);
    }

    return bridges;
  }

  #createService() {
    const core = createUnifiedBridgeService({
      environment: this.networkService.isMainnet()
        ? Environment.PROD
        : Environment.TEST,
      disabledBridgeTypes: this.#getDisabledBridges(),
    });
    core.init().then(async () => {
      this.#eventEmitter.emit(
        UnifiedBridgeEvent.AssetsUpdated,
        await core.getAssets()
      );
      this.#updateBridgeAddresses();
      this.#trackPendingTransfers();
    });

    return core;
  }

  async getFee({
    asset,
    amount,
    sourceChainId,
    targetChainId,
  }): Promise<bigint> {
    const feeMap = await this.#core.getFees({
      asset,
      amount,
      targetChain: await this.#buildChain(targetChainId),
      sourceChain: await this.#buildChain(sourceChainId),
    });

    const fee = feeMap[asset.address];

    if (typeof fee !== 'bigint') {
      throw ethErrors.rpc.invalidRequest({
        data: {
          reason: UnifiedBridgeError.InvalidFee,
        },
      });
    }

    return fee;
  }

  async estimateGas({
    asset,
    amount,
    targetChainId,
  }: UnifiedBridgeEstimateGasParams): Promise<bigint> {
    const { fromAddress, sourceChain, targetChain } = await this.#buildParams({
      targetChainId,
    });

    const gasLimit = await this.#core.estimateGas({
      asset,
      fromAddress,
      amount,
      sourceChain,
      targetChain,
    });

    return gasLimit;
  }

  async #buildParams({ targetChainId }):
    | Promise<{
        sourceChain: Chain;
        sourceChainId: number;
        targetChain: Chain;
        provider: JsonRpcApiProvider;
        fromAddress: `0x${string}`;
      }>
    | never {
    const { activeAccount } = this.accountsService;
    const { activeNetwork } = this.networkService;

    if (!activeAccount) {
      throw ethErrors.rpc.invalidParams({
        data: {
          reason: CommonError.NoActiveAccount,
        },
      });
    }

    if (!activeNetwork) {
      throw ethErrors.rpc.invalidParams({
        data: {
          reason: CommonError.NoActiveNetwork,
        },
      });
    }

    if (isBitcoinNetwork(activeNetwork)) {
      throw ethErrors.rpc.invalidParams({
        data: {
          reason: UnifiedBridgeError.UnsupportedNetwork,
        },
      });
    }

    const sourceChainId = activeNetwork.chainId;
    const sourceChain = await this.#buildChain(sourceChainId);
    const targetChain = await this.#buildChain(targetChainId);

    const provider = getProviderForNetwork(
      activeNetwork
    ) as JsonRpcBatchInternal;

    const fromAddress = activeAccount.addressC as `0x${string}`;

    return {
      sourceChain,
      sourceChainId,
      targetChain,
      provider,
      fromAddress,
    };
  }

  async transfer({
    asset,
    amount,
    targetChainId,
    customGasSettings,
    tabId,
  }: UnifiedBridgeTransferParams): Promise<BridgeTransfer> {
    const { fromAddress, provider, sourceChain, sourceChainId, targetChain } =
      await this.#buildParams({ targetChainId });

    const bridgeTransfer = await this.#core.transferAsset({
      asset,
      fromAddress,
      amount,
      sourceChain,
      targetChain,
      onStepChange: (stepDetails) => {
        this.#eventEmitter.emit(
          UnifiedBridgeEvent.TransferStepChange,
          stepDetails
        );
      },
      sign: async ({ from, to, data }) => {
        let feeRate: FeeRate = {
          maxFee: customGasSettings?.maxFeePerGas ?? 0n,
          maxTip: customGasSettings?.maxPriorityFeePerGas ?? 0n,
        };

        // If we have no custom fee rate, fetch it from the network
        if (!feeRate.maxFee) {
          const networkFee = await this.feeService.getNetworkFee();

          if (networkFee) {
            feeRate = networkFee.high;
          }
        }

        if (!feeRate.maxFee) {
          throw ethErrors.rpc.internal({
            data: { reason: CommonError.UnknownNetworkFee },
          });
        }

        const nonce = await (
          provider as JsonRpcApiProvider
        ).getTransactionCount(from);

        const gasLimit = await this.feeService.estimateGasLimit(
          from,
          to as string,
          data as string
        );

        const result = await this.walletService.sign(
          {
            from,
            to,
            data,
            chainId: sourceChainId,
            gasLimit,
            maxFeePerGas: feeRate.maxFee,
            maxPriorityFeePerGas: feeRate.maxTip,
            nonce,
          } as TransactionRequest,
          tabId
        );

        const hash = (await this.networkService.sendTransaction(
          result
        )) as `0x${string}`;

        return hash;
      },
    });

    await this.updatePendingTransfer(bridgeTransfer);
    this.trackTransfer(bridgeTransfer);

    return bridgeTransfer;
  }

  trackTransfer(bridgeTransfer: BridgeTransfer) {
    const { result } = this.#core.trackTransfer({
      bridgeTransfer,
      updateListener: async (transfer) => {
        await this.updatePendingTransfer(transfer);
      },
    });

    result.then((completedTransfer) =>
      this.updatePendingTransfer(completedTransfer)
    );
  }

  async removeTrackedTransfer(txHash: string) {
    delete this.#state.pendingTransfers[txHash];

    this.#saveState({ ...this.#state });
  }

  async updatePendingTransfer(transfer: BridgeTransfer) {
    if (transfer.errorCode) {
      sentryCaptureException(
        new Error(`Bridge unsucessful. Error code: ${transfer.errorCode}`),
        SentryExceptionTypes.UNIFIED_BRIDGE
      );
    }

    this.#saveState({
      ...this.#state,
      pendingTransfers: {
        ...this.#state.pendingTransfers,
        [transfer.sourceTxHash]: transfer,
      },
    });
  }

  async #saveState(newState: UnifiedBridgeState) {
    this.#state = newState;
    this.#eventEmitter.emit(UnifiedBridgeEvent.StateUpdated, newState);

    try {
      await this.storageService.save(
        UNIFIED_BRIDGE_STATE_STORAGE_KEY,
        newState
      );
    } catch {
      // May be called before extension is unlocked. Ignore.
    }
  }

  async #buildChain(chainId: number): Promise<Chain> {
    const network = await this.networkService.getNetwork(chainId);

    if (!network) {
      throw ethErrors.rpc.invalidParams({
        data: {
          reason: CommonError.UnknownNetwork,
        },
      });
    }

    return {
      chainId: chainIdToCaip(network.chainId),
      chainName: network.chainName,
      rpcUrl: network.rpcUrl,
      networkToken: {
        ...network.networkToken,
        type: TokenType.NATIVE,
      },
      utilityAddresses: {
        multicall: network.utilityAddresses?.multicall as `0x${string}`,
      },
    };
  }

  addListener(eventName: string, callback) {
    this.#eventEmitter.addListener(eventName, callback);
  }
}
