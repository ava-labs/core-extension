import {
  clearinghouseStateSchema,
  hypercoreLedgerUpdatesSchema,
  spotClearinghouseStateSchema,
  spotMetaResponseSchema,
  userAbstractionSchema,
  userFillsSchema,
} from './schemas';

describe('hypercore schemas', () => {
  describe('spotMetaResponseSchema', () => {
    it('parses spotMeta tokens', () => {
      const parsed = spotMetaResponseSchema.parse({
        tokens: [
          {
            name: 'USDC',
            index: 0,
            weiDecimals: 8,
            fullName: 'USD Coin',
            evmContract: { address: '0xabc' },
          },
          {
            name: 'PURR',
            index: 5,
            weiDecimals: 6,
          },
        ],
      });

      expect(parsed.tokens).toHaveLength(2);
      expect(parsed.tokens[0]?.fullName).toBe('USD Coin');
      expect(parsed.tokens[1]?.evmContract).toBeUndefined();
    });

    it('rejects malformed spotMeta', () => {
      expect(() => spotMetaResponseSchema.parse({ tokens: 'nope' })).toThrow();
    });
  });

  describe('spotClearinghouseStateSchema', () => {
    it('parses balances and coerces string token indices', () => {
      const parsed = spotClearinghouseStateSchema.parse({
        balances: [
          { coin: 'USDC', token: '0', total: '10', hold: '0' },
          { coin: 'PURR', token: 5, total: '1.5', hold: '0.1' },
        ],
      });

      expect(parsed.balances[0]?.token).toBe(0);
      expect(parsed.balances[1]?.token).toBe(5);
    });

    it('parses empty balances', () => {
      expect(spotClearinghouseStateSchema.parse({ balances: [] })).toEqual({
        balances: [],
      });
    });
  });

  describe('clearinghouseStateSchema', () => {
    it('parses margin summary and unrealized PnL positions', () => {
      const parsed = clearinghouseStateSchema.parse({
        assetPositions: [
          { type: 'oneWay', position: { unrealizedPnl: '10', coin: 'ETH' } },
        ],
        crossMarginSummary: { accountValue: '50' },
        marginSummary: { accountValue: '50' },
        withdrawable: '40',
      });

      expect(parsed.crossMarginSummary.accountValue).toBe('50');
      expect(parsed.assetPositions[0]?.position.unrealizedPnl).toBe('10');
    });
  });

  describe('userAbstractionSchema', () => {
    it('keeps known modes', () => {
      expect(userAbstractionSchema.parse('unifiedAccount')).toBe(
        'unifiedAccount',
      );
      expect(userAbstractionSchema.parse('default')).toBe('default');
      expect(userAbstractionSchema.parse('disabled')).toBe('disabled');
    });

    it('coerces unknown modes to default', () => {
      expect(userAbstractionSchema.parse('futureMode')).toBe('default');
    });
  });

  describe('userFillsSchema', () => {
    it('parses fill rows', () => {
      const parsed = userFillsSchema.parse([
        {
          closedPnl: '0',
          coin: 'ETH',
          crossed: true,
          dir: 'Open Long',
          hash: '0xhash',
          oid: 1,
          px: '2000',
          side: 'B',
          startPosition: '0',
          sz: '0.1',
          time: 1_700_000_000_000,
          fee: '0.01',
          tid: 99,
        },
      ]);

      expect(parsed[0]?.coin).toBe('ETH');
      expect(parsed[0]?.tid).toBe(99);
    });
  });

  describe('hypercoreLedgerUpdatesSchema', () => {
    it('parses ledger updates with permissive deltas', () => {
      const parsed = hypercoreLedgerUpdatesSchema.parse([
        {
          time: 1_700_000_000,
          hash: '0x1',
          delta: { type: 'deposit', usdc: '5' },
        },
        {
          time: 1_700_000_001,
          hash: '0x2',
          delta: { type: 'unknownFutureType', amount: '1', token: 'PURR' },
        },
      ]);

      expect(parsed).toHaveLength(2);
      expect(parsed[1]?.delta.type).toBe('unknownFutureType');
    });
  });
});
