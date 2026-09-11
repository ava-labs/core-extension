import { getV2Tokens } from '~/api-clients/token-aggregator';
import { TokenManagerService } from './TokenManagerService';

jest.mock('~/api-clients/clients', () => ({
  tokenAggregatorApiClient: {},
}));
jest.mock('~/api-clients/token-aggregator', () => ({
  getV2Tokens: jest.fn(),
}));

const apiToken = (overrides: Record<string, unknown> = {}) => ({
  internalId: 'id',
  address: '0xabc',
  name: 'Token',
  symbol: 'TKN',
  isNative: false,
  logoUri: 'https://logo',
  decimals: 18,
  isVerified: true,
  top250Rank: null,
  networkCaip2Id: 'eip155:43114',
  contractType: 'ERC-20',
  ...overrides,
});

const page = (tokens: unknown[], currentPage: number, totalPages: number) => ({
  data: { data: { tokens }, metadata: { currentPage, totalPages } },
});

describe('TokenManagerService', () => {
  const settingsService = {} as any;
  const networkService = { getNetwork: jest.fn() } as any;
  let service: TokenManagerService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new TokenManagerService(settingsService, networkService);
  });

  describe('searchTokens', () => {
    it('queries /v2/tokens with the caip2 ids, keyword and spam flag', async () => {
      jest
        .mocked(getV2Tokens)
        .mockResolvedValue(page([apiToken()], 1, 3) as any);

      const result = await service.searchTokens({
        caip2Ids: ['eip155:43114', 'eip155:1'],
        page: 1,
        limit: 100,
        keyword: 'usd',
        includeMalicious: true,
      });

      expect(getV2Tokens).toHaveBeenCalledWith({
        client: {},
        throwOnError: true,
        query: {
          caip2Id: ['eip155:43114', 'eip155:1'],
          page: 1,
          limit: 100,
          returnMalicious: true,
          keyword: 'usd',
        },
      });
      expect(result.currentPage).toBe(1);
      expect(result.totalPages).toBe(3);
      expect(result.tokens).toEqual([
        expect.objectContaining({ address: '0xabc', caip2Id: 'eip155:43114' }),
      ]);
    });

    it('passes an exact address filter instead of keyword when given an address', async () => {
      jest
        .mocked(getV2Tokens)
        .mockResolvedValue(page([apiToken()], 1, 1) as any);

      await service.searchTokens({
        caip2Ids: ['eip155:43114'],
        page: 1,
        limit: 100,
        address: '0xabc',
      });

      expect(getV2Tokens).toHaveBeenCalledWith(
        expect.objectContaining({
          query: expect.objectContaining({ address: '0xabc' }),
        }),
      );
      expect(
        jest.mocked(getV2Tokens).mock.calls[0]![0]!.query,
      ).not.toHaveProperty('keyword');
    });

    it('propagates API failures instead of returning an empty page', async () => {
      jest.mocked(getV2Tokens).mockRejectedValue(new Error('boom'));

      await expect(
        service.searchTokens({
          caip2Ids: ['eip155:43114'],
          page: 1,
          limit: 100,
        }),
      ).rejects.toThrow('boom');
    });

    it('drops native tokens from the results', async () => {
      jest
        .mocked(getV2Tokens)
        .mockResolvedValue(
          page([apiToken({ isNative: true }), apiToken()], 1, 1) as any,
        );

      const result = await service.searchTokens({
        caip2Ids: ['eip155:43114'],
        page: 1,
        limit: 100,
      });

      expect(result.tokens).toHaveLength(1);
      expect(getV2Tokens).toHaveBeenCalledWith(
        expect.objectContaining({
          query: expect.objectContaining({ returnMalicious: false }),
        }),
      );
    });

    it('returns an empty page without calling the API when given no caip2 ids', async () => {
      const result = await service.searchTokens({
        caip2Ids: [],
        page: 2,
        limit: 100,
      });

      expect(result).toEqual({ tokens: [], currentPage: 2, totalPages: 2 });
      expect(getV2Tokens).not.toHaveBeenCalled();
    });
  });

  describe('getTokensByChainId', () => {
    it('returns embedded chainlist tokens without calling the API', async () => {
      const embedded = [
        { address: '0x1', name: 'A', symbol: 'A', decimals: 18 },
      ];
      networkService.getNetwork.mockResolvedValue({
        chainId: 43114,
        caipId: 'eip155:43114',
        tokens: embedded,
      });

      const result = await service.getTokensByChainId(43114);

      expect(result).toBe(embedded);
      expect(getV2Tokens).not.toHaveBeenCalled();
    });

    it('pages through /v2/tokens when the network has no embedded tokens', async () => {
      networkService.getNetwork.mockResolvedValue({
        chainId: 43114,
        caipId: 'eip155:43114',
        tokens: [],
      });
      jest
        .mocked(getV2Tokens)
        .mockResolvedValueOnce(
          page([apiToken({ address: '0xa' })], 1, 2) as any,
        )
        .mockResolvedValueOnce(
          page([apiToken({ address: '0xb' })], 2, 2) as any,
        );

      const result = await service.getTokensByChainId(43114);

      expect(getV2Tokens).toHaveBeenCalledTimes(2);
      expect(result.map((t) => t.address)).toEqual(['0xa', '0xb']);
      // The general catalog must not include malicious tokens by default.
      expect(getV2Tokens).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          query: expect.objectContaining({ returnMalicious: false }),
        }),
      );
    });

    it('advances by local page and terminates even if the API echoes a stale currentPage', async () => {
      networkService.getNetwork.mockResolvedValue({
        chainId: 43114,
        caipId: 'eip155:43114',
        tokens: [],
      });
      // currentPage is stuck at 1 while totalPages is 3 — advancing off it
      // would loop forever; advancing the local page must still terminate.
      jest
        .mocked(getV2Tokens)
        .mockResolvedValueOnce(
          page([apiToken({ address: '0xa' })], 1, 3) as any,
        )
        .mockResolvedValueOnce(
          page([apiToken({ address: '0xb' })], 1, 3) as any,
        )
        .mockResolvedValueOnce(
          page([apiToken({ address: '0xc' })], 1, 3) as any,
        );

      const result = await service.getTokensByChainId(43114);

      expect(getV2Tokens).toHaveBeenCalledTimes(3);
      expect(result.map((t) => t.address)).toEqual(['0xa', '0xb', '0xc']);
      expect(
        jest.mocked(getV2Tokens).mock.calls.map(([opts]) => opts!.query!.page),
      ).toEqual([1, 2, 3]);
    });

    it('returns the pages collected so far when a later page fails, and does not cache the partial result', async () => {
      networkService.getNetwork.mockResolvedValue({
        chainId: 43114,
        caipId: 'eip155:43114',
        tokens: [],
      });
      jest
        .mocked(getV2Tokens)
        .mockResolvedValueOnce(
          page([apiToken({ address: '0xa' })], 1, 3) as any,
        )
        .mockRejectedValueOnce(new Error('page 2 failed'))
        // A later call must re-fetch (partial results are not cached).
        .mockResolvedValueOnce(
          page([apiToken({ address: '0xa' })], 1, 2) as any,
        )
        .mockResolvedValueOnce(
          page([apiToken({ address: '0xb' })], 2, 2) as any,
        );

      const partial = await service.getTokensByChainId(43114);
      expect(partial.map((t) => t.address)).toEqual(['0xa']);

      const full = await service.getTokensByChainId(43114);
      expect(full.map((t) => t.address)).toEqual(['0xa', '0xb']);
      expect(getV2Tokens).toHaveBeenCalledTimes(4);
    });

    it('caches the catalog per chain for the service-worker lifetime', async () => {
      networkService.getNetwork.mockResolvedValue({
        chainId: 43114,
        caipId: 'eip155:43114',
        tokens: [],
      });
      jest
        .mocked(getV2Tokens)
        .mockResolvedValue(page([apiToken({ address: '0xa' })], 1, 1) as any);

      await service.getTokensByChainId(43114);
      await service.getTokensByChainId(43114);

      expect(getV2Tokens).toHaveBeenCalledTimes(1);
    });

    it('deduplicates concurrent catalog requests for the same chain', async () => {
      networkService.getNetwork.mockResolvedValue({
        chainId: 43114,
        caipId: 'eip155:43114',
        tokens: [],
      });
      let resolvePage: (value: unknown) => void = () => {};
      jest.mocked(getV2Tokens).mockReturnValue(
        new Promise((resolve) => {
          resolvePage = resolve;
        }) as any,
      );

      const first = service.getTokensByChainId(43114);
      const second = service.getTokensByChainId(43114);
      resolvePage(page([apiToken({ address: '0xa' })], 1, 1));
      await Promise.all([first, second]);

      expect(getV2Tokens).toHaveBeenCalledTimes(1);
    });

    it('does not cache a failed catalog fetch, so a later call retries', async () => {
      networkService.getNetwork.mockResolvedValue({
        chainId: 43114,
        caipId: 'eip155:43114',
        tokens: [],
      });
      jest
        .mocked(getV2Tokens)
        .mockRejectedValueOnce(new Error('boom'))
        .mockResolvedValueOnce(
          page([apiToken({ address: '0xa' })], 1, 1) as any,
        );

      // A first-page failure yields an empty best-effort result (not a throw)
      // and is not cached, so the next call re-fetches successfully.
      expect(await service.getTokensByChainId(43114)).toEqual([]);
      const result = await service.getTokensByChainId(43114);

      expect(getV2Tokens).toHaveBeenCalledTimes(2);
      expect(result.map((t) => t.address)).toEqual(['0xa']);
    });

    it('returns an empty list when the network is unknown', async () => {
      networkService.getNetwork.mockResolvedValue(undefined);

      expect(await service.getTokensByChainId(999)).toEqual([]);
      expect(getV2Tokens).not.toHaveBeenCalled();
    });
  });
});
