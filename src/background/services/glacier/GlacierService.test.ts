import { Glacier } from '@avalabs/glacier-sdk';
import { GlacierService } from './GlacierService';

jest.mock('@avalabs/glacier-sdk');

const healthCheckMock = jest.fn();
const supportedChainsMock = jest.fn();

const waitForFirstHealthCheck = async () => {
  jest.runOnlyPendingTimers();
  await new Promise(jest.requireActual('timers').setImmediate);
};

describe('src/background/services/glacier/GlacierService.ts', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();

    (Glacier as jest.Mock).mockReturnValue({
      healthCheck: {
        healthCheck: healthCheckMock.mockResolvedValue({
          status: 'ok',
        }),
      },
      evm: {
        supportedChains: supportedChainsMock,
      },
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('checks if glacier is helthy every 5 seconds', async () => {
    new GlacierService();

    for (let i = 0; i < 3; i++) {
      jest.advanceTimersByTime(5000);
      expect(healthCheckMock).toHaveBeenCalledTimes(i + 1);
    }
  });

  describe('isNetworkSupported', () => {
    it('returns false if glacier is not healthy', async () => {
      healthCheckMock.mockRejectedValue('some error');

      const glacierService = new GlacierService();
      supportedChainsMock.mockReset(); // It's first called when GlacierService is instantiated, so we need to reset the counter.

      await waitForFirstHealthCheck();

      const result = await glacierService.isNetworkSupported(1);

      expect(result).toBe(false);
      expect(supportedChainsMock).not.toHaveBeenCalled();
    });

    it('returns false if fetching supported chains fails', async () => {
      supportedChainsMock.mockRejectedValue('some error');

      const glacierService = new GlacierService();
      supportedChainsMock.mockReset(); // It's first called when GlacierService is instantiated, so we need to reset the counter.

      await waitForFirstHealthCheck();

      const result = await glacierService.isNetworkSupported(1);

      expect(result).toBe(false);
      expect(supportedChainsMock).toHaveBeenCalledTimes(1);
    });

    it('returns true if the provided chain id is supported', async () => {
      supportedChainsMock.mockResolvedValue({ chains: [{ chainId: '1' }] });

      const glacierService = new GlacierService();
      await waitForFirstHealthCheck();

      const result = await glacierService.isNetworkSupported(1);
      expect(result).toBe(true);
    });

    it('fetches supported chains only once', async () => {
      supportedChainsMock.mockResolvedValue({ chains: [{ chainId: '1' }] });

      const glacierService = new GlacierService();
      await waitForFirstHealthCheck();

      const result_1 = await glacierService.isNetworkSupported(1);
      const result_2 = await glacierService.isNetworkSupported(1);
      const result_3 = await glacierService.isNetworkSupported(1);

      expect([result_1, result_2, result_3]).toStrictEqual([true, true, true]);
      expect(supportedChainsMock).toHaveBeenCalledTimes(1);
    });
  });
});
