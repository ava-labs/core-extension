import { AddCustomTokenHandler } from './addCustomToken';

// The handler transitively imports TokenManagerService -> api-clients, whose
// module init resolves AppCheckService; stub the clients module to avoid it.
jest.mock('~/api-clients/clients', () => ({ tokenAggregatorApiClient: {} }));
jest.mock('~/api-clients/token-aggregator', () => ({ getV2Tokens: jest.fn() }));

const network = { chainId: 43114, caipId: 'eip155:43114' };

const buildHandler = () => {
  const settingsService = { addCustomToken: jest.fn() } as any;
  const tokenManagerService = {
    isTokenAvailable: jest.fn().mockResolvedValue(false),
    getTokenData: jest.fn(),
  } as any;
  const networkService = {
    getNetwork: jest.fn().mockResolvedValue(network),
  } as any;

  const handler = new AddCustomTokenHandler(
    settingsService,
    tokenManagerService,
    networkService,
  );

  return { handler, settingsService, tokenManagerService, networkService };
};

const run = (handler: AddCustomTokenHandler, address: string) =>
  handler.handle({
    request: { params: [address] },
    scope: 'eip155:43114',
  } as any);

describe('AddCustomTokenHandler', () => {
  it('rejects a token already listed by the aggregator without reading it on-chain', async () => {
    const { handler, tokenManagerService, settingsService } = buildHandler();
    tokenManagerService.isTokenAvailable.mockResolvedValue(true);

    const result = await run(handler, '0xabc');

    expect(result.error).toContain('already exists');
    expect(tokenManagerService.getTokenData).not.toHaveBeenCalled();
    expect(settingsService.addCustomToken).not.toHaveBeenCalled();
  });

  it('adds an unknown token after reading its on-chain data', async () => {
    const { handler, tokenManagerService, settingsService } = buildHandler();
    const tokenData = {
      address: '0xabc',
      name: 'Token',
      symbol: 'TKN',
      decimals: 18,
      chainId: 43114,
      contractType: 'ERC-20',
    };
    tokenManagerService.getTokenData.mockResolvedValue(tokenData);
    settingsService.addCustomToken.mockResolvedValue(undefined);

    const result = await run(handler, '0xabc');

    expect(result.result).toBe(true);
    expect(settingsService.addCustomToken).toHaveBeenCalledWith(tokenData);
  });

  it('surfaces the settings duplicate-custom-token error', async () => {
    const { handler, tokenManagerService, settingsService } = buildHandler();
    tokenManagerService.getTokenData.mockResolvedValue({ address: '0xabc' });
    settingsService.addCustomToken.mockRejectedValue(
      new Error('Token already exists in the wallet.'),
    );

    const result = await run(handler, '0xabc');

    expect(result.result).toBe(false);
    expect(result.error).toContain('already exists');
  });
});
