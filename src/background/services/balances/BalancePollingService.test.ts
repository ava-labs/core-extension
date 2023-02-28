import { AccountsService } from '../accounts/AccountsService';
import { NetworkService } from '../network/NetworkService';
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
    updateBalancesForNetworks: jest.fn(),
  } as unknown as BalanceAggregatorService;

  const networkServiceMock = {
    activeNetwork: {
      chainId: 1,
    },
    favoriteNetworks: [2, 3, 4],
    favoriteNetworksUpdated: {
      add: jest.fn(),
    },
  } as unknown as NetworkService;

  const accountsServiceMock = {
    addListener: jest.fn(),
    activeAccount: { id: 'abcd-1234' },
  } as unknown as AccountsService;

  const getFetchedNetworksForCall = (mock, callIndex) =>
    mock.calls[callIndex][0];

  const runIntervalTimes = async (times) => {
    for (let i = 0; i < times; i++) {
      jest.advanceTimersByTime(BalancePollingService.INTERVAL + 1);
      await jest.runOnlyPendingTimers();
    }
  };

  describe('when polling is active', () => {
    beforeEach(async () => {
      const service = new BalancePollingService(
        aggregatorServiceMock,
        networkServiceMock,
        accountsServiceMock
      );
      await service.startPolling();
    });

    it('polls for active and favorite networks on the first run', () => {
      expect(
        aggregatorServiceMock.updateBalancesForNetworks
      ).toHaveBeenLastCalledWith([1, 2, 3, 4], expect.anything());
    });

    it('polls for active network on every run', () => {
      jest.advanceTimersByTime(BalancePollingService.INTERVAL + 1);

      expect(
        (
          aggregatorServiceMock.updateBalancesForNetworks as jest.Mock
        ).mock.calls.every(([chainIds]) => chainIds.includes(1))
      ).toBe(true);
    });

    it('polls non-active, favorite networks every 15th run', async () => {
      await runIntervalTimes(16);

      const { mock } =
        aggregatorServiceMock.updateBalancesForNetworks as jest.Mock;

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
