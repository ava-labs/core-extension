import { useDisplayTokenList } from './useDisplayTokenList';
import { act, renderHook } from '@testing-library/react';
import { TokenType, TokenWithBalance } from '@avalabs/vm-module-types';

const AVAX: TokenWithBalance = {
  name: 'Avalanche',
  symbol: 'AVAX',
  balance: 5759363806986223209n,
  balanceInCurrency: 139.77,
  type: TokenType.NATIVE,
  balanceDisplayValue: '5.75.77',
  balancePerType: {},
  decimals: 18,
  coingeckoId: 'avalanche-2',
};
const YAY_GAMES: TokenWithBalance = {
  name: 'YAY Games',
  symbol: 'YAY',
  balance: 35000000000000000000n,
  balanceInCurrency: 0.02,
  type: TokenType.ERC20,
  address: '0x0000000000000000000000000000000000000000',
  balanceDisplayValue: '0.35',
  decimals: 18,
  reputation: null,
};
const BTC_B: TokenWithBalance = {
  name: 'Bitcoin',
  symbol: 'BTC.b',
  balance: 16434n,
  balanceInCurrency: 16.84,
  type: TokenType.ERC20,
  address: '0x0000000000000000000000000000000000000000',
  balanceDisplayValue: '0.000016434',
  decimals: 18,
  reputation: null,
};
const YETISWAP: TokenWithBalance = {
  name: 'YetiSwap',
  symbol: 'YTS',
  balance: 16999998305799245218430n,
  balanceInCurrency: 13.57,
  type: TokenType.ERC20,
  address: '0x0000000000000000000000000000000000000000',
  balanceDisplayValue: '0.016',
  decimals: 18,
  reputation: null,
};
const WRAPPED_ETH: TokenWithBalance = {
  name: 'Wrapped ETH',
  symbol: 'WETH.e',
  balance: 206776540386356860n,
  balanceInCurrency: 500.8,
  type: TokenType.ERC20,
  address: '0x0000000000000000000000000000000000000000',
  balanceDisplayValue: '0.2',
  decimals: 18,
  reputation: null,
};
const JEWELS: TokenWithBalance = {
  name: 'Jewels',
  symbol: 'JEWEL',
  balance: 33982989227679224842n,
  balanceInCurrency: 1.62,
  type: TokenType.ERC20,
  address: '0x0000000000000000000000000000000000000000',
  balanceDisplayValue: '3.3',
  decimals: 18,
  reputation: null,
};
const DEXALOT: TokenWithBalance = {
  name: 'Dexalot',
  symbol: 'ALOT',
  balance: 33982989227679224842n,
  balanceInCurrency: 1.62,
  type: TokenType.ERC20,
  address: '0x0000000000000000000000000000000000000000',
  balanceDisplayValue: '3.3',
  decimals: 18,
  reputation: null,
};
const LP_INSUR_B: TokenWithBalance = {
  name: 'LPTokenINSUR B',
  symbol: 'LPTokenINSUR B',
  balance: 5000n,
  type: TokenType.ERC20,
  address: '0x0000000000000000000000000000000000000000',
  balanceDisplayValue: '0.05',
  decimals: 18,
  reputation: null,
};
const LP_INSUR_A: TokenWithBalance = {
  name: 'LPTokenINSUR A',
  symbol: 'LPTokenINSUR A',
  balance: 10000000n,
  type: TokenType.ERC20,
  address: '0x0000000000000000000000000000000000000000',
  balanceDisplayValue: '1',
  decimals: 18,
  reputation: null,
};
const CHAINLINK: TokenWithBalance = {
  name: 'ChainLink Token',
  symbol: 'LINK.e',
  balance: 598743016848865911n,
  balanceInCurrency: 9.82,
  type: TokenType.ERC20,

  address: '0x0000000000000000000000000000000000000000',
  balanceDisplayValue: '59.87',
  decimals: 18,
  reputation: null,
};
const PANGOLIN: TokenWithBalance = {
  name: 'Pangolin',
  symbol: 'PNG',
  balance: 16219781798102139248n,
  balanceInCurrency: 9.82,
  type: TokenType.ERC20,
  address: '0x0000000000000000000000000000000000000000',
  balanceDisplayValue: '1.62',
  decimals: 18,
  reputation: null,
};
const USDC: TokenWithBalance = {
  name: 'USD Coin',
  symbol: 'USDC.e',
  balance: 1728233n,
  balanceInCurrency: 1.72,
  type: TokenType.ERC20,
  address: '0x0000000000000000000000000000000000000000',
  balanceDisplayValue: '1.72',
  decimals: 18,
  reputation: null,
};

const TOKENS: TokenWithBalance[] = [
  AVAX,
  YAY_GAMES,
  BTC_B,
  YETISWAP,
  WRAPPED_ETH,
  JEWELS,
  DEXALOT,
  LP_INSUR_A,
  LP_INSUR_B,
  CHAINLINK,
  PANGOLIN,
  USDC,
];

describe('sortTokens', () => {
  it('properly sorts tokens', async () => {
    const { result } = renderHook(() =>
      useDisplayTokenList({
        tokensList: TOKENS,
        searchQuery: '',
      }),
    );

    await act(async () => {
      expect(result.current.map(({ token }) => token)).toEqual([
        // native token first
        AVAX,
        // then tokens with the highest fiat value
        WRAPPED_ETH,
        BTC_B,
        YETISWAP,
        // if fiat value is the same, then sort by balance (desc)
        PANGOLIN,
        CHAINLINK,
        USDC,
        // if balance is the same, then sort by name (asc)
        DEXALOT,
        JEWELS,
        YAY_GAMES,
        // tokens with unknown fiat value come last
        LP_INSUR_A,
        LP_INSUR_B,
      ]);
    });
  });
});
