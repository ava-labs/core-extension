import {
  Environment,
  createTransferManager,
  Transfer,
  TransferManager,
  ServiceInitializer,
  CompletedTransfer,
  RefundedTransfer,
  FailedTransfer,
} from '@avalabs/fusion-sdk';
import { wait } from '@avalabs/core-utils-sdk';
import { BitcoinProvider } from '@avalabs/core-wallets-sdk';
import EventEmitter from 'events';
import { singleton } from 'tsyringe';

import {
  FeatureFlagEvents,
  FeatureFlags,
  FeatureGates,
  isCompletedTransfer,
  isConcludedTransfer,
  isCrossChainTransfer,
  isFailedTransfer,
  isRefundedTransfer,
  isTransferInProgress,
  TrackedTransfers,
  UnifiedTransferSigners,
} from '@core/types';
import {
  getExponentialBackoffDelay,
  hasAtLeastOneElement,
  Monitoring,
  getServiceInitializer,
  getEnabledTransferServices,
  getTransferTxHash,
} from '@core/common';

import { NetworkService } from '../network/NetworkService';
import { StorageService } from '../storage/StorageService';
import { OnStorageReady } from '../../runtime/lifecycleCallbacks';
import { FeatureFlagService } from '../featureFlags/FeatureFlagService';
import {
  TRANSFER_TRACKING_DEFAULT_STATE,
  TRANSFER_TRACKING_STATE_STORAGE_KEY,
  TransferTrackingServiceEvents,
  TransferTrackingState,
  TransferTrackingStorageState,
  UNIFIED_TRANSFER_TRACKED_FLAGS,
} from './types';
import { AnalyticsServicePosthog } from '../analytics/AnalyticsServicePosthog';

@singleton()
export class TransferTrackingService implements OnStorageReady {
  #manager?: TransferManager;
  #eventEmitter = new EventEmitter();
  #state = TRANSFER_TRACKING_DEFAULT_STATE;
  #failedInitAttempts = 0;
  #recreationPromise?: Promise<void>;
  #pendingRecreation = false;

  // We'll re-create the #manager instance when one of these feature flags is toggled.
  #flagStates: Partial<FeatureFlags> = {};

  get state() {
    return this.#state;
  }

  constructor(
    private networkService: NetworkService,
    private storageService: StorageService,
    private featureFlagService: FeatureFlagService,
    private posthogAnalyticsService: AnalyticsServicePosthog,
  ) {
    this.#flagStates = this.#getTrackedFlags(
      this.featureFlagService.featureFlags,
    );
    this.recreateManager();

    // When testnet mode is toggled, we need to recreate the instance.
    this.networkService.developerModeChanged.add(() => {
      this.recreateManager();
    });

    // When some of the feature flags change, we need to recreate the instance.
    // Some of the bridge types may have gotten disabled via a feature flag.
    this.featureFlagService.addListener(
      FeatureFlagEvents.FEATURE_FLAG_UPDATED,
      (flags) => {
        const newFlags = this.#getTrackedFlags(flags);

        if (JSON.stringify(newFlags) !== JSON.stringify(this.#flagStates)) {
          this.#flagStates = newFlags;
          this.recreateManager();
        }
      },
    );
  }

