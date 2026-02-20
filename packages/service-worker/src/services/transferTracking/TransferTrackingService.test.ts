import { TransferTrackingService } from './TransferTrackingService';
import { NetworkService } from '../network/NetworkService';
import { StorageService } from '../storage/StorageService';
import { FeatureFlagService } from '../featureFlags/FeatureFlagService';
import { Environment, TransferManager } from '@avalabs/unified-asset-transfer';
import { BitcoinProvider } from '@avalabs/core-wallets-sdk';

jest.mock('../network/NetworkService');
jest.mock('../storage/StorageService');
jest.mock('../featureFlags/FeatureFlagService');
jest.mock('@avalabs/unified-asset-transfer', () => ({
  ...jest.requireActual('@avalabs/unified-asset-transfer'),
  createTransferManager: jest.fn(),
}));
jest.mock('@avalabs/core-utils-sdk', () => ({
  ...jest.requireActual('@avalabs/core-utils-sdk'),
  wait: jest.fn(() => Promise.resolve()),
}));
jest.mock('@core/common', () => ({
  ...jest.requireActual('@core/common'),
  Monitoring: {
    sentryCaptureException: jest.fn(),
    SentryExceptionTypes: {
      UNIFIED_TRANSFER: 'unified-transfer',
    },
  },
  getEnabledTransferServicesRaw: jest.fn(() => ['test-service']),
  getServiceInitializer: jest.fn(() => ({ type: 'test' })),
  hasAtLeastOneElement: jest.fn((arr) => arr && arr.length > 0),
  getExponentialBackoffDelay: jest.fn(() => 100),
}));

const { createTransferManager } = jest.requireMock(
  '@avalabs/unified-asset-transfer',
);

