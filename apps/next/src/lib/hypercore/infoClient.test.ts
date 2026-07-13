import {
  getHypercoreActivityInfoUrl,
  getHypercoreInfoUrl,
  getSpotMeta,
  getUserAbstraction,
  getUserFills,
  getUserNonFundingLedgerUpdates,
  postInfo,
} from './infoClient';
import { spotMetaResponseSchema, userAbstractionSchema } from './schemas';

const mockJsonResponse = (
  body: unknown,
  init?: { ok?: boolean; status?: number; statusText?: string },
) => ({
  ok: init?.ok ?? true,
  status: init?.status ?? 200,
  statusText: init?.statusText ?? 'OK',
  json: jest.fn().mockResolvedValue(body),
});

describe('hypercore infoClient', () => {
  const originalProxyUrl = process.env.PROXY_URL;
  const originalFetch = global.fetch;

  beforeEach(() => {
    process.env.PROXY_URL = 'https://proxy.test';
    global.fetch = jest.fn();
  });

  afterAll(() => {
    process.env.PROXY_URL = originalProxyUrl;
    global.fetch = originalFetch;
  });

  it('builds the NowNodes Hyperliquid info URL', () => {
    expect(getHypercoreInfoUrl()).toBe(
      'https://proxy.test/proxy/nownodes/hype/info',
    );
  });

  it('builds the direct Hyperliquid activity info URL', () => {
    expect(getHypercoreActivityInfoUrl()).toBe(
      'https://api.hyperliquid.xyz/info',
    );
  });

  it('posts JSON and validates the response with the provided schema', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      mockJsonResponse({ tokens: [] }),
    );

    const result = await postInfo({ type: 'spotMeta' }, spotMetaResponseSchema);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://proxy.test/proxy/nownodes/hype/info',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ type: 'spotMeta' }),
      }),
    );
    expect(result).toEqual({ tokens: [] });
  });

  it('throws when the HTTP response is not ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      mockJsonResponse('nope', {
        ok: false,
        status: 502,
        statusText: 'Bad Gateway',
      }),
    );

    await expect(
      postInfo({ type: 'spotMeta' }, spotMetaResponseSchema),
    ).rejects.toThrow('Hyperliquid /info failed: 502 Bad Gateway');
  });

  it('throws when response JSON fails schema validation', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      mockJsonResponse({ tokens: 'bad' }),
    );

    await expect(
      postInfo({ type: 'spotMeta' }, spotMetaResponseSchema),
    ).rejects.toThrow();
  });

  it('lowercases the user address for typed helpers', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      mockJsonResponse('unifiedAccount'),
    );

    await expect(
      getUserAbstraction('0xABCDEFABCDEFABCDEFABCDEFABCDEFABCDEFABCD'),
    ).resolves.toBe('unifiedAccount');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://proxy.test/proxy/nownodes/hype/info',
      expect.objectContaining({
        body: JSON.stringify({
          type: 'userAbstraction',
          user: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
        }),
      }),
    );
  });

  it('parses userAbstraction through getUserAbstraction', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      mockJsonResponse('weird-new-mode'),
    );

    await expect(getUserAbstraction('0xabc')).resolves.toBe('default');
    expect(userAbstractionSchema.parse('weird-new-mode')).toBe('default');
  });

  it('exposes getSpotMeta as a typed wrapper', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      mockJsonResponse({
        tokens: [{ name: 'USDC', index: 0, weiDecimals: 8 }],
      }),
    );

    const result = await getSpotMeta();
    expect(result.tokens[0]?.name).toBe('USDC');
  });

  it('routes userFills to the direct Hyperliquid API', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(mockJsonResponse([]));

    await getUserFills('0xABCDEFABCDEFABCDEFABCDEFABCDEFABCDEFABCD');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.hyperliquid.xyz/info',
      expect.objectContaining({
        body: JSON.stringify({
          type: 'userFills',
          user: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
        }),
      }),
    );
  });

  it('routes userNonFundingLedgerUpdates to the direct Hyperliquid API', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(mockJsonResponse([]));

    await getUserNonFundingLedgerUpdates(
      '0xABCDEFABCDEFABCDEFABCDEFABCDEFABCDEFABCD',
      0,
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.hyperliquid.xyz/info',
      expect.objectContaining({
        body: JSON.stringify({
          type: 'userNonFundingLedgerUpdates',
          user: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          startTime: 0,
        }),
      }),
    );
  });
});
