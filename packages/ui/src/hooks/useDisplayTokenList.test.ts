import { act } from 'react-dom/test-utils';
import { useDisplaytokenlist } from './useDisplayTokenList';
import { renderHook } from '@testing-library/react-hooks';

const TOKENS = [
  {
    name: 'Avalanche',
    symbol: 'AVAX',
    balance: 5759363806986223209n,
    balanceInCurrency: 139.77,
    type: 'NATIVE',
  },
  {
    name: 'YAY Games',
    symbol: 'YAY',
    balance: 35000000000000000000n,
    balanceInCurrency: 0.02,
    type: 'ERC20',
  },
  {
    name: 'Bitcoin',
    symbol: 'BTC.b',
    balance: 16434n,
    balanceInCurrency: 16.84,
    type: 'ERC20',
  },
  {
    name: 'YetiSwap',
    symbol: 'YTS',
    balance: 16999998305799245218430n,
    balanceInCurrency: 13.57,
    type: 'ERC20',
  },
  {
    name: 'Wrapped ETH',
    symbol: 'WETH.e',
    balance: 206776540386356860n,
    balanceInCurrency: 500.8,
    type: 'ERC20',
  },
  {
    name: 'Jewels',
    symbol: 'JEWEL',
    balance: 33982989227679224842n,
    balanceInCurrency: 1.62,
    type: 'ERC20',
  },
  {
    name: 'Dexalot',
    symbol: 'ALOT',
    balance: 33982989227679224842n,
    balanceInCurrency: 1.62,
    type: 'ERC20',
  },
  {
    name: 'LPTokenINSUR B',
    symbol: 'LPTokenINSUR B',
    balance: 5000n,
    reputation: 'Benign',
    type: 'ERC20',
  },
  {
    name: 'LPTokenINSUR A',
    symbol: 'LPTokenINSUR A',
    balance: 10000000n,
    reputation: 'Benign',
    type: 'ERC20',
  },
  {
    name: 'ChainLink Token',
    symbol: 'LINK.e',
    balance: 598743016848865911n,
    balanceInCurrency: 9.82,
    type: 'ERC20',
  },
  {
    name: 'Pangolin',
    symbol: 'PNG',
    balance: 16219781798102139248n,
    balanceInCurrency: 9.82,
    type: 'ERC20',
  },
  {
    name: 'USD Coin',
    symbol: 'USDC.e',
    balance: 1728233n,
    balanceInCurrency: 1.72,
    type: 'ERC20',
  },
];

describe('sortTokens', () => {
  it('properly sorts tokens', async () => {
    const { result } = renderHook(() =>
      useDisplaytokenlist({
        tokensList: TOKENS as any,
        searchQuery: '',
      }),
    );

    await act(async () => {
      expect(result.current.map(({ token }) => token)).toEqual([
        // native token first
        {
          name: 'Avalanche',
          symbol: 'AVAX',
          balance: 5759363806986223209n,
          balanceInCurrency: 139.77,
          type: 'NATIVE',
        },
        // then tokens with the highest fiat value
        {
          name: 'Wrapped ETH',
          symbol: 'WETH.e',
          balance: 206776540386356860n,
          balanceInCurrency: 500.8,
          type: 'ERC20',
        },
        {
          name: 'Bitcoin',
          symbol: 'BTC.b',
          balance: 16434n,
          balanceInCurrency: 16.84,
          type: 'ERC20',
        },
        {
          name: 'YetiSwap',
          symbol: 'YTS',
          balance: 16999998305799245218430n,
          balanceInCurrency: 13.57,
          type: 'ERC20',
        },
        // if fiat value is the same, then sort by balance (desc)
        {
          name: 'Pangolin',
          symbol: 'PNG',
          balance: 16219781798102139248n,
          balanceInCurrency: 9.82,
          type: 'ERC20',
        },
        {
          name: 'ChainLink Token',
          symbol: 'LINK.e',
          balance: 598743016848865911n,
          balanceInCurrency: 9.82,
          type: 'ERC20',
        },
        {
          name: 'USD Coin',
          symbol: 'USDC.e',
          balance: 1728233n,
          balanceInCurrency: 1.72,
          type: 'ERC20',
        },
        // if balance is the same, then sort by name (asc)
        {
          name: 'Dexalot',
          symbol: 'ALOT',
          balance: 33982989227679224842n,
          balanceInCurrency: 1.62,
          type: 'ERC20',
        },
        {
          name: 'Jewels',
          symbol: 'JEWEL',
          balance: 33982989227679224842n,
          balanceInCurrency: 1.62,
          type: 'ERC20',
        },
        {
          name: 'YAY Games',
          symbol: 'YAY',
          balance: 35000000000000000000n,
          balanceInCurrency: 0.02,
          type: 'ERC20',
        },
        // tokens with unknown fiat value come last
        {
          name: 'LPTokenINSUR A',
          symbol: 'LPTokenINSUR A',
          balance: 10000000n,
          reputation: 'Benign',
          type: 'ERC20',
        },
        {
          name: 'LPTokenINSUR B',
          symbol: 'LPTokenINSUR B',
          balance: 5000n,
          reputation: 'Benign',
          type: 'ERC20',
        },
      ]);
    });
  });
});
