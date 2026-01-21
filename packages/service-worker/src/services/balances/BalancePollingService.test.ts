import { TokenType } from '@avalabs/vm-module-types';
import { BalanceAggregatorService } from './BalanceAggregatorService';
import { BalancePollingService } from './BalancePollingService';

describe('src/background/services/balances/BalancePollingService.ts', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const aggregatorServiceMock = {
    getBalancesForNetworks: jest.fn(),
  } as unknown as BalanceAggregatorService;

  const account = {} as any;
  const activeNetworkId = 1;
  const roundRobinChainIds = [2, 3, 4];
  const tokenTypes = [TokenType.NATIVE, TokenType.ERC20];

  const getFetchedNetworksForCall = (mock, callIndex) => {
    return mock.calls[callIndex][0];
  };

  const runIntervalTimes = async (times) => {
    for (let i = 0; i < times; i++) {
      jest.advanceTimersByTime(BalancePollingService.INTERVAL + 1);
      // Call the scheduled timer.
      await jest.runAllTimers();
    }
  };

  it('stops polling when extension is closed', async () => {
    const service = new BalancePollingService(aggregatorServiceMock);

    await service.startPolling(
      account,
      activeNetworkId,
      roundRobinChainIds,
      tokenTypes,
    );

    // Purposefully DO NOT await this, as we want to test the behavior
    // of onAllExtensionsClosed() being called while polling is in progress.
    runIntervalTimes(1);

    expect(aggregatorServiceMock.getBalancesForNetworks).toHaveBeenCalledTimes(
      2, // Once immediately after startPolling() and one more time after the first interval
    );

    service.onAllExtensionsClosed();

    await runIntervalTimes(10); // Wait X intervals, 10 is arbitrary here
    expect(aggregatorServiceMock.getBalancesForNetworks).toHaveBeenCalledTimes(
      2, // Still only called twice. No more polling after onAllExtensionsClosed()
    );
  });

  describe('when polling is active', () => {
    beforeEach(async () => {
      const service = new BalancePollingService(aggregatorServiceMock);
      await service.startPolling(
        account,
        activeNetworkId,
        roundRobinChainIds,
        tokenTypes,
      );
    });

    it('polls for active and favorite networks on the first run', () => {
      expect(
        aggregatorServiceMock.getBalancesForNetworks,
      ).toHaveBeenLastCalledWith({
        chainIds: [1, 2, 3, 4],
        accounts: expect.anything(),
        tokenTypes,
      });
    });

    it('polls for active network on every run', () => {
      jest.advanceTimersByTime(BalancePollingService.INTERVAL + 1);

      expect(
        (
          aggregatorServiceMock.getBalancesForNetworks as jest.Mock
        ).mock.calls.every(([{ chainIds }]) => chainIds.includes(1)),
      ).toBe(true);
    });

    it('polls non-active, favorite networks every 15th run', async () => {
      await runIntervalTimes(16);

      const { mock } =
        aggregatorServiceMock.getBalancesForNetworks as jest.Mock;

      // On first run, loads active + 1st non-active, favorite network and all other favorite networks
      expect(getFetchedNetworksForCall(mock, 0).chainIds).toEqual([1, 2, 3, 4]);

      // On second run, loads active + 2nd non-active, favorite network
      expect(getFetchedNetworksForCall(mock, 1).chainIds).toEqual([1, 3]);

      // On third run, loads active + 3rd non-active, favorite network
      expect(getFetchedNetworksForCall(mock, 2).chainIds).toEqual([1, 4]);

      // Every 15th run, the cycle repeats (without loading all networks at the same time)
      expect(getFetchedNetworksForCall(mock, 15).chainIds).toEqual([1, 2]);
    });
  });
});