  #getTrackedFlags(flags: FeatureFlags): Partial<FeatureFlags> {
    return Object.fromEntries(
      Object.entries(flags).filter(([flag]) =>
        UNIFIED_TRANSFER_TRACKED_FLAGS.includes(flag as FeatureGates),
      ),
    );
  }

  async onStorageReady() {
    const state =
      (await this.storageService.load<TransferTrackingState>(
        TRANSFER_TRACKING_STATE_STORAGE_KEY,
      )) ?? TRANSFER_TRACKING_DEFAULT_STATE;

    this.#saveState({
      trackedTransfers: state.trackedTransfers,
    });
    this.#trackPendingTransfers();
  }

  #trackPendingTransfers() {
    Object.values(this.#state.trackedTransfers)
      .filter(({ transfer }) => isTransferInProgress(transfer))
      .forEach(({ transfer }) => {
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

  #getServiceInitializers(
    bitcoinProvider: BitcoinProvider,
  ): ServiceInitializer[] {
    // This backend service is only used for transaction tracking purposes,
    // therefore we don't need to provide true signing capabilities.
    const sign = () => {
      throw new Error('Signer method called from tracking service.');
    };
    const dummySigner = {
      sign,
      signMessage: sign,
      signAndSend: sign,
    };

    const signers: UnifiedTransferSigners = {
      evm: dummySigner,
      btc: dummySigner,
      svm: dummySigner,
    };

    const enabledServices = getEnabledTransferServices(this.#flagStates);

    return enabledServices.map((type) =>
      getServiceInitializer(type, bitcoinProvider, signers),
    );
  }

  async recreateManager() {
    // If a recreation is currently in progress, wait for it to complete
    if (this.#recreationPromise) {
      this.#pendingRecreation = true;
      await this.#recreationPromise;
    }

    // If a pending recreation is needed and no one else started it yet, do it now
    if (this.#pendingRecreation && !this.#recreationPromise) {
      this.#pendingRecreation = false;
      this.#recreationPromise = this.#doRecreateManager();
      try {
        await this.#recreationPromise;
      } finally {
        this.#recreationPromise = undefined;
      }
      return;
    }

    // If there's no recreation in progress, start one
    if (!this.#recreationPromise) {
      this.#recreationPromise = this.#doRecreateManager();
      try {
        await this.#recreationPromise;
      } finally {
        this.#recreationPromise = undefined;
      }
    }
  }

  async #doRecreateManager() {
    const environment = this.networkService.isMainnet()
      ? Environment.PROD
      : Environment.TEST;

    try {
      const bitcoinProvider = await this.networkService.getBitcoinProvider();

      const serviceInitializers =
        await this.#getServiceInitializers(bitcoinProvider);

      if (!hasAtLeastOneElement(serviceInitializers)) {
        this.#manager = undefined;
        this.#failedInitAttempts = 0;
        return;
      }

      this.#manager = await createTransferManager({
        environment,
        serviceInitializers,
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
        Monitoring.SentryExceptionTypes.UNIFIED_TRANSFER,
      );
      console.log(
        `Initialization of UnifiedBridgeService failed, attempt #${
          this.#failedInitAttempts
        }. Retry in ${delay / 1000}s`,
      );

      await wait(delay);

      // Do not attempt again if it succedeed in the meantime
      // (e.g. user switched developer mode or feature flags updated)
      if (this.#failedInitAttempts > 0) {
        this.recreateManager();
      }
    }
  }

  async trackTransfer(transfer: Transfer) {
    if (!this.#manager) {
      // Just log that this happened. This is edge-casey, but technically possible.
      Monitoring.sentryCaptureException(
        new Error(
          `UnifiedTransfers - tracking attempted with no manager instantiated.`,
        ),
        Monitoring.SentryExceptionTypes.UNIFIED_TRANSFER,
      );
      return;
    }

    if (isConcludedTransfer(transfer)) {
      return;
    }

    const { result, cancel } = this.#manager.trackTransfer({
      transfer,
      updateListener: async (updatedTransfer) => {
        await this.updatePendingTransfer(updatedTransfer, cancel);
      },
    });

    result
      .then((_transfer) => {
        this.updatePendingTransfer(_transfer);

        if (isConcludedTransfer(_transfer)) {
          this.#captureAnalytics(_transfer);
        }
      })
      .catch((err) => {
        Monitoring.sentryCaptureException(
          err,
          Monitoring.SentryExceptionTypes.UNIFIED_TRANSFER,
        );
        console.error('[trackTransfer] Error tracking transfer', err);
      });
  }

  async removeTrackedTransfer(transferId: string) {
    delete this.#state.trackedTransfers[transferId];

    this.#saveState({ ...this.#state });
  }

  async markTransferAsRead(transferId: string) {
    const transferMeta = this.#state.trackedTransfers[transferId];

    // Only allow marking transfers as read if they have concluded (completed, failed, refunded).
    if (!transferMeta || !isConcludedTransfer(transferMeta.transfer)) {
      return;
    }

    transferMeta.isRead = true;

    await this.#saveState({ ...this.#state });
  }

  async clearHistoricalTransfers() {
    // Only clear concluded transfers.
    const pendingTransfers = Object.values(this.#state.trackedTransfers).filter(
      ({ transfer }) => !isConcludedTransfer(transfer),
    );

    await this.#saveState({
      trackedTransfers: Object.fromEntries(
        pendingTransfers.map((transferMeta) => [
          transferMeta.transfer.id,
          transferMeta,
        ]),
      ),
    });
  }

  #captureAnalytics(
    transfer: CompletedTransfer | RefundedTransfer | FailedTransfer,
  ) {
    const properties = {
      sourceAddress: transfer.fromAddress,
      targetAddress: transfer.toAddress,
      sourceChainId: transfer.sourceChain.chainId,
      targetChainId: transfer.targetChain.chainId,
      sourceTxHash: getTransferTxHash('source', transfer),
      targetTxHash: getTransferTxHash('target', transfer),
      ...(isFailedTransfer(transfer) && {
        errorCode: transfer.errorCode,
        errorReason: transfer.errorReason,
      }),
      ...(isRefundedTransfer(transfer) && {
        refundTxHash: getTransferTxHash('refund', transfer),
      }),
    };
    const windowId = crypto.randomUUID();
    const eventName = isCompletedTransfer(transfer)
      ? 'SwapSuccessful'
      : isFailedTransfer(transfer)
        ? 'SwapFailed'
        : 'SwapRefunded';

    this.posthogAnalyticsService.captureEncryptedEvent({
      name: eventName,
      windowId,
      properties,
    });
  }

  async updatePendingTransfer(transfer: Transfer, untrack?: () => void) {
    if (isFailedTransfer(transfer)) {
      Monitoring.sentryCaptureException(
        new Error(
          `Transfer failed. Error code: ${transfer.errorCode}. Error reason: ${transfer.errorReason}`,
        ),
        Monitoring.SentryExceptionTypes.UNIFIED_TRANSFER,
      );
    }

    console.log('DEBUG', transfer);
    // Do not persist single-chain transfers, as they're rather quick.
    if (!isCrossChainTransfer(transfer)) {
      return;
    }

    this.#saveState({
      trackedTransfers: {
        ...this.#state.trackedTransfers,
        [transfer.id]: {
          transfer,
          isRead: false,
          untrack,
        },
      },
    });
  }

  async #saveState(newState: TransferTrackingState) {
    this.#state = newState;
    this.#eventEmitter.emit(
      'tracked-transfers-updated',
      newState.trackedTransfers,
    );

    // Do not store functions in chrome.storage
    const purifiedState: TransferTrackingStorageState = {
      trackedTransfers: Object.fromEntries(
        Object.entries(newState.trackedTransfers).map(
          ([id, { isRead, transfer }]) => [id, { isRead, transfer }],
        ),
      ),
    };

    try {
      await this.storageService.save<TransferTrackingStorageState>(
        TRANSFER_TRACKING_STATE_STORAGE_KEY,
        purifiedState,
      );
    } catch {
      // May be called before extension is unlocked. Ignore.
    }
  }

  addListener(
    eventName: 'tracked-transfers-updated',
    callback: (trackedTransfers: TrackedTransfers) => void,
  );
  addListener(eventName: TransferTrackingServiceEvents, callback) {
    this.#eventEmitter.addListener(eventName, callback);
  }
}