describe('TransferTrackingService - recreateManager', () => {
  let service: TransferTrackingService;
  let mockNetworkService: jest.Mocked<NetworkService>;
  let mockStorageService: jest.Mocked<StorageService>;
  let mockFeatureFlagService: jest.Mocked<FeatureFlagService>;
  let mockBitcoinProvider: jest.Mocked<BitcoinProvider>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockNetworkService = {
      isMainnet: jest.fn(() => true),
      getBitcoinProvider: jest.fn(),
      developerModeChanged: {
        add: jest.fn(),
      },
    } as any;

    mockStorageService = {
      load: jest.fn(),
      save: jest.fn(),
    } as any;

    mockFeatureFlagService = {
      featureFlags: {},
      addListener: jest.fn(),
    } as any;

    mockBitcoinProvider = {} as any;

    mockNetworkService.getBitcoinProvider.mockResolvedValue(
      mockBitcoinProvider,
    );
    createTransferManager.mockResolvedValue({} as TransferManager);
  });

  describe('concurrent call handling', () => {
    it('should handle a single call correctly', async () => {
      // Clear the mock from constructor call
      createTransferManager.mockClear();

      service = new TransferTrackingService(
        mockNetworkService,
        mockStorageService,
        mockFeatureFlagService,
      );

      // Wait for constructor's call to complete
      await new Promise((resolve) => setTimeout(resolve, 50));

      createTransferManager.mockClear();

      await service.recreateManager();

      expect(createTransferManager).toHaveBeenCalledTimes(1);
    });

    it('should serialize concurrent calls - first call completes before second starts', async () => {
      createTransferManager.mockClear();

      service = new TransferTrackingService(
        mockNetworkService,
        mockStorageService,
        mockFeatureFlagService,
      );

      // Wait for constructor's call to complete
      await new Promise((resolve) => setTimeout(resolve, 50));

      createTransferManager.mockClear();

      const call1Promise = service.recreateManager();
      const call2Promise = service.recreateManager();

      await Promise.all([call1Promise, call2Promise]);

      // 2 explicit calls = 2 total
      expect(createTransferManager).toHaveBeenCalledTimes(2);
    });

    it('should coalesce 3 concurrent calls into 2 recreations', async () => {
      createTransferManager.mockClear();

      service = new TransferTrackingService(
        mockNetworkService,
        mockStorageService,
        mockFeatureFlagService,
      );

      // Wait for constructor's call to complete
      await new Promise((resolve) => setTimeout(resolve, 50));

      createTransferManager.mockClear();

      const call1Promise = service.recreateManager();
      const call2Promise = service.recreateManager();
      const call3Promise = service.recreateManager();

      await Promise.all([call1Promise, call2Promise, call3Promise]);

      // First explicit call (1) + coalesced second call (1) = 2 total
      expect(createTransferManager).toHaveBeenCalledTimes(2);
    });

    it('should handle rapid sequential calls correctly', async () => {
      createTransferManager.mockClear();

      service = new TransferTrackingService(
        mockNetworkService,
        mockStorageService,
        mockFeatureFlagService,
      );

      // Wait for constructor's call to complete
      await new Promise((resolve) => setTimeout(resolve, 50));

      createTransferManager.mockClear();

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

      createTransferManager.mockClear();
      createTransferManager.mockReturnValueOnce(recreationPromise);

      service = new TransferTrackingService(
        mockNetworkService,
        mockStorageService,
        mockFeatureFlagService,
      );

      // Wait for constructor to start
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Constructor is now waiting on the first promise
      createTransferManager.mockResolvedValue({} as TransferManager);

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

  describe('environment handling', () => {
    it('should use PROD environment when mainnet is true', async () => {
      mockNetworkService.isMainnet.mockReturnValue(true);
      createTransferManager.mockClear();

      service = new TransferTrackingService(
        mockNetworkService,
        mockStorageService,
        mockFeatureFlagService,
      );

      // Wait for constructor's call to complete
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(createTransferManager).toHaveBeenCalledWith(
        expect.objectContaining({
          environment: Environment.PROD,
        }),
      );
    });

    it('should use TEST environment when mainnet is false', async () => {
      mockNetworkService.isMainnet.mockReturnValue(false);
      createTransferManager.mockClear();

      service = new TransferTrackingService(
        mockNetworkService,
        mockStorageService,
        mockFeatureFlagService,
      );

      // Wait for constructor's call to complete
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(createTransferManager).toHaveBeenCalledWith(
        expect.objectContaining({
          environment: Environment.TEST,
        }),
      );
    });
  });

  describe('error handling', () => {
    it('should handle errors during recreation gracefully', async () => {
      const error = new Error('Recreation failed');
      createTransferManager
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce({} as TransferManager);

      service = new TransferTrackingService(
        mockNetworkService,
        mockStorageService,
        mockFeatureFlagService,
      );

      // Wait for error and retry to complete
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Should have attempted retry after failure
      expect(createTransferManager).toHaveBeenCalledTimes(2); // Initial + retry
    });

    it('should not break pending recreation on error', async () => {
      const error = new Error('Recreation failed');
      createTransferManager
        .mockRejectedValueOnce(error)
        .mockResolvedValue({} as TransferManager);

      service = new TransferTrackingService(
        mockNetworkService,
        mockStorageService,
        mockFeatureFlagService,
      );

      // Wait for constructor's failed call and retry
      await new Promise((resolve) => setTimeout(resolve, 200));

      createTransferManager.mockClear();

      const call1Promise = service.recreateManager();
      const call2Promise = service.recreateManager();

      await Promise.all([call1Promise, call2Promise]);

      // Should handle concurrent calls even after error
      expect(createTransferManager).toHaveBeenCalled();
    });
  });

  describe('promise state management', () => {
    it('should clear recreation promise after completion', async () => {
      createTransferManager.mockClear();

      service = new TransferTrackingService(
        mockNetworkService,
        mockStorageService,
        mockFeatureFlagService,
      );

      // Wait for constructor's call to complete
      await new Promise((resolve) => setTimeout(resolve, 50));

      createTransferManager.mockClear();

      await service.recreateManager();

      // The promise should be cleared, allowing subsequent calls to proceed immediately
      const callCountBefore = createTransferManager.mock.calls.length;
      await service.recreateManager();
      const callCountAfter = createTransferManager.mock.calls.length;

      expect(callCountAfter).toBe(callCountBefore + 1);
    });

    it('should reset pending flag after starting pending recreation', async () => {
      createTransferManager.mockClear();

      service = new TransferTrackingService(
        mockNetworkService,
        mockStorageService,
        mockFeatureFlagService,
      );

      // Wait for constructor's call to complete
      await new Promise((resolve) => setTimeout(resolve, 50));

      createTransferManager.mockClear();

      // Start multiple concurrent calls
      const promises = [
        service.recreateManager(),
        service.recreateManager(),
        service.recreateManager(),
      ];

      await Promise.all(promises);

      createTransferManager.mockClear();

      // After all complete, pending flag should be false
      // Verify by making another call that should execute immediately
      await service.recreateManager();

      expect(createTransferManager).toHaveBeenCalledTimes(1);
    });
  });

  describe('edge cases', () => {
    it('should handle calls after a completed recreation', async () => {
      createTransferManager.mockClear();

      service = new TransferTrackingService(
        mockNetworkService,
        mockStorageService,
        mockFeatureFlagService,
      );

      // Wait for constructor's call to complete
      await new Promise((resolve) => setTimeout(resolve, 50));

      createTransferManager.mockClear();

      await service.recreateManager();
      const callCountAfterFirst = createTransferManager.mock.calls.length;

      await service.recreateManager();
      const callCountAfterSecond = createTransferManager.mock.calls.length;

      expect(callCountAfterSecond).toBe(callCountAfterFirst + 1);
    });

    it('should handle a mix of concurrent and sequential calls', async () => {
      createTransferManager.mockClear();

      service = new TransferTrackingService(
        mockNetworkService,
        mockStorageService,
        mockFeatureFlagService,
      );

      // Wait for constructor's call to complete
      await new Promise((resolve) => setTimeout(resolve, 50));

      createTransferManager.mockClear();

      // Concurrent batch 1
      await Promise.all([service.recreateManager(), service.recreateManager()]);

      const callCountAfterBatch1 = createTransferManager.mock.calls.length;

      // Sequential call
      await service.recreateManager();

      const callCountAfterSequential = createTransferManager.mock.calls.length;

      // Concurrent batch 2
      await Promise.all([service.recreateManager(), service.recreateManager()]);

      const callCountAfterBatch2 = createTransferManager.mock.calls.length;

      expect(callCountAfterSequential).toBeGreaterThan(callCountAfterBatch1);
      expect(callCountAfterBatch2).toBeGreaterThan(callCountAfterSequential);
    });
  });
});
