import {
  Environment,
  createUnifiedBridgeService,
  getEnabledBridgeServices,
} from '@avalabs/bridge-unified';
import { UnifiedBridgeService } from './UnifiedBridgeService';
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

  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(console, 'log').mockImplementation(noop);
    jest.spyOn(console, 'error').mockImplementation(noop);

    core = {} as any;

    jest.mocked(createUnifiedBridgeService).mockReturnValue(core);
    jest.mocked(getEnabledBridgeServices).mockResolvedValue({} as any);

    networkService.isMainnet.mockReturnValue(false);
    networkService.getNetwork.mockImplementation(async (chainId: number) => ({
      chainId,
    }));
    networkService.getBitcoinProvider.mockResolvedValue({} as any);
  });

  it('creates core instance with proper environment', async () => {
    networkService.isMainnet.mockReturnValue(true);

    new UnifiedBridgeService(networkService);

    await new Promise(process.nextTick); // Await getEnabledBridgeServices() call

    expect(createUnifiedBridgeService).toHaveBeenCalledWith(
      expect.objectContaining({
        environment: Environment.PROD,
      }),
    );

    networkService.isMainnet.mockReturnValue(false);

    new UnifiedBridgeService(networkService);
    await new Promise(process.nextTick); // Await getEnabledBridgeServices() call

    expect(createUnifiedBridgeService).toHaveBeenCalledWith(
      expect.objectContaining({
        environment: Environment.TEST,
      }),
    );
  });

  it('recreates the core instance on testnet mode switch', async () => {
    new UnifiedBridgeService(networkService);
    const mockTestnetModeChange = (
      networkService.developerModeChanged.add as jest.Mock
    ).mock.lastCall[0];

    await new Promise(process.nextTick); // Await getEnabledBridgeServices() call
    expect(createUnifiedBridgeService).toHaveBeenCalledTimes(1);

    mockTestnetModeChange();

    await new Promise(process.nextTick); // Await getEnabledBridgeServices() call
    expect(createUnifiedBridgeService).toHaveBeenCalledTimes(2);
  });

  describe('when building bridge services fails', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest
        .mocked(getEnabledBridgeServices)
        .mockRejectedValueOnce(new Error('Failed to fetch'))
        .mockRejectedValueOnce(new Error('Failed to fetch'))
        .mockRejectedValueOnce(new Error('Failed to fetch'))
        .mockResolvedValueOnce({} as any);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('retries using an exponential backoff delay', async () => {
      networkService.isMainnet.mockReturnValue(true);

      new UnifiedBridgeService(networkService);
      await jest.runAllTimersAsync();
      jest.runAllTicks();

      expect(getEnabledBridgeServices).toHaveBeenCalledTimes(4);
      expect(wait).toHaveBeenNthCalledWith(1, 2000);
      expect(wait).toHaveBeenNthCalledWith(2, 4000);
      expect(wait).toHaveBeenNthCalledWith(3, 8000);
      expect(createUnifiedBridgeService).toHaveBeenCalled();
    });
  });
});
