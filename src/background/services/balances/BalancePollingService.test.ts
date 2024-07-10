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

  const getFetchedNetworksForCall = (mock, callIndex) => {
    return mock.calls[callIndex][0];
  };

  const runIntervalTimes = async (times) => {
    for (let i = 0; i < times; i++) {
      jest.advanceTimersByTime(BalancePollingService.INTERVAL + 1);
      // Call the scheduled timer.
      await jest.runAllTimers();
      // Need to .runAllTicks too, because getFavoriteNetworks() method is async
      // and called inside of a fake Jest timer. This will resolve the pending promise.
      await jest.runAllTicks();
    }
  };

  describe('when polling is active', () => {
    beforeEach(async () => {
      const service = new BalancePollingService(aggregatorServiceMock);
      await service.startPolling(account, activeNetworkId, roundRobinChainIds);
    });

    it('polls for active and favorite networks on the first run', () => {
      expect(
        aggregatorServiceMock.getBalancesForNetworks
      ).toHaveBeenLastCalledWith([1, 2, 3, 4], expect.anything());
    });

    it('polls for active network on every run', () => {
      jest.advanceTimersByTime(BalancePollingService.INTERVAL + 1);

      expect(
        (
          aggregatorServiceMock.getBalancesForNetworks as jest.Mock
        ).mock.calls.every(([chainIds]) => chainIds.includes(1))
      ).toBe(true);
    });

    it('polls non-active, favorite networks every 15th run', async () => {
      await runIntervalTimes(16);

      const { mock } =
        aggregatorServiceMock.getBalancesForNetworks as jest.Mock;

      // On first run, loads active + 1st non-active, favorite network and all other favorite networks
      expect(getFetchedNetworksForCall(mock, 0)).toEqual([1, 2, 3, 4]);

      // On second run, loads active + 2nd non-active, favorite network
      expect(getFetchedNetworksForCall(mock, 1)).toEqual([1, 3]);

      // On third run, loads active + 3rd non-active, favorite network
      expect(getFetchedNetworksForCall(mock, 2)).toEqual([1, 4]);

      // Every 15th run, the cycle repeats (without loading all networks at the same time)
      expect(getFetchedNetworksForCall(mock, 15)).toEqual([1, 2]);
    });
  });
});
