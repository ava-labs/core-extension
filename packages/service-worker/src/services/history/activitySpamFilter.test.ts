import {
  TokenType,
  TransactionType,
  type Transaction,
} from '@avalabs/vm-module-types';

import {
  isSpamTransaction,
  filterSpamTransactions,
  ACTIVITY_MIN_USD_VALUE,
  TOKEN_QUANTITY_THRESHOLDS,
  type TokenPriceMap,
} from './activitySpamFilter';

function makeTx(
  overrides: Partial<Transaction> = {},
  tokenOverrides: Partial<Transaction['tokens'][number]> = {},
): Transaction {
  return {
    isContractCall: false,
    isIncoming: false,
    isOutgoing: true,
    isSender: true,
    timestamp: Date.now(),
    hash: '0xabc',
    from: '0xsender',
    to: '0xreceiver',
    tokens: [
      {
        name: 'TestToken',
        symbol: 'TEST',
        amount: '1',
        type: TokenType.ERC20,
        address: '0xtesttoken',
        ...tokenOverrides,
      },
    ],
    gasUsed: '21000',
    explorerLink: 'https://explorer.test/tx/0xabc',
    chainId: 'eip155:43114',
    ...overrides,
  } as Transaction;
}

describe('activitySpamFilter', () => {
  describe('isSpamTransaction', () => {
    const emptyPrices: TokenPriceMap = new Map();

    it('keeps transactions with no tokens (contract calls)', () => {
      const tx = makeTx({ tokens: [] });
      expect(isSpamTransaction(tx, emptyPrices)).toBe(false);
    });

    it('keeps NFT transactions (ERC721)', () => {
      const tx = makeTx({}, { type: TokenType.ERC721, address: '0xnft' });
      expect(isSpamTransaction(tx, emptyPrices)).toBe(false);
    });

    it('keeps NFT transactions (ERC1155)', () => {
      const tx = makeTx({}, { type: TokenType.ERC1155, address: '0xnft' });
      expect(isSpamTransaction(tx, emptyPrices)).toBe(false);
    });

    it('keeps approval transactions regardless of amount', () => {
      const tx = makeTx(
        { txType: TransactionType.APPROVE },
        { amount: '0.000001' },
      );
      expect(isSpamTransaction(tx, emptyPrices)).toBe(false);
    });

    describe('price-based filtering', () => {
      it('filters transactions below $0.01 USD', () => {
        const prices: TokenPriceMap = new Map([['0xtesttoken', 0.5]]);
        const tx = makeTx({}, { amount: '0.01', address: '0xtesttoken' });

        // 0.5 * 0.01 = 0.005 < 0.01
        expect(isSpamTransaction(tx, prices)).toBe(true);
      });

      it('keeps transactions at exactly $0.01 USD', () => {
        const prices: TokenPriceMap = new Map([['0xtesttoken', 1]]);
        const tx = makeTx({}, { amount: '0.01', address: '0xtesttoken' });

        // 1 * 0.01 = 0.01, not < 0.01
        expect(isSpamTransaction(tx, prices)).toBe(false);
      });

      it('keeps transactions above $0.01 USD', () => {
        const prices: TokenPriceMap = new Map([['0xtesttoken', 10]]);
        const tx = makeTx({}, { amount: '1', address: '0xtesttoken' });

        // 10 * 1 = 10
        expect(isSpamTransaction(tx, prices)).toBe(false);
      });

      it('uses absolute value for incoming/outgoing amounts', () => {
        const prices: TokenPriceMap = new Map([['0xtesttoken', 0.5]]);
        const tx = makeTx({}, { amount: '-0.01', address: '0xtesttoken' });

        // |0.5 * -0.01| = 0.005 < 0.01
        expect(isSpamTransaction(tx, prices)).toBe(true);
      });

      it('handles native token price lookup', () => {
        const prices: TokenPriceMap = new Map([['NATIVE-avax', 25]]);
        const tx = makeTx(
          {},
          { type: TokenType.NATIVE, symbol: 'AVAX', amount: '0.0001' },
        );

        // 25 * 0.0001 = 0.0025 < 0.01
        expect(isSpamTransaction(tx, prices)).toBe(true);
      });

      it('keeps native token transactions above threshold', () => {
        const prices: TokenPriceMap = new Map([['NATIVE-avax', 25]]);
        const tx = makeTx(
          {},
          { type: TokenType.NATIVE, symbol: 'AVAX', amount: '1' },
        );

        // 25 * 1 = 25
        expect(isSpamTransaction(tx, prices)).toBe(false);
      });
    });

    describe('quantity threshold fallback', () => {
      it('filters AVAX below quantity threshold when no price', () => {
        const tx = makeTx(
          {},
          { type: TokenType.NATIVE, symbol: 'AVAX', amount: '0.0001' },
        );

        // AVAX threshold is 0.001, 0.0001 < 0.001
        expect(isSpamTransaction(tx, emptyPrices)).toBe(true);
      });

      it('keeps AVAX above quantity threshold when no price', () => {
        const tx = makeTx(
          {},
          { type: TokenType.NATIVE, symbol: 'AVAX', amount: '0.01' },
        );

        // AVAX threshold is 0.001, 0.01 >= 0.001
        expect(isSpamTransaction(tx, emptyPrices)).toBe(false);
      });

      it('filters ERC20 below quantity threshold when no price', () => {
        const usdcAddress = '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E';
        const tx = makeTx(
          {},
          { type: TokenType.ERC20, address: usdcAddress, amount: '0.001' },
        );

        // USDC threshold is 0.01, 0.001 < 0.01
        expect(isSpamTransaction(tx, emptyPrices)).toBe(true);
      });

      it('uses case-insensitive address matching for thresholds', () => {
        const usdcUpperCase = '0xB97EF9EF8734C71904D8002F8B6BC66DD9C48A6E';
        const tx = makeTx(
          {},
          { type: TokenType.ERC20, address: usdcUpperCase, amount: '0.001' },
        );

        expect(isSpamTransaction(tx, emptyPrices)).toBe(true);
      });
    });

    describe('unknown tokens (no price, no threshold)', () => {
      it('keeps unknown tokens even with tiny amounts', () => {
        const tx = makeTx(
          {},
          {
            type: TokenType.ERC20,
            address: '0xunknowntoken',
            amount: '0.000001',
          },
        );

        expect(isSpamTransaction(tx, emptyPrices)).toBe(false);
      });
    });

    it('skips price-based check when price is null', () => {
      const prices: TokenPriceMap = new Map([['0xtesttoken', null]]);
      const tx = makeTx({}, { amount: '0.000001', address: '0xtesttoken' });

      // No price available, token not in thresholds → keep
      expect(isSpamTransaction(tx, prices)).toBe(false);
    });

    it('skips price-based check when price is zero', () => {
      const prices: TokenPriceMap = new Map([['0xtesttoken', 0]]);
      const tx = makeTx({}, { amount: '0.000001', address: '0xtesttoken' });

      expect(isSpamTransaction(tx, prices)).toBe(false);
    });
  });

  describe('filterSpamTransactions', () => {
    it('removes spam and keeps valid transactions', () => {
      const prices: TokenPriceMap = new Map([
        ['0xspam', 0.001],
        ['0xlegit', 100],
      ]);

      const spam = makeTx({}, { address: '0xspam', amount: '1' });
      const legit = makeTx({}, { address: '0xlegit', amount: '1' });

      // 0.001 * 1 = 0.001 < 0.01 (spam)
      // 100 * 1 = 100 (legit)
      const result = filterSpamTransactions([spam, legit], prices);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(legit);
    });

    it('returns empty array when all are spam', () => {
      const prices: TokenPriceMap = new Map([['0xspam', 0.001]]);

      const spam1 = makeTx({ hash: '0x1' }, { address: '0xspam', amount: '1' });
      const spam2 = makeTx(
        { hash: '0x2' },
        { address: '0xspam', amount: '0.5' },
      );

      const result = filterSpamTransactions([spam1, spam2], prices);

      expect(result).toHaveLength(0);
    });

    it('returns all when none are spam', () => {
      const prices: TokenPriceMap = new Map([['0xlegit', 100]]);

      const tx1 = makeTx({ hash: '0x1' }, { address: '0xlegit', amount: '1' });
      const tx2 = makeTx({ hash: '0x2' }, { address: '0xlegit', amount: '5' });

      const result = filterSpamTransactions([tx1, tx2], prices);

      expect(result).toHaveLength(2);
    });
  });

  describe('constants', () => {
    it('ACTIVITY_MIN_USD_VALUE is $0.01', () => {
      expect(ACTIVITY_MIN_USD_VALUE).toBe(0.01);
    });

    it('TOKEN_QUANTITY_THRESHOLDS includes all expected tokens', () => {
      expect(TOKEN_QUANTITY_THRESHOLDS['native']).toBe(0.001);
      expect(
        TOKEN_QUANTITY_THRESHOLDS['0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e'],
      ).toBe(0.01);
      expect(
        TOKEN_QUANTITY_THRESHOLDS['0x152b9d0fdc40c096757f570a51e494bd4b943e50'],
      ).toBe(0.000000014);
    });
  });
});
