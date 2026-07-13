import { fetchHypercoreActivity } from './fetchHypercoreActivity';

jest.mock('../infoClient', () => ({
  getUserFills: jest.fn(),
  getUserNonFundingLedgerUpdates: jest.fn(),
}));

import { getUserFills, getUserNonFundingLedgerUpdates } from '../infoClient';

describe('fetchHypercoreActivity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('pages ledger updates forward until empty and sorts newest first', async () => {
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
          time: 100,
          hash: '0x1',
          delta: { type: 'deposit', usdc: '1' },
        },
        {
          time: 200,
          hash: '0x2',
          delta: { type: 'withdraw', usdc: '1' },
        },
      ])
      .mockResolvedValueOnce([
        {
          time: 300,
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
      0,
    );
    expect(getUserNonFundingLedgerUpdates).toHaveBeenNthCalledWith(
      2,
      '0xabc',
      201,
    );
    expect(getUserNonFundingLedgerUpdates).toHaveBeenNthCalledWith(
      3,
      '0xabc',
      301,
    );

    expect(items.map((item) => item.hash)).toEqual([
      '0xfill',
      '0x3',
      '0x2',
      '0x1',
    ]);
  });

  it('stops pagination when startTime does not advance', async () => {
    jest.mocked(getUserFills).mockResolvedValue([]);
    jest.mocked(getUserNonFundingLedgerUpdates).mockResolvedValue([
      {
        time: 5,
        hash: '0xstuck',
        delta: { type: 'deposit', usdc: '1' },
      },
    ]);

    const items = await fetchHypercoreActivity('0xabc');

    // First page startTime=0 → next=6; second page returns time=5 → next=6 <= 6.
    expect(getUserNonFundingLedgerUpdates).toHaveBeenCalledTimes(2);
    expect(items).toHaveLength(2);
  });
});
