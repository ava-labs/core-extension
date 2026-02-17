import {
  Environment,
  createTransferManager,
  TransferManager,
  SourcePendingTransfer,
  FailedTransfer,
} from '@avalabs/unified-asset-transfer';
import { TransferTrackingService } from './TransferTrackingService';
import { FeatureGates, TrackedTransfers } from '@core/types';
import { wait } from '@avalabs/core-utils-sdk';
import { noop } from '@core/common';

jest.mock('@avalabs/unified-asset-transfer');
jest.mock('@avalabs/core-utils-sdk');
jest.mock('@core/common', () => ({
  ...jest.requireActual('@core/common'),
  Monitoring: {
    sentryCaptureException: jest.fn(),
    SentryExceptionTypes: {
      UNIFIED_TRANSFER: 'unifiedTransfer',
    },
  },
}));

describe('src/background/services/unifiedBridge/UnifiedBridgeService', () => {
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

  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(console, 'log').mockImplementation(noop);

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

    new TransferTrackingService(networkService, storageService, flagsService);

    await new Promise(process.nextTick); // Await getEnabledBridgeServices() call

    expect(createTransferManager).toHaveBeenCalledWith(
      expect.objectContaining({
        environment: Environment.PROD,
      }),
    );

    networkService.isMainnet.mockReturnValue(false);

    new TransferTrackingService(networkService, storageService, flagsService);
    await new Promise(process.nextTick); // Await getEnabledBridgeServices() call

    expect(createTransferManager).toHaveBeenCalledWith(
      expect.objectContaining({
        environment: Environment.TEST,
      }),
    );
  });

  it('recreates the core instance on testnet mode switch', async () => {
    new TransferTrackingService(networkService, storageService, flagsService);
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
    new TransferTrackingService(networkService, storageService, flagsService);

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
    storageService.load.mockResolvedValue({
      trackedTransfers: {
        '1234': {
          id: '1234',
          status: 'source-pending',
        } as SourcePendingTransfer,
        '2345': { id: '2345', status: 'failed' } as FailedTransfer,
      } as TrackedTransfers,
    });

    const transferTrackingService = new TransferTrackingService(
      networkService,
      storageService,
      flagsService,
    );

    await new Promise(process.nextTick); // Await promises on the way
    await transferTrackingService.onStorageReady();

    expect(trackTransfer).toHaveBeenCalledTimes(1);
    expect(trackTransfer).toHaveBeenCalledWith(
      expect.objectContaining({
        transfer: { id: '1234', status: 'source-pending' },
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

      new TransferTrackingService(networkService, storageService, flagsService);
      await jest.runAllTimersAsync();
      await jest.runAllTicks();

      expect(createTransferManager).toHaveBeenCalledTimes(4);
      expect(wait).toHaveBeenNthCalledWith(1, 2000);
      expect(wait).toHaveBeenNthCalledWith(2, 4000);
      expect(wait).toHaveBeenNthCalledWith(3, 8000);
      expect(createTransferManager).toHaveBeenCalled();
    });
  });
});
