import {
  BridgeService,
  BridgeType,
  Environment,
  createUnifiedBridgeService,
  getEnabledBridgeServices,
} from '@avalabs/bridge-unified';
import { UnifiedBridgeService } from './UnifiedBridgeService';
import { FeatureGates } from '@core/types';
import { wait } from '@avalabs/core-utils-sdk';
import { noop } from '@core/common';

jest.mock('@avalabs/bridge-unified');
jest.mock('@avalabs/core-utils-sdk');
jest.mock('@core/common', () => ({
  ...jest.requireActual('@core/common'),
  Monitoring: {
    sentryCaptureException: jest.fn(),
    SentryExceptionTypes: {
      UNIFIED_BRIDGE: 'unifiedBridge',
    },
  },
}));

describe('src/background/services/unifiedBridge/UnifiedBridgeService', () => {
  let core: ReturnType<typeof createUnifiedBridgeService>;

  const trackTransfer = jest.fn();
  const transferAsset = jest.fn();
  const getFees = jest.fn();
  const estimateGas = jest.fn();

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
      [FeatureGates.IMPORT_FIREBLOCKS]: true,
      [FeatureGates.UNIFIED_BRIDGE_CCTP]: true,
      [FeatureGates.UNIFIED_BRIDGE_ICTT]: true,
      [FeatureGates.UNIFIED_BRIDGE_AB_AVA_TO_BTC]: true,
      [FeatureGates.UNIFIED_BRIDGE_AB_BTC_TO_AVA]: true,
      [FeatureGates.UNIFIED_BRIDGE_AB_EVM]: true,
    },
    addListener: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(console, 'log').mockImplementation(noop);

    core = {
      bridges: new Map(),
      estimateGas,
      getFees,
      getAssets: jest.fn().mockResolvedValue({}),
      trackTransfer,
      transferAsset,
    } as any;

    jest.mocked(createUnifiedBridgeService).mockReturnValue(core);
    jest.mocked(getEnabledBridgeServices).mockResolvedValue({} as any);

    networkService.isMainnet.mockReturnValue(false);
    networkService.getNetwork.mockImplementation(async (chainId) => ({
      chainId,
    }));
    networkService.getBitcoinProvider.mockResolvedValue({} as any);
  });

  it('creates core instance with proper environment', async () => {
    networkService.isMainnet.mockReturnValue(true);

    new UnifiedBridgeService(networkService, storageService, flagsService);

    await new Promise(process.nextTick); // Await getEnabledBridgeServices() call

    expect(createUnifiedBridgeService).toHaveBeenCalledWith(
      expect.objectContaining({
        environment: Environment.PROD,
      }),
    );

    networkService.isMainnet.mockReturnValue(false);

    new UnifiedBridgeService(networkService, storageService, flagsService);
    await new Promise(process.nextTick); // Await getEnabledBridgeServices() call

    expect(createUnifiedBridgeService).toHaveBeenCalledWith(
      expect.objectContaining({
        environment: Environment.TEST,
      }),
    );
  });

  it('recreates the core instance on testnet mode switch', async () => {
    new UnifiedBridgeService(networkService, storageService, flagsService);
    const mockTestnetModeChange = (
      networkService.developerModeChanged.add as jest.Mock
    ).mock.lastCall[0];

    await new Promise(process.nextTick); // Await getEnabledBridgeServices() call
    expect(createUnifiedBridgeService).toHaveBeenCalledTimes(1);

    mockTestnetModeChange();

    await new Promise(process.nextTick); // Await getEnabledBridgeServices() call
    expect(createUnifiedBridgeService).toHaveBeenCalledTimes(2);
  });

  it('recreates the core instance when certain feature flags are toggled', async () => {
    new UnifiedBridgeService(networkService, storageService, flagsService);

    const mockFeatureFlagChanges = (flagsService.addListener as jest.Mock).mock
      .lastCall[1];

    await new Promise(process.nextTick); // Await getEnabledBridgeServices() call
    expect(createUnifiedBridgeService).toHaveBeenCalledTimes(1);

    // Toggle an irrelevant flag off
    mockFeatureFlagChanges({
      [FeatureGates.UNIFIED_BRIDGE_CCTP]: true,
      [FeatureGates.UNIFIED_BRIDGE_ICTT]: true,
      [FeatureGates.UNIFIED_BRIDGE_AB_AVA_TO_BTC]: true,
      [FeatureGates.UNIFIED_BRIDGE_AB_BTC_TO_AVA]: true,
      [FeatureGates.UNIFIED_BRIDGE_AB_EVM]: true,
      [FeatureGates.IMPORT_FIREBLOCKS]: false,
    });

    await new Promise(process.nextTick); // Await getEnabledBridgeServices() call
    expect(createUnifiedBridgeService).toHaveBeenCalledTimes(1);

    // Toggle a relevant flag off
    mockFeatureFlagChanges({
      [FeatureGates.UNIFIED_BRIDGE_CCTP]: false,
      [FeatureGates.UNIFIED_BRIDGE_ICTT]: true,
      [FeatureGates.UNIFIED_BRIDGE_AB_AVA_TO_BTC]: true,
      [FeatureGates.UNIFIED_BRIDGE_AB_BTC_TO_AVA]: true,
      [FeatureGates.UNIFIED_BRIDGE_AB_EVM]: true,
      [FeatureGates.IMPORT_FIREBLOCKS]: false,
    });

    await new Promise(process.nextTick); // Await getEnabledBridgeServices() call
    expect(createUnifiedBridgeService).toHaveBeenCalledTimes(2);
  });

  it('starts tracking incomplete transfers after instantiation', async () => {
    storageService.load.mockResolvedValue({
      pendingTransfers: {
        '0x1234': { sourceTxHash: '0x1234', completedAt: Date.now() },
        '0x2345': { sourceTxHash: '0x2345' },
      },
    });

    const bridgeService = new UnifiedBridgeService(
      networkService,
      storageService,
      flagsService,
    );

    await bridgeService.onStorageReady();

    expect(trackTransfer).toHaveBeenCalledTimes(1);
    expect(trackTransfer).toHaveBeenCalledWith(
      expect.objectContaining({ bridgeTransfer: { sourceTxHash: '0x2345' } }),
    );
  });

  describe('when building bridge services fails', () => {
    const serviceMap = new Map([[BridgeType.CCTP, {} as BridgeService]]);

    beforeEach(() => {
      jest.useFakeTimers();
      jest
        .mocked(getEnabledBridgeServices)
        .mockRejectedValueOnce(new Error('Failed to fetch'))
        .mockRejectedValueOnce(new Error('Failed to fetch'))
        .mockRejectedValueOnce(new Error('Failed to fetch'))
        .mockResolvedValueOnce(serviceMap);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('retries using an exponential backoff delay', async () => {
      networkService.isMainnet.mockReturnValue(true);
      storageService.load.mockResolvedValue({
        pendingTransfers: {},
      });

      new UnifiedBridgeService(networkService, storageService, flagsService);
      await jest.runAllTimersAsync();
      await jest.runAllTicks();

      expect(getEnabledBridgeServices).toHaveBeenCalledTimes(4);
      expect(wait).toHaveBeenNthCalledWith(1, 2000);
      expect(wait).toHaveBeenNthCalledWith(2, 4000);
      expect(wait).toHaveBeenNthCalledWith(3, 8000);
      expect(createUnifiedBridgeService).toHaveBeenCalled();
    });
  });
});
