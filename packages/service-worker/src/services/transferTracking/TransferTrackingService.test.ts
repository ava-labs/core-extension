import {
  Environment,
  createTransferManager,
  TransferManager,
  SourcePendingTransfer,
  FailedTransfer,
  CompletedTransfer,
  RefundedTransfer,
  Transfer,
  TokenType,
  ErrorCode,
} from '@avalabs/fusion-sdk';
import { TransferTrackingService } from './TransferTrackingService';
import { FeatureGates, TrackedTransfers } from '@core/types';
import { wait } from '@avalabs/core-utils-sdk';
import { noop, getTransferTxHash } from '@core/common';

jest.mock('@avalabs/fusion-sdk');
jest.mock('@avalabs/core-utils-sdk');
jest.mock('@core/common', () => ({
  ...jest.requireActual('@core/common'),
  Monitoring: {
    sentryCaptureException: jest.fn(),
    SentryExceptionTypes: {
      UNIFIED_TRANSFER: 'unifiedTransfer',
    },
  },
  getTransferTxHash: jest.fn(),
}));

describe('src/services/transferTracking/TransferTrackingService', () => {
  let manager: TransferManager;

  const trackTransfer = jest.fn();

  const networkService = {
    developerModeChanged: {
      add: jest.fn(),
    },
    isMainnet: jest.fn(),
    getNetwork: jest.fn(),
    getProviderForNetwork: jest.fn(),
    getBitcoinProvider: jest.fn(),
    sendTransaction: jest.fn(),
  } as any;

  const storageService = {
    load: jest.fn(),
    save: jest.fn(),
  } as any;

  const flagsService = {
    featureFlags: {
      [FeatureGates.FUSION_FEATURE]: true,
      [FeatureGates.FUSION_MARKR]: true,
      [FeatureGates.FUSION_AVALANCHE_EVM]: true,
      [FeatureGates.FUSION_LOMBARD_BTC_TO_AVA]: true,
      [FeatureGates.FUSION_LOMBARD_AVA_TO_BTC]: true,
    },
    addListener: jest.fn(),
  } as any;

  const posthogAnalyticsService = {
    captureEncryptedEvent: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(console, 'log').mockImplementation(noop);

    trackTransfer.mockReturnValue({
      result: Promise.resolve({
        sourceChain: { chainId: 'eip155:43114' },
        targetChain: { chainId: 'eip155:43114' },
      } as unknown as Transfer),
      cancel: jest.fn(),
    });

    manager = {
      trackTransfer,
    } as any;

    jest.mocked(createTransferManager).mockResolvedValue(manager);

    networkService.isMainnet.mockReturnValue(false);
    networkService.getNetwork.mockImplementation(async (chainId) => ({
      chainId,
    }));
    networkService.getBitcoinProvider.mockResolvedValue({} as any);
  });

  it('creates manager instance with proper environment', async () => {
    networkService.isMainnet.mockReturnValue(true);

    new TransferTrackingService(
      networkService,
      storageService,
      flagsService,
      posthogAnalyticsService,
    );

    await new Promise(process.nextTick); // Await getEnabledBridgeServices() call

    expect(createTransferManager).toHaveBeenCalledWith(
      expect.objectContaining({
        environment: Environment.PROD,
      }),
    );

    networkService.isMainnet.mockReturnValue(false);

    new TransferTrackingService(
      networkService,
      storageService,
      flagsService,
      posthogAnalyticsService,
    );
    await new Promise(process.nextTick); // Await getEnabledBridgeServices() call

    expect(createTransferManager).toHaveBeenCalledWith(
      expect.objectContaining({
        environment: Environment.TEST,
      }),
    );
  });

  it('recreates the core instance on testnet mode switch', async () => {
    new TransferTrackingService(
      networkService,
      storageService,
      flagsService,
      posthogAnalyticsService,
    );
    const mockTestnetModeChange = (
      networkService.developerModeChanged.add as jest.Mock
    ).mock.lastCall[0];

    await new Promise(process.nextTick); // Await promises on the way
    expect(createTransferManager).toHaveBeenCalledTimes(1);

    mockTestnetModeChange();

    await new Promise(process.nextTick); // Await promises on the way
    expect(createTransferManager).toHaveBeenCalledTimes(2);
  });

  it('recreates the manager instance when certain feature flags are toggled', async () => {
    new TransferTrackingService(
      networkService,
      storageService,
      flagsService,
      posthogAnalyticsService,
    );

    const mockFeatureFlagChanges = (flagsService.addListener as jest.Mock).mock
      .lastCall[1];

    await new Promise(process.nextTick); // Await getEnabledBridgeServices() call
    expect(createTransferManager).toHaveBeenCalledTimes(1);

    // Toggle an irrelevant flag off (key order must match initial featureFlags)
    mockFeatureFlagChanges({
      [FeatureGates.FUSION_FEATURE]: true,
      [FeatureGates.FUSION_MARKR]: true,
      [FeatureGates.FUSION_AVALANCHE_EVM]: true,
      [FeatureGates.FUSION_LOMBARD_BTC_TO_AVA]: true,
      [FeatureGates.FUSION_LOMBARD_AVA_TO_BTC]: true,
      [FeatureGates.CORE_ASSISTANT]: false,
    });

    await new Promise(process.nextTick); // Await getEnabledTransferServices() call
    expect(createTransferManager).toHaveBeenCalledTimes(1);

    // Toggle a relevant flag off (key order must match initial featureFlags)
    mockFeatureFlagChanges({
      [FeatureGates.FUSION_FEATURE]: true,
      [FeatureGates.FUSION_MARKR]: false,
      [FeatureGates.FUSION_AVALANCHE_EVM]: true,
      [FeatureGates.FUSION_LOMBARD_BTC_TO_AVA]: true,
      [FeatureGates.FUSION_LOMBARD_AVA_TO_BTC]: true,
    });

    await new Promise(process.nextTick); // Await getEnabledTransferServices() call
    expect(createTransferManager).toHaveBeenCalledTimes(2);
  });

  it('starts tracking incomplete transfers after instantiation', async () => {
    const pendingTransfer = {
      id: '1234',
      status: 'source-pending',
      sourceChain: {
        chainId: 'eip155:43114',
      },
      targetChain: {
        chainId: 'eip155:43114',
      },
    };
    storageService.load.mockResolvedValue({
      trackedTransfers: {
        '1234': {
          transfer: pendingTransfer as unknown as SourcePendingTransfer,
          isRead: false,
        },
        '2345': {
          transfer: {
            id: '2345',
            status: 'failed',
            sourceChain: { chainId: 'eip155:43114' },
            targetChain: {
              chainId: 'eip155:43114',
            },
          } as unknown as FailedTransfer,
          isRead: false,
        },
      } as TrackedTransfers,
    });

    const transferTrackingService = new TransferTrackingService(
      networkService,
      storageService,
      flagsService,
      posthogAnalyticsService,
    );

    await new Promise(process.nextTick); // Await promises on the way
    await transferTrackingService.onStorageReady();

    expect(trackTransfer).toHaveBeenCalledTimes(1);
    expect(trackTransfer).toHaveBeenCalledWith(
      expect.objectContaining({
        transfer: pendingTransfer,
      }),
    );
  });

  describe('when building bridge services fails', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest
        .mocked(createTransferManager)
        .mockRejectedValueOnce(new Error('Failed to fetch'))
        .mockRejectedValueOnce(new Error('Failed to fetch'))
        .mockRejectedValueOnce(new Error('Failed to fetch'))
        .mockResolvedValueOnce(manager);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('retries using an exponential backoff delay', async () => {
      networkService.isMainnet.mockReturnValue(true);
      storageService.load.mockResolvedValue({
        trackedTransfers: {},
      });

      new TransferTrackingService(
        networkService,
        storageService,
        flagsService,
        posthogAnalyticsService,
      );
      await jest.runAllTimersAsync();
      await jest.runAllTicks();

      expect(createTransferManager).toHaveBeenCalledTimes(4);
      expect(wait).toHaveBeenNthCalledWith(1, 2000);
      expect(wait).toHaveBeenNthCalledWith(2, 4000);
      expect(wait).toHaveBeenNthCalledWith(3, 8000);
      expect(createTransferManager).toHaveBeenCalled();
    });
  });

  describe('concurrent manager recreation handling', () => {
    it('should handle a single call correctly', async () => {
      // Clear the mock from constructor call
      jest.mocked(createTransferManager).mockClear();

      const service = new TransferTrackingService(
        networkService,
        storageService,
        flagsService,
        posthogAnalyticsService,
      );

      // Wait for constructor's call to complete
      await new Promise(process.nextTick);

      jest.mocked(createTransferManager).mockClear();

      await service.recreateManager();

      expect(createTransferManager).toHaveBeenCalledTimes(1);
    });

    it('should serialize concurrent calls - first call completes before second starts', async () => {
      jest.mocked(createTransferManager).mockClear();

      const service = new TransferTrackingService(
        networkService,
        storageService,
        flagsService,
        posthogAnalyticsService,
      );

      // Wait for constructor's call to complete
      await new Promise(process.nextTick);

      jest.mocked(createTransferManager).mockClear();

      const call1Promise = service.recreateManager();
      const call2Promise = service.recreateManager();

      // 2 explicit calls = 2 total
      await call1Promise;
      expect(createTransferManager).toHaveBeenCalledTimes(1);
      await call2Promise;
      expect(createTransferManager).toHaveBeenCalledTimes(2);
    });

    it('should coalesce 3 concurrent calls into 2 recreations', async () => {
      jest.mocked(createTransferManager).mockClear();

      const service = new TransferTrackingService(
        networkService,
        storageService,
        flagsService,
        posthogAnalyticsService,
      );

      // Wait for constructor's call to complete
      await new Promise(process.nextTick);

      jest.mocked(createTransferManager).mockClear();

      const call1Promise = service.recreateManager();
      const call2Promise = service.recreateManager();
      const call3Promise = service.recreateManager();

      await Promise.all([call1Promise, call2Promise, call3Promise]);

      // First explicit call (1) + coalesced second call (1) = 2 total
      expect(createTransferManager).toHaveBeenCalledTimes(2);
    });

    it('should handle rapid sequential calls correctly', async () => {
      jest.mocked(createTransferManager).mockClear();

      const service = new TransferTrackingService(
        networkService,
        storageService,
        flagsService,
        posthogAnalyticsService,
      );

      // Wait for constructor's call to complete
      await new Promise(process.nextTick);

      jest.mocked(createTransferManager).mockClear();

      await service.recreateManager();
      await service.recreateManager();
      await service.recreateManager();

      // 3 sequential calls = 3 total
      expect(createTransferManager).toHaveBeenCalledTimes(3);
    });

    it('should handle concurrent calls during an in-progress recreation', async () => {
      let resolveRecreation: () => void;
      const recreationPromise = new Promise<TransferManager>((resolve) => {
        resolveRecreation = () => resolve({} as TransferManager);
      });

      jest.mocked(createTransferManager).mockClear();
      jest.mocked(createTransferManager).mockReturnValueOnce(recreationPromise);

      const service = new TransferTrackingService(
        networkService,
        storageService,
        flagsService,
        posthogAnalyticsService,
      );

      // Wait for constructor to start
      await new Promise(process.nextTick);

      // Constructor is now waiting on the first promise
      jest
        .mocked(createTransferManager)
        .mockResolvedValue({} as TransferManager);

      // Start concurrent calls while constructor's call is in progress
      const call2Promise = service.recreateManager();
      const call3Promise = service.recreateManager();

      // Resolve the first recreation
      resolveRecreation!();

      await Promise.all([call2Promise, call3Promise]);

      // Constructor's call + coalesced call = 2 total
      expect(createTransferManager).toHaveBeenCalledTimes(2);
    });
  });

  describe('analytics event capturing', () => {
    beforeEach(() => {
      jest
        .spyOn(crypto, 'randomUUID')
        .mockReturnValue('00000000-0000-0000-0000-000000000000');
    });

    const baseTransfer: Partial<Transfer> = {
      id: 'transfer-123',
      fromAddress: '0xFromAddress',
      toAddress: '0xToAddress',
      sourceChain: {
        chainId: 'eip155:43114',
        chainName: 'Avalanche',
        networkToken: {
          name: 'AVAX',
          symbol: 'AVAX',
          decimals: 18,
          type: TokenType.NATIVE,
        },
        rpcUrl: 'https://rpc',
      },
      targetChain: {
        chainId: 'eip155:43114',
        chainName: 'Avalanche',
        networkToken: {
          name: 'AVAX',
          symbol: 'AVAX',
          decimals: 18,
          type: TokenType.NATIVE,
        },
        rpcUrl: 'https://rpc',
      },
    };

    beforeEach(() => {
      jest.mocked(getTransferTxHash).mockImplementation((side) => {
        if (side === 'source') return '0xSourceTxHash';
        if (side === 'target') return '0xTargetTxHash';
        if (side === 'refund') return '0xRefundTxHash';
        return undefined;
      });
    });

    it('captures SwapSuccessful event when transfer completes', async () => {
      const completedTransfer = {
        ...baseTransfer,
        status: 'completed',
      } as CompletedTransfer;

      trackTransfer.mockReturnValue({
        result: Promise.resolve(completedTransfer),
        cancel: jest.fn(),
      });

      const service = new TransferTrackingService(
        networkService,
        storageService,
        flagsService,
        posthogAnalyticsService,
      );

      await new Promise(process.nextTick);

      await service.trackTransfer({
        ...baseTransfer,
        status: 'source-pending',
      } as SourcePendingTransfer);

      await new Promise(process.nextTick);

      expect(
        posthogAnalyticsService.captureEncryptedEvent,
      ).toHaveBeenCalledWith({
        name: 'SwapSuccessful',
        windowId: expect.any(String),
        properties: {
          sourceAddress: '0xFromAddress',
          targetAddress: '0xToAddress',
          sourceChainId: 'eip155:43114',
          targetChainId: 'eip155:43114',
          sourceTxHash: '0xSourceTxHash',
          targetTxHash: '0xTargetTxHash',
        },
      });
    });

    it('captures SwapFailed event with error details when transfer fails', async () => {
      const failedTransfer = {
        ...baseTransfer,
        status: 'failed',
        errorCode: ErrorCode.TIMEOUT,
        errorReason: 'Transfer timed out',
      } as FailedTransfer;

      trackTransfer.mockReturnValue({
        result: Promise.resolve(failedTransfer),
        cancel: jest.fn(),
      });

      const service = new TransferTrackingService(
        networkService,
        storageService,
        flagsService,
        posthogAnalyticsService,
      );

      await new Promise(process.nextTick);

      await service.trackTransfer({
        ...baseTransfer,
        status: 'source-pending',
      } as SourcePendingTransfer);

      await new Promise(process.nextTick);

      expect(
        posthogAnalyticsService.captureEncryptedEvent,
      ).toHaveBeenCalledWith({
        name: 'SwapFailed',
        windowId: expect.any(String),
        properties: {
          sourceAddress: '0xFromAddress',
          targetAddress: '0xToAddress',
          sourceChainId: 'eip155:43114',
          targetChainId: 'eip155:43114',
          sourceTxHash: '0xSourceTxHash',
          targetTxHash: '0xTargetTxHash',
          errorCode: ErrorCode.TIMEOUT,
          errorReason: 'Transfer timed out',
        },
      });
    });

    it('captures SwapRefunded event with refund tx hash when transfer is refunded', async () => {
      const refundedTransfer = {
        ...baseTransfer,
        status: 'refunded',
      } as RefundedTransfer;

      trackTransfer.mockReturnValue({
        result: Promise.resolve(refundedTransfer),
        cancel: jest.fn(),
      });

      const service = new TransferTrackingService(
        networkService,
        storageService,
        flagsService,
        posthogAnalyticsService,
      );

      await new Promise(process.nextTick);

      await service.trackTransfer({
        ...baseTransfer,
        status: 'source-pending',
      } as SourcePendingTransfer);

      await new Promise(process.nextTick);

      expect(
        posthogAnalyticsService.captureEncryptedEvent,
      ).toHaveBeenCalledWith({
        name: 'SwapRefunded',
        windowId: expect.any(String),
        properties: {
          sourceAddress: '0xFromAddress',
          targetAddress: '0xToAddress',
          sourceChainId: 'eip155:43114',
          targetChainId: 'eip155:43114',
          sourceTxHash: '0xSourceTxHash',
          targetTxHash: '0xTargetTxHash',
          refundTxHash: '0xRefundTxHash',
        },
      });
    });

    it('does not capture analytics for in-progress transfers', async () => {
      const inProgressTransfer = {
        ...baseTransfer,
        status: 'target-pending',
      } as Transfer;

      trackTransfer.mockReturnValue({
        result: Promise.resolve(inProgressTransfer),
        cancel: jest.fn(),
      });

      const service = new TransferTrackingService(
        networkService,
        storageService,
        flagsService,
        posthogAnalyticsService,
      );

      await new Promise(process.nextTick);

      await service.trackTransfer({
        ...baseTransfer,
        status: 'source-pending',
      } as SourcePendingTransfer);

      await new Promise(process.nextTick);

      expect(
        posthogAnalyticsService.captureEncryptedEvent,
      ).not.toHaveBeenCalled();
    });
  });
});
