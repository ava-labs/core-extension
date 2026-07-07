import { BitcoinCaip2ChainId, ChainId } from '@avalabs/core-chains-sdk';
import { type Asset, type Chain, TokenType } from '@avalabs/fusion-sdk';
import { chainIdToCaip } from '@core/common';

import { isAvalancheCctRoute } from './isAvalancheCctRoute';

const avaxAsset: Asset = {
  type: TokenType.NATIVE,
  name: 'Avalanche',
  symbol: 'AVAX',
  decimals: 18,
};

const usdcAsset: Asset = {
  type: TokenType.ERC20,
  name: 'USD Coin',
  symbol: 'USDC',
  decimals: 6,
  address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
};

const chain = (chainId: string): Chain => ({ chainId }) as Chain;

describe('isAvalancheCctRoute', () => {
  it('returns true for native AVAX across Avalanche C/P/X chains', () => {
    expect(
      isAvalancheCctRoute({
        sourceAsset: avaxAsset,
        sourceChain: chain(chainIdToCaip(ChainId.AVALANCHE_MAINNET_ID)),
        targetAsset: avaxAsset,
        targetChain: chain(chainIdToCaip(ChainId.AVALANCHE_P)),
      }),
    ).toBe(true);

    expect(
      isAvalancheCctRoute({
        sourceAsset: avaxAsset,
        sourceChain: chain(chainIdToCaip(ChainId.AVALANCHE_TEST_X)),
        targetAsset: avaxAsset,
        targetChain: chain(chainIdToCaip(ChainId.AVALANCHE_TESTNET_ID)),
      }),
    ).toBe(true);
  });

  it('returns false for same-chain native AVAX routes', () => {
    expect(
      isAvalancheCctRoute({
        sourceAsset: avaxAsset,
        sourceChain: chain(chainIdToCaip(ChainId.AVALANCHE_MAINNET_ID)),
        targetAsset: avaxAsset,
        targetChain: chain(chainIdToCaip(ChainId.AVALANCHE_MAINNET_ID)),
      }),
    ).toBe(false);
  });

  it('returns false for non-native AVAX routes on Avalanche chains', () => {
    expect(
      isAvalancheCctRoute({
        sourceAsset: usdcAsset,
        sourceChain: chain(chainIdToCaip(ChainId.AVALANCHE_MAINNET_ID)),
        targetAsset: avaxAsset,
        targetChain: chain(chainIdToCaip(ChainId.AVALANCHE_P)),
      }),
    ).toBe(false);
  });

  it('returns false when either chain is outside Avalanche C/P/X', () => {
    expect(
      isAvalancheCctRoute({
        sourceAsset: avaxAsset,
        sourceChain: chain(chainIdToCaip(ChainId.AVALANCHE_MAINNET_ID)),
        targetAsset: avaxAsset,
        targetChain: chain(BitcoinCaip2ChainId.MAINNET),
      }),
    ).toBe(false);
  });
});
