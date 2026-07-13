import {
  fetchHypercoreActivity,
  LEDGER_LOOKBACK_MS,
  MAX_LEDGER_PAGES,
} from './fetchHypercoreActivity';

jest.mock('../infoClient', () => ({
  getUserFills: jest.fn(),
  getUserNonFundingLedgerUpdates: jest.fn(),
}));

import { getUserFills, getUserNonFundingLedgerUpdates } from '../infoClient';

describe('fetchHypercoreActivity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('pages ledger updates forward from lookback until empty and sorts newest first', async () => {
    const lookbackStart = 1_700_000_000_000 - LEDGER_LOOKBACK_MS;
    jest.mocked(getUserFills).mockResolvedValue([
      {
        closedPnl: '0',
        coin: 'ETH',
        crossed: true,
        dir: 'Open Long',
        hash: '0xfill',
        oid: 1,
        px: '1',
        side: 'B',
        startPosition: '0',
        sz: '1',
        time: 1_000,
      },
    ]);
    jest
      .mocked(getUserNonFundingLedgerUpdates)
      .mockResolvedValueOnce([
        {
          time: lookbackStart + 100,
          hash: '0x1',
          delta: { type: 'deposit', usdc: '1' },
        },
        {
          time: lookbackStart + 200,
          hash: '0x2',
          delta: { type: 'withdraw', usdc: '1' },
        },
      ])
      .mockResolvedValueOnce([
        {
          time: lookbackStart + 300,
          hash: '0x3',
          delta: { type: 'deposit', usdc: '2' },
        },
      ])
      .mockResolvedValueOnce([]);

    const items = await fetchHypercoreActivity('0xabc');

    expect(getUserNonFundingLedgerUpdates).toHaveBeenCalledTimes(3);
    expect(getUserNonFundingLedgerUpdates).toHaveBeenNthCalledWith(
      1,
      '0xabc',
      lookbackStart,
      undefined,
    );
    expect(getUserNonFundingLedgerUpdates).toHaveBeenNthCalledWith(
      2,
      '0xabc',
      lookbackStart + 201,
      undefined,
    );
    expect(getUserNonFundingLedgerUpdates).toHaveBeenNthCalledWith(
      3,
      '0xabc',
      lookbackStart + 301,
      undefined,
    );

    expect(items.map((item) => item.hash)).toEqual([
      '0x3',
      '0x2',
      '0x1',
      '0xfill',
    ]);
  });

  it('stops pagination when startTime does not advance', async () => {
    const lookbackStart = 1_700_000_000_000 - LEDGER_LOOKBACK_MS;
    jest.mocked(getUserFills).mockResolvedValue([]);
    jest.mocked(getUserNonFundingLedgerUpdates).mockResolvedValue([
      {
        time: lookbackStart + 5,
        hash: '0xstuck',
        delta: { type: 'deposit', usdc: '1' },
      },
    ]);

    const items = await fetchHypercoreActivity('0xabc');

    // First page → next = lookbackStart+6; second page returns same time → next <= startTime.
    expect(getUserNonFundingLedgerUpdates).toHaveBeenCalledTimes(2);
    expect(items).toHaveLength(2);
  });

  it('caps ledger pagination at MAX_LEDGER_PAGES', async () => {
    const lookbackStart = 1_700_000_000_000 - LEDGER_LOOKBACK_MS;
    jest.mocked(getUserFills).mockResolvedValue([]);
    jest
      .mocked(getUserNonFundingLedgerUpdates)
      .mockImplementation(async (_user, startTime) => [
        {
          time: startTime + 1,
          hash: `0x${startTime}`,
          delta: { type: 'deposit', usdc: '1' },
        },
      ]);

    const items = await fetchHypercoreActivity('0xabc');

    expect(getUserNonFundingLedgerUpdates).toHaveBeenCalledTimes(
      MAX_LEDGER_PAGES,
    );
    expect(items).toHaveLength(MAX_LEDGER_PAGES);
    expect(getUserNonFundingLedgerUpdates).toHaveBeenNthCalledWith(
      1,
      '0xabc',
      lookbackStart,
      undefined,
    );
  });

  it('soft-fails when fills fail but ledger succeeds', async () => {
    jest.mocked(getUserFills).mockRejectedValue(new Error('fills down'));
    jest
      .mocked(getUserNonFundingLedgerUpdates)
      .mockResolvedValueOnce([
        {
          time: 1_700_000_000_000 - LEDGER_LOOKBACK_MS + 50,
          hash: '0xledger',
          delta: { type: 'deposit', usdc: '1' },
        },
      ])
      .mockResolvedValueOnce([]);

    const items = await fetchHypercoreActivity('0xabc');

    expect(items).toHaveLength(1);
    expect(items[0]?.hash).toBe('0xledger');
  });

  it('soft-fails when ledger fails but fills succeed', async () => {
    jest.mocked(getUserFills).mockResolvedValue([
      {
        closedPnl: '0',
        coin: 'ETH',
        crossed: true,
        dir: 'Open Long',
        hash: '0xfill',
        oid: 1,
        px: '1',
        side: 'B',
        startPosition: '0',
        sz: '1',
        time: 2_000,
      },
    ]);
    jest
      .mocked(getUserNonFundingLedgerUpdates)
      .mockRejectedValue(new Error('ledger down'));

    const items = await fetchHypercoreActivity('0xabc');

    expect(items).toHaveLength(1);
    expect(items[0]?.hash).toBe('0xfill');
  });

  it('threads AbortSignal and rethrows abort errors', async () => {
    const controller = new AbortController();
    controller.abort();
    jest
      .mocked(getUserFills)
      .mockRejectedValue(
        new DOMException('The operation was aborted.', 'AbortError'),
      );
    jest.mocked(getUserNonFundingLedgerUpdates).mockResolvedValue([]);

    await expect(
      fetchHypercoreActivity('0xabc', { signal: controller.signal }),
    ).rejects.toMatchObject({ name: 'AbortError' });
  });
});
