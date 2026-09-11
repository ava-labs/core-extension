import { ExtensionRequest } from '@core/types';
import { SearchNetworkTokensHandler } from './searchNetworkTokens';

// The handler transitively imports TokenManagerService -> api-clients, whose
// module init resolves AppCheckService; stub the clients module to avoid it.
jest.mock('~/api-clients/clients', () => ({ tokenAggregatorApiClient: {} }));
jest.mock('~/api-clients/token-aggregator', () => ({ getV2Tokens: jest.fn() }));

const searchedToken = (overrides: Record<string, unknown> = {}) => ({
  address: '0xabc',
  name: 'Token',
  symbol: 'TKN',
  decimals: 18,
  logoUri: 'https://logo',
  isVerified: true,
  contractType: 'ERC-20' as const,
  caip2Id: 'eip155:43114',
  ...overrides,
});

const buildRequest = (
  params: [string[], number, number, string?, boolean?, string?],
) => ({
  id: '1',
  method: ExtensionRequest.SEARCH_NETWORK_TOKENS,
  params,
});

describe('SearchNetworkTokensHandler', () => {
  const searchTokens = jest.fn();
  const handler = new SearchNetworkTokensHandler({ searchTokens } as any);

  beforeEach(() => jest.resetAllMocks());

  it('resolves chain ids and reports pagination', async () => {
    searchTokens.mockResolvedValue({
      tokens: [searchedToken()],
      currentPage: 1,
      totalPages: 3,
    });

    const result = await handler.handle({
      request: buildRequest([['eip155:43114'], 1, 100, 'usd', false]),
    } as any);

    expect(searchTokens).toHaveBeenCalledWith({
      caip2Ids: ['eip155:43114'],
      page: 1,
      limit: 100,
      keyword: 'usd',
      address: undefined,
      includeMalicious: false,
    });
    expect(result.result).toEqual({
      tokens: [expect.objectContaining({ chainId: 43114, address: '0xabc' })],
      currentPage: 1,
      hasMore: true,
      nextPage: 2,
    });
  });

  it('marks the last page as having no more results', async () => {
    searchTokens.mockResolvedValue({
      tokens: [searchedToken()],
      currentPage: 2,
      totalPages: 2,
    });

    const result = await handler.handle({
      request: buildRequest([['eip155:43114'], 2, 100]),
    } as any);

    expect(result.result!.hasMore).toBe(false);
    expect(result.result!.nextPage).toBeUndefined();
  });

  it('drops tokens whose caip id cannot be resolved to a chain id', async () => {
    searchTokens.mockResolvedValue({
      tokens: [
        searchedToken(),
        searchedToken({ caip2Id: 'bogus-caip', address: '0xdef' }),
      ],
      currentPage: 1,
      totalPages: 1,
    });

    const result = await handler.handle({
      request: buildRequest([['eip155:43114'], 1, 100]),
    } as any);

    expect(result.result!.tokens).toHaveLength(1);
    expect(result.result!.tokens[0]!.address).toBe('0xabc');
  });

  it('forwards an address filter to the service', async () => {
    searchTokens.mockResolvedValue({
      tokens: [],
      currentPage: 1,
      totalPages: 1,
    });

    await handler.handle({
      request: buildRequest([
        ['eip155:43114'],
        1,
        100,
        undefined,
        false,
        '0xabc',
      ]),
    } as any);

    expect(searchTokens).toHaveBeenCalledWith(
      expect.objectContaining({ address: '0xabc', keyword: undefined }),
    );
  });

  it('returns an error string when the service throws', async () => {
    searchTokens.mockRejectedValue(new Error('boom'));

    const result = await handler.handle({
      request: buildRequest([['eip155:43114'], 1, 100]),
    } as any);

    expect(result.error).toContain('boom');
  });
});
