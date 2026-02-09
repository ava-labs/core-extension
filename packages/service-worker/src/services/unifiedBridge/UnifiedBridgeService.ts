import {
  AnalyzeTxParams,
  AnalyzeTxResult,
  BridgeInitializer,
  BridgeTransfer,
  BridgeType,
  createUnifiedBridgeService,
  Environment,
  getEnabledBridgeServices,
} from '@avalabs/bridge-unified';
import { wait } from '@avalabs/core-utils-sdk';
import { BitcoinProvider } from '@avalabs/core-wallets-sdk';
import EventEmitter from 'events';
import { singleton } from 'tsyringe';

import { OnStorageReady } from '../../runtime/lifecycleCallbacks';
import { NetworkService } from '../network/NetworkService';
import { StorageService } from '../storage/StorageService';

import {
  getEnabledBridgeTypes,
  getExponentialBackoffDelay,
  Monitoring,
} from '@core/common';
import {
  FeatureFlagEvents,
  FeatureFlags,
  FeatureGates,
  UNIFIED_BRIDGE_DEFAULT_STATE,
  UNIFIED_BRIDGE_STATE_STORAGE_KEY,
  UNIFIED_BRIDGE_TRACKED_FLAGS,
  UnifiedBridgeEvent,
  UnifiedBridgeState,
} from '@core/types';
import { FeatureFlagService } from '../featureFlags/FeatureFlagService';

@singleton()
export class UnifiedBridgeService implements OnStorageReady {
  #core?: ReturnType<typeof createUnifiedBridgeService>;
  #eventEmitter = new EventEmitter();
  #state = UNIFIED_BRIDGE_DEFAULT_STATE;
  #failedInitAttempts = 0;

  // We'll re-create the #core instance when one of these flags is toggled.
  #flagStates: Partial<FeatureFlags> = {};

  get state() {
    return this.#state;
  }

  constructor(
    private networkService: NetworkService,
    private storageService: StorageService,
    private featureFlagService: FeatureFlagService,
  ) {
    this.#flagStates = this.#getTrackedFlags(
      this.featureFlagService.featureFlags,
    );
    this.#recreateService();

    // When testnet mode is toggled, we need to recreate the instance.
    this.networkService.developerModeChanged.add(() => {
      this.#recreateService();
    });

    // When some of the feature flags change, we need to recreate the instance.
    // Some of the bridge types may have gotten disabled via a feature flag.
    this.featureFlagService.addListener(
      FeatureFlagEvents.FEATURE_FLAG_UPDATED,
      (flags) => {
        const newFlags = this.#getTrackedFlags(flags);

        if (JSON.stringify(newFlags) !== JSON.stringify(this.#flagStates)) {
          this.#flagStates = newFlags;
          this.#recreateService();
        }
      },
    );
  }

  #getTrackedFlags(flags: FeatureFlags): Partial<FeatureFlags> {
    return Object.fromEntries(
      Object.entries(flags).filter(([flag]) =>
        UNIFIED_BRIDGE_TRACKED_FLAGS.includes(flag as FeatureGates),
      ),
    );
  }

  async onStorageReady() {
    const state =
      (await this.storageService.load<UnifiedBridgeState>(
        UNIFIED_BRIDGE_STATE_STORAGE_KEY,
      )) ?? UNIFIED_BRIDGE_DEFAULT_STATE;

    this.#saveState(state);
    this.#trackPendingTransfers();
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

  #getBridgeInitializers(
    bitcoinProvider: BitcoinProvider,
  ): BridgeInitializer[] {
    return getEnabledBridgeTypes(this.#flagStates).map((type) =>
      this.#getInitializerForBridgeType(type, bitcoinProvider),
    );
  }

  #getInitializerForBridgeType(
    type: BridgeType,
    bitcoinProvider: BitcoinProvider,
  ): BridgeInitializer {
    // This backend service is only used for transaction tracking purposes,
    // therefore we don't need to provide true signing capabilities.
    const dummySigner = {
      async sign() {
        return '0x' as const;
      },
      async signMessage() {
        return '0x' as const;
      },
    };

    switch (type) {
      case BridgeType.CCTP:
      case BridgeType.ICTT_ERC20_ERC20:
      case BridgeType.AVALANCHE_EVM:
        return {
          type,
          signer: dummySigner,
        };

      case BridgeType.LOMBARD_BTC_TO_BTCB:
      case BridgeType.LOMBARD_BTCB_TO_BTC:
        return {
          type,
          evmSigner: dummySigner,
          btcSigner: dummySigner,
          bitcoinFunctions: bitcoinProvider,
        };

      default:
        throw new Error(`Unsupported bridge type: ${type}`);
    }
  }

  async #recreateService() {
    const environment = this.networkService.isMainnet()
      ? Environment.PROD
      : Environment.TEST;

    try {
      const bitcoinProvider = await this.networkService.getBitcoinProvider();

      this.#core = createUnifiedBridgeService({
        environment,
        enabledBridgeServices: await getEnabledBridgeServices(
          environment,
          this.#getBridgeInitializers(bitcoinProvider),
        ),
      });
      this.#failedInitAttempts = 0;
      this.#trackPendingTransfers();
    } catch (err: any) {
      // If it failed, it's most likely a network issue.
      // Wait a bit and try again.
      this.#failedInitAttempts += 1;

      const delay = getExponentialBackoffDelay({
        attempt: this.#failedInitAttempts,
        startsAfter: 1,
      });

      Monitoring.sentryCaptureException(
        err,
        Monitoring.SentryExceptionTypes.UNIFIED_BRIDGE,
      );
      console.log(
        `Initialization of UnifiedBridgeService failed, attempt #${
          this.#failedInitAttempts
        }. Retry in ${delay / 1000}s`,
      );

      await wait(delay);

      // Do not attempt again if it succeded in the meantime
      // (e.g. user switched developer mode or feature flags updated)
      if (this.#failedInitAttempts > 0) {
        this.#recreateService();
      }
    }
  }

  analyzeTx(txInfo: AnalyzeTxParams): AnalyzeTxResult {
    if (!this.#core) {
      return {
        isBridgeTx: false,
      };
    }

    return this.#core.analyzeTx(txInfo);
  }

  trackTransfer(bridgeTransfer: BridgeTransfer) {
    if (!this.#core) {
      // Just log that this happened. This is edge-casey, but technically possible.
      Monitoring.sentryCaptureException(
        new Error(
          `UnifiedBridge - tracking attempted with no service insantiated.`,
        ),
        Monitoring.SentryExceptionTypes.UNIFIED_BRIDGE,
      );
      return;
    }

    const { result } = this.#core.trackTransfer({
      bridgeTransfer,
      updateListener: async (transfer) => {
        await this.updatePendingTransfer(transfer);
      },
    });

    result.then((completedTransfer) =>
      this.updatePendingTransfer(completedTransfer),
    );
  }

  async removeTrackedTransfer(txHash: string) {
    delete this.#state.pendingTransfers[txHash];

    this.#saveState({ ...this.#state });
  }

  async updatePendingTransfer(transfer: BridgeTransfer) {
    if (transfer.errorCode) {
      Monitoring.sentryCaptureException(
        new Error(`Bridge unsucessful. Error code: ${transfer.errorCode}`),
        Monitoring.SentryExceptionTypes.UNIFIED_BRIDGE,
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
        newState,
      );
    } catch {
      // May be called before extension is unlocked. Ignore.
    }
  }

  addListener(eventName: string, callback) {
    this.#eventEmitter.addListener(eventName, callback);
  }
}
