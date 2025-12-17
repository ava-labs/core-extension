import { TokenPricesService } from './TokenPricesService';
import {
  PriceChangesData,
  priceChangeRefreshRate,
  TOKENS_PRICE_DATA,
  TOKENS_PRICE_DATA_VERSION,
  TokensPriceChangeData,
  TokensPriceShortData,
} from '@core/types';
import { SettingsService } from '../settings/SettingsService';
import { StorageService } from '../storage/StorageService';

jest.mock('@core/common', () => {
  const actualImport = jest.requireActual('@core/common');
  return {
    ...actualImport,
  };
});

describe('TokenPricesService', () => {
  let service: TokenPricesService;
  let settingsService: jest.Mocked<SettingsService>;
  let storageService: jest.Mocked<StorageService>;

  const mockPriceChangesResponse: PriceChangesData[] = [
    {
      internalId: 'NATIVE-avax',
      symbol: 'AVAX',
      name: 'Avalanche',
      image: 'avax.png',
      current_price: 35.5,
      market_cap: 1000000000,
      market_cap_rank: 10,
      fully_diluted_valuation: 2000000000,
      total_volume: 500000000,
      high_24h: 36,
      low_24h: 34,
      price_change_24h: 1.5,
      price_change_percentage_24h: 4.5,
      market_cap_change_24h: 50000000,
      market_cap_change_percentage_24h: 5,
      circulating_supply: 300000000,
      total_supply: 400000000,
      max_supply: 720000000,
      ath: 150,
      ath_change_percentage: -75,
      ath_date: '2021-11-21',
      atl: 3,
      atl_change_percentage: 1000,
      atl_date: '2020-12-31',
      roi: null,
      platforms: {},
      last_updated: '2024-01-01T00:00:00Z',
    },
    {
      internalId: 'eip155:43114-0x1234567890abcdef',
      symbol: 'TEST',
      name: 'Test Token',
      image: 'test.png',
      current_price: 1.25,
      market_cap: 10000000,
      market_cap_rank: 500,
      fully_diluted_valuation: 20000000,
      total_volume: 1000000,
      high_24h: 1.3,
      low_24h: 1.2,
      price_change_24h: 0.05,
      price_change_percentage_24h: 4.2,
      market_cap_change_24h: 500000,
      market_cap_change_percentage_24h: 5,
      circulating_supply: 8000000,
      total_supply: 10000000,
      max_supply: 10000000,
      ath: 5,
      ath_change_percentage: -75,
      ath_date: '2022-01-01',
      atl: 0.1,
      atl_change_percentage: 1150,
      atl_date: '2020-01-01',
      roi: null,
      platforms: { 'eip155:43114': '0x1234567890abcdef' },
      last_updated: '2024-01-01T00:00:00Z',
    },
  ];

  const mockWatchlistPriceResponse = {
    AVAX: 36.0,
    BTC: 45000,
    SOL: 100,
  };

  const mockCachedPriceData: TokensPriceShortData = {
    'NATIVE-avax': {
      internalId: 'NATIVE-avax',
      symbol: 'AVAX',
      platforms: {},
      priceChange: 1.5,
      priceChangePercentage: 4.5,
      currentPrice: 35.5,
    },
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T12:00:00Z'));

    settingsService = {
      getSettings: jest.fn().mockResolvedValue({ currency: 'USD' }),
    } as any;

    storageService = {
      loadUnencrypted: jest.fn(),
      saveUnencrypted: jest.fn(),
    } as any;

    global.fetch = jest.fn();

    service = new TokenPricesService(settingsService, storageService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('getPriceChangesData', () => {
    it('should return cached data when valid and not expired', async () => {
      const cachedData: TokensPriceChangeData = {
        currency: 'USD',
        version: TOKENS_PRICE_DATA_VERSION,
        lastUpdatedAt: Date.now() - 1000, // 1 second ago
        priceChanges: mockCachedPriceData,
      };

      storageService.loadUnencrypted.mockResolvedValue(cachedData);

      const result = await service.getPriceChangesData();

      expect(result).toEqual(mockCachedPriceData);
      expect(global.fetch).not.toHaveBeenCalled();
      expect(storageService.saveUnencrypted).not.toHaveBeenCalled();
    });

    it('should fetch fresh data when cache is empty', async () => {
      storageService.loadUnencrypted.mockResolvedValue(null);

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockPriceChangesResponse),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockWatchlistPriceResponse),
        });

      const result = await service.getPriceChangesData();

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(result).toBeDefined();
      expect(result?.['NATIVE-avax']).toBeDefined();
      expect(result?.['NATIVE-avax']?.currentPrice).toBe(36.0); // Uses watchlist price
      expect(storageService.saveUnencrypted).toHaveBeenCalledWith(
        `${TOKENS_PRICE_DATA}-USD`,
        expect.objectContaining({
          currency: 'USD',
          version: TOKENS_PRICE_DATA_VERSION,
          lastUpdatedAt: expect.any(Number),
        }),
      );
    });

    it('should fetch fresh data when cache is expired', async () => {
      const expiredData: TokensPriceChangeData = {
        currency: 'USD',
        version: TOKENS_PRICE_DATA_VERSION,
        lastUpdatedAt: Date.now() - priceChangeRefreshRate - 1000, // Expired
        priceChanges: mockCachedPriceData,
      };

      storageService.loadUnencrypted.mockResolvedValue(expiredData);

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockPriceChangesResponse),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockWatchlistPriceResponse),
        });

      const result = await service.getPriceChangesData();

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(result).toBeDefined();
    });

    it('should fetch fresh data when cache version is outdated', async () => {
      const outdatedVersionData: TokensPriceChangeData = {
        currency: 'USD',
        version: 1, // Outdated version
        lastUpdatedAt: Date.now() - 1000, // Not expired
        priceChanges: mockCachedPriceData,
      };

      storageService.loadUnencrypted.mockResolvedValue(outdatedVersionData);

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockPriceChangesResponse),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockWatchlistPriceResponse),
        });

      const result = await service.getPriceChangesData();

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(result).toBeDefined();
      expect(storageService.saveUnencrypted).toHaveBeenCalledWith(
        `${TOKENS_PRICE_DATA}-USD`,
        expect.objectContaining({
          version: TOKENS_PRICE_DATA_VERSION,
        }),
      );
    });

    it('should fetch fresh data when cache has no version', async () => {
      const noVersionData: TokensPriceChangeData = {
        currency: 'USD',
        // No version field
        lastUpdatedAt: Date.now() - 1000, // Not expired
        priceChanges: mockCachedPriceData,
      };

      storageService.loadUnencrypted.mockResolvedValue(noVersionData);

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockPriceChangesResponse),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockWatchlistPriceResponse),
        });

      const result = await service.getPriceChangesData();

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(result).toBeDefined();
    });

    it('should fetch fresh data when cached data lacks currentPrice field', async () => {
      const cachedWithoutPrice: TokensPriceChangeData = {
        currency: 'USD',
        version: TOKENS_PRICE_DATA_VERSION,
        lastUpdatedAt: Date.now() - 1000,
        priceChanges: {
          'NATIVE-avax': {
            internalId: 'NATIVE-avax',
            symbol: 'AVAX',
            platforms: {},
            // No currentPrice field
          },
        },
      };

      storageService.loadUnencrypted.mockResolvedValue(cachedWithoutPrice);

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockPriceChangesResponse),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockWatchlistPriceResponse),
        });

      const result = await service.getPriceChangesData();

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(result).toBeDefined();
    });

    it('should return undefined when both fetch requests fail', async () => {
      storageService.loadUnencrypted.mockResolvedValue(null);

      (global.fetch as jest.Mock).mockImplementation(() =>
        Promise.reject(new Error('Network error')),
      );

      const result = await service.getPriceChangesData();

      expect(result).toBeUndefined();
    });

    it('should deduplicate concurrent requests', async () => {
      storageService.loadUnencrypted.mockResolvedValue(null);

      let resolveTokensFetch: (value: any) => void;
      let resolvePriceFetch: (value: any) => void;

      const tokensPromise = new Promise((resolve) => {
        resolveTokensFetch = resolve;
      });
      const pricePromise = new Promise((resolve) => {
        resolvePriceFetch = resolve;
      });

      (global.fetch as jest.Mock)
        .mockReturnValueOnce(tokensPromise)
        .mockReturnValueOnce(pricePromise);

      // Start 3 concurrent requests
      const promise1 = service.getPriceChangesData();
      const promise2 = service.getPriceChangesData();
      const promise3 = service.getPriceChangesData();

      // Resolve the fetch promises
      resolveTokensFetch!({
        json: () => Promise.resolve(mockPriceChangesResponse),
      });
      resolvePriceFetch!({
        json: () => Promise.resolve(mockWatchlistPriceResponse),
      });

      const [result1, result2, result3] = await Promise.all([
        promise1,
        promise2,
        promise3,
      ]);

      // All results should be the same
      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);

      // fetch should only be called twice (once for tokens, once for price)
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should allow new requests after the pending one completes', async () => {
      storageService.loadUnencrypted.mockResolvedValue(null);

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockPriceChangesResponse),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockWatchlistPriceResponse),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockPriceChangesResponse),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockWatchlistPriceResponse),
        });

      // First request
      await service.getPriceChangesData();
      expect(global.fetch).toHaveBeenCalledTimes(2);

      // Second request (after first completes)
      await service.getPriceChangesData();
      expect(global.fetch).toHaveBeenCalledTimes(4);
    });

    it('should use current_price for non-watchlist tokens', async () => {
      storageService.loadUnencrypted.mockResolvedValue(null);

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockPriceChangesResponse),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockWatchlistPriceResponse),
        });

      const result = await service.getPriceChangesData();

      // TEST token is not in watchlistTokens, so it should use current_price
      expect(result?.['eip155:43114-0x1234567890abcdef']?.currentPrice).toBe(
        1.25,
      );
    });
  });

  describe('getTokenPriceByAddress', () => {
    const mockNetwork = {
      caipId: 'eip155:43114',
    } as any;

    it('should return price by internalId', async () => {
      const cachedData: TokensPriceChangeData = {
        currency: 'USD',
        version: TOKENS_PRICE_DATA_VERSION,
        lastUpdatedAt: Date.now() - 1000,
        priceChanges: {
          'eip155:43114-0x1234567890abcdef': {
            internalId: 'eip155:43114-0x1234567890abcdef',
            symbol: 'TEST',
            platforms: { 'eip155:43114': '0x1234567890abcdef' },
            currentPrice: 1.25,
          },
        },
      };

      storageService.loadUnencrypted.mockResolvedValue(cachedData);

      const result = await service.getTokenPriceByAddress(
        '0x1234567890ABCDEF', // Uppercase to test case-insensitivity
        mockNetwork,
      );

      expect(result).toEqual({
        '0x1234567890ABCDEF': 1.25,
      });
    });

    it('should return price by platform address when internalId not found', async () => {
      const cachedData: TokensPriceChangeData = {
        currency: 'USD',
        version: TOKENS_PRICE_DATA_VERSION,
        lastUpdatedAt: Date.now() - 1000,
        priceChanges: {
          'some-other-id': {
            internalId: 'some-other-id',
            symbol: 'TEST',
            platforms: { 'eip155:43114': '0xabcdef1234567890' },
            currentPrice: 2.5,
          },
        },
      };

      storageService.loadUnencrypted.mockResolvedValue(cachedData);

      const result = await service.getTokenPriceByAddress(
        '0xABCDEF1234567890',
        mockNetwork,
      );

      expect(result).toEqual({
        '0xABCDEF1234567890': 2.5,
      });
    });

    it('should return null when token not found', async () => {
      const cachedData: TokensPriceChangeData = {
        currency: 'USD',
        version: TOKENS_PRICE_DATA_VERSION,
        lastUpdatedAt: Date.now() - 1000,
        priceChanges: mockCachedPriceData,
      };

      storageService.loadUnencrypted.mockResolvedValue(cachedData);

      const result = await service.getTokenPriceByAddress(
        '0xunknown',
        mockNetwork,
      );

      expect(result).toEqual({
        '0xunknown': null,
      });
    });

    it('should return null when getPriceChangesData returns undefined', async () => {
      storageService.loadUnencrypted.mockResolvedValue(null);

      (global.fetch as jest.Mock).mockImplementation(() =>
        Promise.reject(new Error('Network error')),
      );

      const result = await service.getTokenPriceByAddress(
        '0xunknown',
        mockNetwork,
      );

      expect(result).toEqual({
        '0xunknown': null,
      });
    });
  });

  describe('getNativeTokenPrice', () => {
    it('should return native token price', async () => {
      const cachedData: TokensPriceChangeData = {
        currency: 'USD',
        version: TOKENS_PRICE_DATA_VERSION,
        lastUpdatedAt: Date.now() - 1000,
        priceChanges: mockCachedPriceData,
      };

      storageService.loadUnencrypted.mockResolvedValue(cachedData);

      const result = await service.getNativeTokenPrice('AVAX');

      expect(result).toBe(35.5);
    });

    it('should handle symbol case-insensitively', async () => {
      const cachedData: TokensPriceChangeData = {
        currency: 'USD',
        version: TOKENS_PRICE_DATA_VERSION,
        lastUpdatedAt: Date.now() - 1000,
        priceChanges: mockCachedPriceData,
      };

      storageService.loadUnencrypted.mockResolvedValue(cachedData);

      // Test with uppercase
      const resultUppercase = await service.getNativeTokenPrice('AVAX');
      expect(resultUppercase).toBe(35.5);

      // Test with lowercase
      const resultLowercase = await service.getNativeTokenPrice('avax');
      expect(resultLowercase).toBe(35.5);

      // Test with mixed case
      const resultMixedCase = await service.getNativeTokenPrice('Avax');
      expect(resultMixedCase).toBe(35.5);
    });

    it('should return null when native token not found', async () => {
      const cachedData: TokensPriceChangeData = {
        currency: 'USD',
        version: TOKENS_PRICE_DATA_VERSION,
        lastUpdatedAt: Date.now() - 1000,
        priceChanges: mockCachedPriceData,
      };

      storageService.loadUnencrypted.mockResolvedValue(cachedData);

      const result = await service.getNativeTokenPrice('ETH');

      expect(result).toBeNull();
    });

    it('should return null when getPriceChangesData returns undefined', async () => {
      storageService.loadUnencrypted.mockResolvedValue(null);

      (global.fetch as jest.Mock).mockImplementation(() =>
        Promise.reject(new Error('Network error')),
      );

      const result = await service.getNativeTokenPrice('AVAX');

      expect(result).toBeNull();
    });
  });
});
