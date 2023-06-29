import { StorageService } from '../storage/StorageService';
import { CurrencyService } from './CurrencyService';
import {
  CURRENCY_EXCHANGE_RATES_REFRESH_INTERVAL,
  CURRENCY_EXCHANGE_RATES_STORAGE_KEY,
  CURRENCY_EXCHANGE_RATES_URL,
  CurrencyServiceEvents,
} from './models';

const mockStorageService = {
  saveUnencrypted: jest.fn(),
  loadUnencrypted: jest.fn(),
} as unknown as StorageService;

const buildResponse = (result?: any) => ({
  json: () => Promise.resolve(result),
});

describe('src/background/services/currency/CurrencyService.ts', () => {
  let service: CurrencyService;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    service = new CurrencyService(mockStorageService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it(`emits ${CurrencyServiceEvents.RatesUpdated} event`, async () => {
    const mockedResponse = { date: '2023-06-16', usd: { eur: 1.1 } };

    global.fetch = jest.fn().mockResolvedValue(buildResponse(mockedResponse));

    const listener = jest.fn();

    service.addListener(CurrencyServiceEvents.RatesUpdated, listener);

    await service.onUnlock();

    expect(listener).toHaveBeenCalledWith({ usd: { eur: 1.1 } });
  });

  describe('when constructed', () => {
    it('initializes with empty state', () => {
      expect(service.state).toBe(null);
    });
  });

  describe('when extension is unlocked', () => {
    const cachedResponse = {
      date: '2023-06-14',
      rates: {
        usd: { eur: 0.9 },
      },
    };

    const apiResponse = {
      date: '2023-06-15',
      usd: { eur: 1 },
    };

    it('fetches live data', async () => {
      global.fetch = jest.fn();
      await service.onUnlock();
      expect(global.fetch).toHaveBeenCalledWith(CURRENCY_EXCHANGE_RATES_URL);
    });

    it('starts polling', async () => {
      global.fetch = jest.fn();
      await service.onUnlock();

      const testedIntervals = 5;

      jest.advanceTimersByTime(
        (10 + CURRENCY_EXCHANGE_RATES_REFRESH_INTERVAL) * testedIntervals
      );

      for (let i = 1; i <= testedIntervals; i++) {
        expect(global.fetch).toHaveBeenNthCalledWith(
          i,
          CURRENCY_EXCHANGE_RATES_URL
        );
      }
    });

    describe('and API responds faster than local storage', () => {
      beforeEach(async () => {
        jest.mocked(mockStorageService.loadUnencrypted).mockImplementationOnce(
          () =>
            new Promise((resolve) => {
              setTimeout(() => resolve(cachedResponse), 1000);
            })
        );
        global.fetch = jest.fn().mockImplementationOnce(
          () =>
            new Promise((resolve) => {
              setTimeout(() => resolve(buildResponse(apiResponse)), 500);
            })
        );

        service.onUnlock();
      });

      it('saves live rates and then disregards the cached state', async () => {
        jest.advanceTimersByTime(600);
        await jest.runAllTimers();
        await jest.runAllTicks();
        expect(mockStorageService.loadUnencrypted).toHaveBeenCalledWith(
          CURRENCY_EXCHANGE_RATES_STORAGE_KEY
        );
        const { date, ...rates } = apiResponse;

        // Rates from API are set
        expect(service.state).toEqual({ date, rates });

        jest.advanceTimersByTime(600);
        await jest.runAllTimers();
        await jest.runAllTicks();

        // Still rates from API
        expect(service.state).toEqual({ date, rates });
      });
    });

    describe('and API responds slower than local storage', () => {
      beforeEach(async () => {
        jest.mocked(mockStorageService.loadUnencrypted).mockImplementationOnce(
          () =>
            new Promise((resolve) => {
              setTimeout(() => resolve(cachedResponse), 500);
            })
        );
        global.fetch = jest.fn().mockImplementationOnce(
          () =>
            new Promise((resolve) => {
              setTimeout(() => resolve(buildResponse(apiResponse)), 1000);
            })
        );

        service.onUnlock();
      });

      it('saves the cached state first and then updates to live rates from API', async () => {
        jest.advanceTimersByTime(600);
        await jest.runAllTicks();
        expect(mockStorageService.loadUnencrypted).toHaveBeenCalledWith(
          CURRENCY_EXCHANGE_RATES_STORAGE_KEY
        );

        // Cached rates are set first
        const { date: cachedDate, rates: cachedRates } = cachedResponse;
        expect(service.state).toEqual({ date: cachedDate, rates: cachedRates });

        jest.advanceTimersByTime(600);
        await jest.runAllTimers();
        await jest.runAllTicks();

        // Rates are updated with the fresh API response
        const { date, ...rates } = apiResponse;
        expect(service.state).toEqual({ date, rates });
      });
    });
  });
});
