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

  const addListenerMock = jest.fn();
  const accountsServiceMock = {
    addListener: addListenerMock,
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

  describe('when polling initiation fails due to no account being active', () => {
    it('schedules polling to start as soon as account is selected', async () => {
      const accountsService = {
        ...accountsServiceMock,
        activeAccount: null,
      } as unknown as AccountsService;

      const service = new BalancePollingService(
        aggregatorServiceMock,
        networkServiceMock,
        accountsService
      );

      // Simulate .startPolling() call before an account is selected
      await service.startPolling();

      jest.spyOn(service, 'startPolling');
      const [, callback] = addListenerMock.mock.calls[0];

      // Simulate active account selection event
      callback({ id: '1234' });

      expect(service.startPolling).toHaveBeenCalled();
    });
  });

  describe('when the active account changes', () => {
    it('restarts polling', async () => {
      const service = new BalancePollingService(
        aggregatorServiceMock,
        networkServiceMock,
        accountsServiceMock
      );
      jest.spyOn(service, 'restartPolling');

      const [, callback] = addListenerMock.mock.calls[0];

      // Simulate active account selection event
      callback({ id: '1234' });

      expect(service.restartPolling).toHaveBeenCalled();
    });
  });

  describe('when there is no active account', () => {
    it('stops polling', () => {
      const service = new BalancePollingService(
        aggregatorServiceMock,
        networkServiceMock,
        accountsServiceMock
      );

      const [, callback] = addListenerMock.mock.calls[0];

      jest.spyOn(service, 'stopPolling');
      // Simulate active account deselection event (i.e. wallet lock)
      callback(undefined);

      expect(service.stopPolling).toHaveBeenCalled();
    });
  });

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
