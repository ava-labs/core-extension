import { TrendingTokenService } from './TrendingTokensService';
import { TrendingToken } from '@core/types';

// Mock fetch globally
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

// Mock process.env
process.env.PROXY_URL = 'https://test-proxy.com';

describe('TrendingTokensService', () => {
  let service: TrendingTokenService;
  let mockTrendingTokens: TrendingToken[];

  beforeEach(() => {
    service = new TrendingTokenService();
    mockFetch.mockClear();

    // Mock trending tokens data
    mockTrendingTokens = [
      {
        internalId: 'avalanche-avax',
        isNative: true,
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
        platforms: { avalanche: 'avalanche' },
        scanResult: null,
        scannedAt: null,
        liquidity: 1000000,
        logoURI: 'https://example.com/avax.png',
        name: 'Avalanche',
        symbol: 'AVAX',
        volume24hUSD: 50000000,
        volume24hChangePercent: 5.2,
        fdv: 15000000000,
        marketcap: 12000000000,
        rank: 1,
        price: 35.5,
        price24hChangePercent: 3.2,
        coingeckoId: 'avalanche-2',
        website: 'https://avax.network',
        sparkline: [
          { unixTime: 1640995200, value: 34.0 },
          { unixTime: 1641081600, value: 35.5 },
        ],
      },
      {
        internalId: 'solana-sol',
        isNative: true,
        address: '11111111111111111111111111111112',
        decimals: 9,
        platforms: { solana: 'solana' },
        scanResult: null,
        scannedAt: null,
        liquidity: 800000,
        logoURI: 'https://example.com/sol.png',
        name: 'Solana',
        symbol: 'SOL',
        volume24hUSD: 30000000,
        volume24hChangePercent: -2.1,
        fdv: 8000000000,
        marketcap: 7500000000,
        rank: 2,
        price: 85.25,
        price24hChangePercent: -1.5,
        coingeckoId: 'solana',
        website: 'https://solana.com',
        sparkline: [
          { unixTime: 1640995200, value: 86.0 },
          { unixTime: 1641081600, value: 85.25 },
        ],
      },
    ];
  });

  describe('initial state', () => {
    it('should initialize with empty tokens and null lastFetched', () => {
      const cache = service.trendingTokensInCache;
      expect(cache.avalanche).toEqual([]);
      expect(cache.solana).toEqual([]);

      const lastFetched = service.lastFetched;
      expect(lastFetched.avalanche).toBeNull();
      expect(lastFetched.solana).toBeNull();

      const fetching = service.fetching;
      expect(fetching.avalanche).toBe(false);
      expect(fetching.solana).toBe(false);
    });
  });

  describe('updateTrendingTokens setter', () => {
    it('should update tokens and lastFetched for avalanche network', () => {
      const beforeTime = Date.now();

      service.updateTrendingTokens = {
        tokens: mockTrendingTokens,
        network: 'avalanche',
      };

      const afterTime = Date.now();

      const cache = service.trendingTokensInCache;
      expect(cache.avalanche).toEqual(mockTrendingTokens);
      expect(cache.solana).toEqual([]);

      const lastFetched = service.lastFetched;
      expect(lastFetched.avalanche).toBeInstanceOf(Date);
      expect(lastFetched.avalanche!.getTime()).toBeGreaterThanOrEqual(
        beforeTime,
      );
      expect(lastFetched.avalanche!.getTime()).toBeLessThanOrEqual(afterTime);
      expect(lastFetched.solana).toBeNull();
    });

    it('should update tokens and lastFetched for solana network', () => {
      service.updateTrendingTokens = {
        tokens: mockTrendingTokens,
        network: 'solana',
      };

      const cache = service.trendingTokensInCache;
      expect(cache.solana).toEqual(mockTrendingTokens);
      expect(cache.avalanche).toEqual([]);

      const lastFetched = service.lastFetched;
      expect(lastFetched.solana).toBeInstanceOf(Date);
      expect(lastFetched.avalanche).toBeNull();
    });
  });

  describe('updateFetching setter', () => {
    it('should update fetching state for avalanche network', () => {
      service.updateFetching = {
        network: 'avalanche',
        fetching: true,
      };

      const fetching = service.fetching;
      expect(fetching.avalanche).toBe(true);
      expect(fetching.solana).toBe(false);
    });

    it('should update fetching state for solana network', () => {
      service.updateFetching = {
        network: 'solana',
        fetching: true,
      };

      const fetching = service.fetching;
      expect(fetching.solana).toBe(true);
      expect(fetching.avalanche).toBe(false);
    });
  });

  describe('getTrendingTokens', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockTrendingTokens,
      } as Response);
    });

    it('should fetch tokens from API when cache is empty', async () => {
      const result = await service.getTrendingTokens('avalanche');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-proxy.com/watchlist/trending?network=avalanche',
      );
      expect(result).toEqual([
        { ...mockTrendingTokens[0], rank: 1 },
        { ...mockTrendingTokens[1], rank: 2 },
      ]);

      // Should update cache
      const cache = service.trendingTokensInCache;
      expect(cache.avalanche).toEqual(result);
    });

    it('should return cached tokens when cache is fresh (< 10 minutes)', async () => {
      // Set up fresh cache
      service.updateTrendingTokens = {
        tokens: mockTrendingTokens,
        network: 'avalanche',
      };

      const result = await service.getTrendingTokens('avalanche');

      expect(mockFetch).not.toHaveBeenCalled();
      expect(result).toEqual(mockTrendingTokens);
    });

    it('should fetch new tokens when cache is stale (> 10 minutes)', async () => {
      // Set up stale cache
      const staleDate = new Date(Date.now() - 11 * 60 * 1000); // 11 minutes ago
      service.updateTrendingTokens = {
        tokens: mockTrendingTokens,
        network: 'avalanche',
      };
      // Manually set stale date
      (service as any)._trendingTokens.avalanche.lastFetched = staleDate;

      const result = await service.getTrendingTokens('avalanche');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-proxy.com/watchlist/trending?network=avalanche',
      );
      expect(result).toEqual([
        { ...mockTrendingTokens[0], rank: 1 },
        { ...mockTrendingTokens[1], rank: 2 },
      ]);
    });

    it('should not fetch when already fetching', async () => {
      // Set fetching state
      service.updateFetching = {
        network: 'avalanche',
        fetching: true,
      };
      service.updateTrendingTokens = {
        tokens: mockTrendingTokens,
        network: 'avalanche',
      };

      const result = await service.getTrendingTokens('avalanche');

      expect(mockFetch).not.toHaveBeenCalled();
      expect(result).toEqual(mockTrendingTokens);
    });

    it('should sort tokens by rank and limit to 10', async () => {
      const manyTokens = Array.from({ length: 15 }, (_, i) => ({
        ...mockTrendingTokens[0],
        internalId: `token-${i}`,
        rank: i + 1,
        name: `Token ${i + 1}`,
      }));

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => manyTokens,
      } as Response);

      const result = await service.getTrendingTokens('avalanche');

      expect(result).toHaveLength(10);
      expect(result[0]?.rank).toBe(1);
      expect(result[9]?.rank).toBe(10);
    });

    it('should handle fetch errors and reset fetching state', async () => {
      const error = new Error('Network error');
      mockFetch.mockRejectedValue(error);

      await expect(service.getTrendingTokens('avalanche')).rejects.toThrow(
        'Network error',
      );

      // Should reset fetching state
      const fetching = service.fetching;
      expect(fetching.avalanche).toBe(false);
    });

    it('should handle invalid response data', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ invalid: 'data' }),
      } as Response);

      await expect(service.getTrendingTokens('avalanche')).rejects.toThrow();

      // Should reset fetching state
      const fetching = service.fetching;
      expect(fetching.avalanche).toBe(false);
    });

    it('should work with solana network', async () => {
      const result = await service.getTrendingTokens('solana');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-proxy.com/watchlist/trending?network=solana',
      );
      expect(result).toEqual([
        { ...mockTrendingTokens[0], rank: 1 },
        { ...mockTrendingTokens[1], rank: 2 },
      ]);

      // Should update solana cache
      const cache = service.trendingTokensInCache;
      expect(cache.solana).toEqual(result);
    });

    it('should set and reset fetching state during API call', async () => {
      let fetchingDuringCall = false;

      mockFetch.mockImplementation(async () => {
        fetchingDuringCall = service.fetching.avalanche;
        return {
          ok: true,
          json: async () => mockTrendingTokens,
        } as Response;
      });

      await service.getTrendingTokens('avalanche');

      expect(fetchingDuringCall).toBe(true);
      expect(service.fetching.avalanche).toBe(false);
    });
  });

  describe('cache behavior', () => {
    it('should maintain separate caches for different networks', async () => {
      const avalancheTokens = [mockTrendingTokens[0]!];
      const solanaTokens = [mockTrendingTokens[1]!];

      service.updateTrendingTokens = {
        tokens: avalancheTokens,
        network: 'avalanche',
      };

      service.updateTrendingTokens = {
        tokens: solanaTokens,
        network: 'solana',
      };

      const cache = service.trendingTokensInCache;
      expect(cache.avalanche).toEqual(avalancheTokens);
      expect(cache.solana).toEqual(solanaTokens);
    });

    it('should maintain separate lastFetched times for different networks', () => {
      const time1 = new Date('2023-01-01T10:00:00Z');
      const time2 = new Date('2023-01-01T11:00:00Z');

      // Manually set different times
      (service as any)._trendingTokens.avalanche.lastFetched = time1;
      (service as any)._trendingTokens.solana.lastFetched = time2;

      const lastFetched = service.lastFetched;
      expect(lastFetched.avalanche).toEqual(time1);
      expect(lastFetched.solana).toEqual(time2);
    });

    it('should maintain separate fetching states for different networks', () => {
      service.updateFetching = { network: 'avalanche', fetching: true };
      service.updateFetching = { network: 'solana', fetching: false };

      const fetching = service.fetching;
      expect(fetching.avalanche).toBe(true);
      expect(fetching.solana).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle empty response from API', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [],
      } as Response);

      const result = await service.getTrendingTokens('avalanche');

      expect(result).toEqual([]);
      expect(service.trendingTokensInCache.avalanche).toEqual([]);
    });

    it('should handle tokens with missing optional fields', async () => {
      const minimalToken = {
        internalId: 'minimal-token',
        isNative: false,
        address: '0x123',
        decimals: 18,
        platforms: {},
        scanResult: null,
        scannedAt: null,
        liquidity: 0,
        logoURI: null,
        name: 'Minimal Token',
        symbol: 'MIN',
        volume24hUSD: 0,
        volume24hChangePercent: null,
        fdv: null,
        marketcap: null,
        rank: 1,
        price: 0,
        price24hChangePercent: null,
        coingeckoId: null,
        website: null,
        sparkline: [],
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [minimalToken],
      } as Response);

      const result = await service.getTrendingTokens('avalanche');

      expect(result).toEqual([{ ...minimalToken, rank: 1 }]);
    });
  });
});
