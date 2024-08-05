import {
  Environment,
  createUnifiedBridgeService,
} from '@avalabs/bridge-unified';
import { UnifiedBridgeService } from './UnifiedBridgeService';
import { FeatureGates } from '../featureFlags/models';

jest.mock('@avalabs/bridge-unified');
jest.mock('@src/utils/network/getProviderForNetwork');

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
    },
    addListener: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();

    core = {
      bridges: new Map(),
      estimateGas,
      getFees,
      getAssets: jest.fn().mockResolvedValue({}),
      trackTransfer,
      transferAsset,
      init: jest.fn().mockResolvedValue(undefined),
    } as any;

    jest.mocked(createUnifiedBridgeService).mockReturnValue(core);

    networkService.isMainnet.mockReturnValue(false);
    networkService.getNetwork.mockImplementation(async (chainId) => ({
      chainId,
    }));

    new UnifiedBridgeService(networkService, storageService, flagsService);
  });

  it('creates core instance with proper environment', () => {
    networkService.isMainnet.mockReturnValue(true);

    new UnifiedBridgeService(networkService, storageService, flagsService);

    expect(createUnifiedBridgeService).toHaveBeenCalledWith(
      expect.objectContaining({
        environment: Environment.PROD,
      })
    );

    networkService.isMainnet.mockReturnValue(false);

    new UnifiedBridgeService(networkService, storageService, flagsService);

    expect(createUnifiedBridgeService).toHaveBeenCalledWith(
      expect.objectContaining({
        environment: Environment.TEST,
      })
    );
  });

  it('recreates the core instance on testnet mode switch', () => {
    const mockTestnetModeChange = (
      networkService.developerModeChanged.add as jest.Mock
    ).mock.lastCall[0];

    expect(createUnifiedBridgeService).toHaveBeenCalledTimes(1);
    mockTestnetModeChange();
    expect(createUnifiedBridgeService).toHaveBeenCalledTimes(2);
  });

  it('recreates the core instance when certain feature flags are toggled', () => {
    const mockFeatureFlagChanges = (flagsService.addListener as jest.Mock).mock
      .lastCall[1];

    expect(createUnifiedBridgeService).toHaveBeenCalledTimes(1);

    // Toggle an irrelevant flag off
    mockFeatureFlagChanges({
      [FeatureGates.UNIFIED_BRIDGE_CCTP]: true,
      [FeatureGates.IMPORT_FIREBLOCKS]: false,
    });
    expect(createUnifiedBridgeService).toHaveBeenCalledTimes(1);

    // Toggle a relevant flag off
    mockFeatureFlagChanges({
      [FeatureGates.UNIFIED_BRIDGE_CCTP]: false,
      [FeatureGates.IMPORT_FIREBLOCKS]: false,
    });
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
      flagsService
    );

    await bridgeService.onStorageReady();

    expect(trackTransfer).toHaveBeenCalledTimes(1);
    expect(trackTransfer).toHaveBeenCalledWith(
      expect.objectContaining({ bridgeTransfer: { sourceTxHash: '0x2345' } })
    );
  });
});
