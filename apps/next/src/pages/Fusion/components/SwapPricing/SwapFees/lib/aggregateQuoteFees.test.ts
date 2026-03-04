import { Quote, TokenType } from '@avalabs/unified-asset-transfer';
import { TokenType as VmTokenType } from '@avalabs/vm-module-types';

import { FungibleTokenBalance } from '@core/types';

import { aggregateQuoteFees } from './aggregateQuoteFees';

const createMockToken = (
  overrides: Partial<FungibleTokenBalance> = {},
): FungibleTokenBalance =>
  ({
    type: VmTokenType.NATIVE,
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18,
    balance: 1000000000000000000n,
    balanceInCurrency: 100,
    priceInCurrency: 100,
    chainCaipId: 'eip155:43114',
    ...overrides,
  }) as FungibleTokenBalance;

const createMockERC20Token = (
  address: string,
  overrides: Partial<FungibleTokenBalance> = {},
): FungibleTokenBalance =>
  ({
    type: VmTokenType.ERC20,
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    balance: 1000000n,
    balanceInCurrency: 1,
    priceInCurrency: 1,
    chainCaipId: 'eip155:43114',
    address,
    ...overrides,
  }) as FungibleTokenBalance;

const CHAIN_ID = 'eip155:43114';
const CHAIN_ID_2 = 'eip155:1';

