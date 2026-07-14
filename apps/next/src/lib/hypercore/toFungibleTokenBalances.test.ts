import { TokenType } from '@avalabs/vm-module-types';
import type { HypercoreTokenBalance } from '@avalabs/hypercore-module';
import { HYPERCORE_CAIP_ID, HYPERCORE_CHAIN_ID } from '@core/common';
import type { NetworkWithCaipId } from '@core/types';
import {
  sumHypercoreBalanceInCurrency,
  toFungibleTokenBalances,
} from './toFungibleTokenBalances';

const network = {
  chainId: HYPERCORE_CHAIN_ID,
  caipId: HYPERCORE_CAIP_ID,
  networkToken: {
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 8,
    logoUri: 'https://example.com/usdc.png',
  },
} as NetworkWithCaipId;

describe('toFungibleTokenBalances', () => {
  it('returns an empty list for empty input', () => {
    expect(toFungibleTokenBalances([], network)).toEqual([]);
  });

  it('maps native USDC with $1 fiat value', () => {
    const tokens: HypercoreTokenBalance[] = [
      {
        kind: 'native',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 8,
        balance: '140',
        balanceRaw: '14000000000',
        priceUsd: 1,
        balanceUsd: '140',
      },
    ];

    const [usdc] = toFungibleTokenBalances(tokens, network);

    expect(usdc).toMatchObject({
      type: TokenType.NATIVE,
      assetType: 'evm_native',
      symbol: 'USDC',
      balance: 14000000000n,
      balanceDisplayValue: '140',
      balanceInCurrency: 140,
      priceInCurrency: 1,
      logoUri: 'https://app.hyperliquid.xyz/coins/USDC.svg',
      coreChainId: HYPERCORE_CHAIN_ID,
      chainCaipId: HYPERCORE_CAIP_ID,
      coingeckoId: 'usd-coin',
    });
  });

  it('maps HyperCore spot tokens without synthesizing ERC20 addresses', () => {
    const tokens: HypercoreTokenBalance[] = [
      {
        kind: 'spot',
        name: 'Purr',
        symbol: 'PURR',
        decimals: 6,
        balance: '12.5',
        balanceRaw: '12500000',
        index: 5,
        evmContract: '0xabc0000000000000000000000000000000000001',
      },
    ];

    const [purr] = toFungibleTokenBalances(tokens, network);

    expect(purr).toMatchObject({
      type: TokenType.HYPERCORE_SPOT,
      assetType: 'hypercore_spot',
      symbol: 'PURR',
      index: 5,
      evmContract: '0xabc0000000000000000000000000000000000001',
      balance: 12500000n,
      balanceDisplayValue: '12.5',
      logoUri: 'https://app.hyperliquid.xyz/coins/PURR.svg',
      reputation: null,
      coreChainId: HYPERCORE_CHAIN_ID,
    });
    expect(purr?.balanceInCurrency).toBeUndefined();
  });

  it('sums HyperCore fiat values', () => {
    const tokens = toFungibleTokenBalances(
      [
        {
          kind: 'native',
          name: 'USD Coin',
          symbol: 'USDC',
          decimals: 8,
          balance: '100',
          balanceRaw: '10000000000',
          priceUsd: 1,
          balanceUsd: '100',
        },
        {
          kind: 'spot',
          name: 'Purr',
          symbol: 'PURR',
          decimals: 6,
          balance: '1',
          balanceRaw: '1000000',
          index: 5,
          evmContract: '0xabc0000000000000000000000000000000000001',
        },
      ],
      network,
    );

    expect(sumHypercoreBalanceInCurrency(tokens)).toBe(100);
  });
});
