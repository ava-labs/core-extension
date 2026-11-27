import { getV2Tokens, postV1TokenLookup } from '~/api-clients/token-aggregator';
import { TokenManagerService } from './TokenManagerService';

jest.mock('~/api-clients/clients', () => ({
  tokenAggregatorApiClient: {},
}));
jest.mock('~/api-clients/token-aggregator', () => ({
  getV2Tokens: jest.fn(),
  postV1TokenLookup: jest.fn(),
}));

const lookupResponse = (found: boolean) => ({
  data: {
    data: found ? { 'eip155:43114-0xabc': { internalId: 'id' } } : {},
  },
});

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

  describe('isTokenAvailable', () => {
    const network = { chainId: 43114, caipId: 'eip155:43114' } as any;

    it('looks up the exact (caip2Id, address) pair and returns true when found', async () => {
      jest
        .mocked(postV1TokenLookup)
        .mockResolvedValue(lookupResponse(true) as any);

      expect(await service.isTokenAvailable(network, '0xabc')).toBe(true);
      expect(postV1TokenLookup).toHaveBeenCalledWith(
        expect.objectContaining({
          body: { tokens: [{ caip2Id: 'eip155:43114', address: '0xabc' }] },
        }),
      );
    });

    it('returns false when the lookup finds no matching token', async () => {
      jest
        .mocked(postV1TokenLookup)
        .mockResolvedValue(lookupResponse(false) as any);

      expect(await service.isTokenAvailable(network, '0xabc')).toBe(false);
    });

    it('fails open (false) when the lookup throws', async () => {
      jest.mocked(postV1TokenLookup).mockRejectedValue(new Error('boom'));

      expect(await service.isTokenAvailable(network, '0xabc')).toBe(false);
    });

    it('returns false without calling the API when the network has no caip id', async () => {
      expect(
        await service.isTokenAvailable({ chainId: 1 } as any, '0xabc'),
      ).toBe(false);
      expect(postV1TokenLookup).not.toHaveBeenCalled();
    });

    it('caches a definitive result so repeat lookups skip the API', async () => {
      jest
        .mocked(postV1TokenLookup)
        .mockResolvedValue(lookupResponse(true) as any);

      expect(await service.isTokenAvailable(network, '0xabc')).toBe(true);
      expect(await service.isTokenAvailable(network, '0xabc')).toBe(true);

      expect(postV1TokenLookup).toHaveBeenCalledTimes(1);
    });

    it('does not cache a fail-open result, so a later call retries', async () => {
      jest
        .mocked(postV1TokenLookup)
        .mockRejectedValueOnce(new Error('boom'))
        .mockResolvedValueOnce(lookupResponse(true) as any);

      expect(await service.isTokenAvailable(network, '0xabc')).toBe(false);
      expect(await service.isTokenAvailable(network, '0xabc')).toBe(true);

      expect(postV1TokenLookup).toHaveBeenCalledTimes(2);
    });

    it('deduplicates concurrent lookups for the same token', async () => {
      let resolveLookup: (value: unknown) => void = () => {};
      jest.mocked(postV1TokenLookup).mockReturnValue(
        new Promise((resolve) => {
          resolveLookup = resolve;
        }) as any,
      );

      const first = service.isTokenAvailable(network, '0xabc');
      const second = service.isTokenAvailable(network, '0xabc');
      resolveLookup(lookupResponse(true));

      expect(await Promise.all([first, second])).toEqual([true, true]);
      expect(postV1TokenLookup).toHaveBeenCalledTimes(1);
    });
  });

  describe('lookupTokens', () => {
    const caip2Id = 'eip155:43114';

    const info = (overrides: Record<string, unknown> = {}) => ({
      internalId: 'id',
      platforms: { [caip2Id]: '0xabc' },
      isNative: false,
      name: 'Token',
      symbol: 'TKN',
      meta: { logoUri: 'https://logo', decimals: { [caip2Id]: 6 } },
      ...overrides,
    });

    const response = (entries: Record<string, unknown>) =>
      ({ data: { data: entries } }) as any;

    it('looks up the requested pairs and maps the response', async () => {
      jest
        .mocked(postV1TokenLookup)
        .mockResolvedValue(response({ 'opaque-key-1': info() }));

      const { tokens } = await service.lookupTokens(caip2Id, ['0xabc']);

      expect(postV1TokenLookup).toHaveBeenCalledWith(
        expect.objectContaining({
          body: { tokens: [{ caip2Id, address: '0xabc' }] },
        }),
      );
      expect(tokens).toEqual([
        {
          address: '0xabc',
          name: 'Token',
          symbol: 'TKN',
          decimals: 6,
          contractType: 'ERC-20',
          logoUri: 'https://logo',
          isVerified: null,
        },
      ]);
    });

    it('skips entries without decimals, natives and unrequested keys', async () => {
      jest.mocked(postV1TokenLookup).mockResolvedValue(
        response({
          one: info({ meta: null }),
          two: info({ isNative: true, platforms: { [caip2Id]: '0xdef' } }),
          three: info({ platforms: { [caip2Id]: '0xother' } }),
        }),
      );

      expect(
        (await service.lookupTokens(caip2Id, ['0xabc', '0xdef'])).tokens,
      ).toEqual([]);
    });

    it('matches requested addresses case-insensitively via platforms', async () => {
      jest
        .mocked(postV1TokenLookup)
        .mockResolvedValue(
          response({ x: info({ platforms: { [caip2Id]: '0xABC' } }) }),
        );

      const { tokens } = await service.lookupTokens(caip2Id, ['0xabc']);

      expect(tokens.map((token) => token.address)).toEqual(['0xABC']);
    });

    it('falls back to parsing the key when platforms has no address', async () => {
      jest
        .mocked(postV1TokenLookup)
        .mockResolvedValue(
          response({ [`${caip2Id}-0xabc`]: info({ platforms: null }) }),
        );

      const { tokens } = await service.lookupTokens(caip2Id, ['0xabc']);

      expect(tokens.map((token) => token.address)).toEqual(['0xabc']);
    });

    it('returns tokens from successful batches when another batch fails', async () => {
      const addresses = [
        ...Array.from(
          { length: 500 },
          (_, i) => `0x${i.toString(16).padStart(40, '0')}`,
        ),
        '0xabc',
      ];
      jest
        .mocked(postV1TokenLookup)
        .mockRejectedValueOnce(new Error('batch down'))
        .mockResolvedValueOnce(response({ k: info() }));

      const { tokens, failedAddresses } = await service.lookupTokens(
        caip2Id,
        addresses,
      );

      expect(tokens.map((token) => token.address)).toEqual(['0xabc']);
      expect(failedAddresses).toHaveLength(500);
      expect(failedAddresses).not.toContain('0xabc');
    });

    it('treats Solana addresses as case-sensitive', async () => {
      const solana = 'solana:mainnet';
      const mint = 'So11111111111111111111111111111111111111112';
      jest.mocked(postV1TokenLookup).mockResolvedValue(
        response({
          a: info({
            platforms: { [solana]: mint },
            meta: { decimals: { [solana]: 9 } },
          }),
          b: info({
            platforms: { [solana]: mint.toLowerCase() },
            meta: { decimals: { [solana]: 9 } },
          }),
        }),
      );

      const { tokens } = await service.lookupTokens(solana, [mint]);

      expect(tokens.map((token) => token.address)).toEqual([mint]);

      const { tokens: other } = await service.lookupTokens(solana, [
        mint.toLowerCase(),
      ]);
      expect(postV1TokenLookup).toHaveBeenCalledTimes(2);
      expect(other.map((token) => token.address)).toEqual([mint.toLowerCase()]);
    });

    it('returns cached tokens with failed addresses when every chunk fails', async () => {
      jest
        .mocked(postV1TokenLookup)
        .mockResolvedValueOnce(response({ 'opaque-key-1': info() }));
      await service.lookupTokens(caip2Id, ['0xabc']);

      jest.mocked(postV1TokenLookup).mockRejectedValue(new Error('down'));

      const { tokens, failedAddresses } = await service.lookupTokens(caip2Id, [
        '0xabc',
        '0xdef',
      ]);

      expect(tokens.map((token) => token.address)).toEqual(['0xabc']);
      expect(failedAddresses).toEqual(['0xdef']);
    });

    it('chunks requests into batches of 500', async () => {
      const addresses = Array.from(
        { length: 1001 },
        (_, i) => `0x${i.toString(16).padStart(40, '0')}`,
      );
      jest.mocked(postV1TokenLookup).mockResolvedValue(response({}));

      await service.lookupTokens(caip2Id, addresses);

      const sizes = jest
        .mocked(postV1TokenLookup)
        .mock.calls.map(([options]) => options.body.tokens.length);
      expect(sizes).toEqual([500, 500, 1]);
    });

    it('serves cached tokens without another request', async () => {
      jest
        .mocked(postV1TokenLookup)
        .mockResolvedValue(response({ 'opaque-key-1': info() }));

      await service.lookupTokens(caip2Id, ['0xabc']);
      const { tokens: again } = await service.lookupTokens(caip2Id, ['0xABC']);

      expect(postV1TokenLookup).toHaveBeenCalledTimes(1);
      expect(again).toHaveLength(1);
    });

    it('rejects when the aggregator request fails', async () => {
      jest.mocked(postV1TokenLookup).mockRejectedValue(new Error('down'));

      await expect(service.lookupTokens(caip2Id, ['0xabc'])).rejects.toThrow(
        'down',
      );
    });
  });
});