describe('aggregateQuoteFees', () => {
  describe('empty fees', () => {
    it('returns zero fiat amount and empty token amounts for quote with no fees', () => {
      const quote = { fees: [] } as unknown as Quote;
      const tokenLookup = {};

      const result = aggregateQuoteFees(quote, tokenLookup);

      expect(result.amountInFiatCurrency).toBe(0);
      expect(result.tokenAmounts).toEqual([]);
    });
  });

  describe('single fee', () => {
    it('calculates fiat amount for native token fee', () => {
      const nativeToken = createMockToken({ priceInCurrency: 50 });
      const quote = {
        fees: [
          {
            chainId: CHAIN_ID,
            amount: 2000000000000000000n, // 2 AVAX
            token: { type: TokenType.NATIVE },
          },
        ],
      } as unknown as Quote;
      const tokenLookup = { [CHAIN_ID]: [nativeToken] };

      const result = aggregateQuoteFees(quote, tokenLookup);

      expect(result.amountInFiatCurrency).toBe(100); // 2 AVAX * $50
      expect(result.tokenAmounts).toHaveLength(1);
      expect(result.tokenAmounts[0]?.token).toBe(nativeToken);
      expect(result.tokenAmounts[0]?.amount).toBe(2000000000000000000n);
    });

    it('calculates fiat amount for ERC20 token fee', () => {
      const usdcAddress = '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E';
      const usdcToken = createMockERC20Token(usdcAddress, {
        priceInCurrency: 1,
        decimals: 6,
      });
      const quote = {
        fees: [
          {
            chainId: CHAIN_ID,
            amount: 5000000n, // 5 USDC
            token: { type: TokenType.ERC20, address: usdcAddress },
          },
        ],
      } as unknown as Quote;
      const tokenLookup = { [CHAIN_ID]: [usdcToken] };

      const result = aggregateQuoteFees(quote, tokenLookup);

      expect(result.amountInFiatCurrency).toBe(5); // 5 USDC * $1
      expect(result.tokenAmounts).toHaveLength(1);
      expect(result.tokenAmounts[0]?.amount).toBe(5000000n);
    });
  });

  describe('multiple fees', () => {
    it('aggregates fees from different tokens', () => {
      const nativeToken = createMockToken({ priceInCurrency: 50 });
      const usdcAddress = '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E';
      const usdcToken = createMockERC20Token(usdcAddress, {
        priceInCurrency: 1,
      });

      const quote = {
        fees: [
          {
            chainId: CHAIN_ID,
            amount: 1000000000000000000n, // 1 AVAX
            token: { type: TokenType.NATIVE },
          },
          {
            chainId: CHAIN_ID,
            amount: 10000000n, // 10 USDC
            token: { type: TokenType.ERC20, address: usdcAddress },
          },
        ],
      } as unknown as Quote;
      const tokenLookup = { [CHAIN_ID]: [nativeToken, usdcToken] };

      const result = aggregateQuoteFees(quote, tokenLookup);

      expect(result.amountInFiatCurrency).toBe(60); // 1 AVAX * $50 + 10 USDC * $1
      expect(result.tokenAmounts).toHaveLength(2);
    });

    it('aggregates fees from different chains', () => {
      const avaxToken = createMockToken({
        priceInCurrency: 50,
        chainCaipId: CHAIN_ID,
      });
      const ethToken = createMockToken({
        name: 'Ethereum',
        symbol: 'ETH',
        priceInCurrency: 3000,
        chainCaipId: CHAIN_ID_2,
      });

      const quote = {
        fees: [
          {
            chainId: CHAIN_ID,
            amount: 1000000000000000000n, // 1 AVAX
            token: { type: TokenType.NATIVE },
          },
          {
            chainId: CHAIN_ID_2,
            amount: 100000000000000000n, // 0.1 ETH
            token: { type: TokenType.NATIVE },
          },
        ],
      } as unknown as Quote;
      const tokenLookup = {
        [CHAIN_ID]: [avaxToken],
        [CHAIN_ID_2]: [ethToken],
      };

      const result = aggregateQuoteFees(quote, tokenLookup);

      expect(result.amountInFiatCurrency).toBe(350); // 1 AVAX * $50 + 0.1 ETH * $3000
      expect(result.tokenAmounts).toHaveLength(2);
    });

    it('merges amounts for same token across multiple fees', () => {
      const nativeToken = createMockToken({ priceInCurrency: 50 });

      const quote = {
        fees: [
          {
            chainId: CHAIN_ID,
            amount: 1000000000000000000n, // 1 AVAX
            token: { type: TokenType.NATIVE },
          },
          {
            chainId: CHAIN_ID,
            amount: 500000000000000000n, // 0.5 AVAX
            token: { type: TokenType.NATIVE },
          },
        ],
      } as unknown as Quote;
      const tokenLookup = { [CHAIN_ID]: [nativeToken] };

      const result = aggregateQuoteFees(quote, tokenLookup);

      expect(result.amountInFiatCurrency).toBe(75); // 1.5 AVAX * $50
      expect(result.tokenAmounts).toHaveLength(1);
      expect(result.tokenAmounts[0]?.amount).toBe(1500000000000000000n);
    });
  });

  describe('missing token data', () => {
    it('skips fiat calculation when token not found in lookup', () => {
      const quote = {
        fees: [
          {
            chainId: CHAIN_ID,
            amount: 1000000000000000000n,
            token: { type: TokenType.NATIVE },
          },
        ],
      } as unknown as Quote;
      const tokenLookup = {}; // Empty lookup

      const result = aggregateQuoteFees(quote, tokenLookup);

      expect(result.amountInFiatCurrency).toBe(0);
      expect(result.tokenAmounts).toEqual([]);
    });

    it('skips fiat calculation when token has no price', () => {
      const tokenWithoutPrice = createMockToken({
        priceInCurrency: undefined,
      });

      const quote = {
        fees: [
          {
            chainId: CHAIN_ID,
            amount: 1000000000000000000n,
            token: { type: TokenType.NATIVE },
          },
        ],
      } as unknown as Quote;
      const tokenLookup = { [CHAIN_ID]: [tokenWithoutPrice] };

      const result = aggregateQuoteFees(quote, tokenLookup);

      expect(result.amountInFiatCurrency).toBe(0);
      expect(result.tokenAmounts).toHaveLength(1);
      expect(result.tokenAmounts[0]?.amount).toBe(1000000000000000000n);
    });

    it('skips fiat calculation when token price is zero', () => {
      const tokenWithZeroPrice = createMockToken({ priceInCurrency: 0 });

      const quote = {
        fees: [
          {
            chainId: CHAIN_ID,
            amount: 1000000000000000000n,
            token: { type: TokenType.NATIVE },
          },
        ],
      } as unknown as Quote;
      const tokenLookup = { [CHAIN_ID]: [tokenWithZeroPrice] };

      const result = aggregateQuoteFees(quote, tokenLookup);

      expect(result.amountInFiatCurrency).toBe(0);
      expect(result.tokenAmounts).toHaveLength(1);
    });

    it('handles chain not present in lookup', () => {
      const quote = {
        fees: [
          {
            chainId: 'eip155:999999', // Unknown chain
            amount: 1000000000000000000n,
            token: { type: TokenType.NATIVE },
          },
        ],
      } as unknown as Quote;
      const tokenLookup = { [CHAIN_ID]: [createMockToken()] };

      const result = aggregateQuoteFees(quote, tokenLookup);

      expect(result.amountInFiatCurrency).toBe(0);
      expect(result.tokenAmounts).toEqual([]);
    });
  });

  describe('mixed scenarios', () => {
    it('calculates partial fiat amount when some tokens have prices and others do not', () => {
      const avaxToken = createMockToken({ priceInCurrency: 50 });
      const unknownToken = createMockERC20Token(
        '0x1234567890123456789012345678901234567890',
        { priceInCurrency: undefined, symbol: 'UNKNOWN' },
      );

      const quote = {
        fees: [
          {
            chainId: CHAIN_ID,
            amount: 1000000000000000000n, // 1 AVAX
            token: { type: TokenType.NATIVE },
          },
          {
            chainId: CHAIN_ID,
            amount: 1000000n,
            token: {
              type: TokenType.ERC20,
              address: '0x1234567890123456789012345678901234567890',
            },
          },
        ],
      } as unknown as Quote;
      const tokenLookup = { [CHAIN_ID]: [avaxToken, unknownToken] };

      const result = aggregateQuoteFees(quote, tokenLookup);

      expect(result.amountInFiatCurrency).toBe(50); // Only AVAX contributes
      expect(result.tokenAmounts).toHaveLength(2); // Both tokens tracked
    });
  });
});
