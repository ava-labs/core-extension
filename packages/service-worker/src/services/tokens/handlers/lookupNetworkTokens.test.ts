import { ExtensionRequest } from '@core/types';
import { LookupNetworkTokensHandler } from './lookupNetworkTokens';

jest.mock('~/api-clients/clients', () => ({ tokenAggregatorApiClient: {} }));
jest.mock('~/api-clients/token-aggregator', () => ({
  getV2Tokens: jest.fn(),
  postV1TokenLookup: jest.fn(),
}));

const buildRequest = (params: [string, string[]]) => ({
  id: '1',
  method: ExtensionRequest.LOOKUP_NETWORK_TOKENS,
  params,
});

describe('LookupNetworkTokensHandler', () => {
  const lookupTokens = jest.fn();
  const handler = new LookupNetworkTokensHandler({ lookupTokens } as any);

  beforeEach(() => jest.resetAllMocks());

  it('maps looked up tokens with chain id', async () => {
    lookupTokens.mockResolvedValue({
      failedAddresses: ['0xdef'],
      tokens: [
        {
          address: '0xabc',
          name: 'Token',
          symbol: 'TKN',
          decimals: 6,
          contractType: 'ERC-20',
          logoUri: 'https://logo',
          isVerified: null,
        },
      ],
    });

    const result = await handler.handle({
      request: buildRequest(['eip155:43114', ['0xabc']]),
    } as any);

    expect(lookupTokens).toHaveBeenCalledWith('eip155:43114', ['0xabc']);
    expect(result).toMatchObject({
      result: {
        tokens: [
          expect.objectContaining({
            address: '0xabc',
            chainId: 43114,
            caip2Id: 'eip155:43114',
          }),
        ],
        failedAddresses: ['0xdef'],
      },
    });
  });

  it('returns no tokens without calling the service for an empty list', async () => {
    const result = await handler.handle({
      request: buildRequest(['eip155:43114', []]),
    } as any);

    expect(lookupTokens).not.toHaveBeenCalled();
    expect(result).toMatchObject({
      result: { tokens: [], failedAddresses: [] },
    });
  });

  it('reports service failures as errors', async () => {
    lookupTokens.mockRejectedValue(new Error('down'));

    const result = await handler.handle({
      request: buildRequest(['eip155:43114', ['0xabc']]),
    } as any);

    expect(result).toMatchObject({ error: expect.stringContaining('down') });
  });
});
