import { TokenType } from '@avalabs/fusion-sdk';
import { TokenType as VmTokenType } from '@avalabs/vm-module-types';

import { HYPERCORE_CHAIN_ID } from '@core/common';
import type { FungibleTokenBalance } from '@core/types';

import { HYPERLIQUID_USDC_TOKEN_ADDRESS } from './isHypercoreUsdcToken';
import { lookupTokenByAssetInfo } from './lookupTokenByAssetInfo';

const hypercoreUsdc = {
  type: VmTokenType.NATIVE,
  assetType: 'evm_native',
  symbol: 'USDC',
  decimals: 8,
  coreChainId: HYPERCORE_CHAIN_ID,
  chainCaipId: 'hlcore:mainnet',
  balance: 100n,
} as FungibleTokenBalance;

const erc20 = {
  type: VmTokenType.ERC20,
  assetType: 'evm_erc20',
  symbol: 'USDC',
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  decimals: 6,
  coreChainId: 43114,
  chainCaipId: 'eip155:43114',
  balance: 50n,
} as FungibleTokenBalance;

describe('lookupTokenByAssetInfo', () => {
  it('resolves HyperCore Markr USDC (ERC20 zero-address) to native USDC', () => {
    expect(
      lookupTokenByAssetInfo([hypercoreUsdc], {
        type: TokenType.ERC20,
        address: HYPERLIQUID_USDC_TOKEN_ADDRESS,
      }),
    ).toBe(hypercoreUsdc);
  });

  it('still matches ERC20 tokens by address', () => {
    expect(
      lookupTokenByAssetInfo([erc20], {
        type: TokenType.ERC20,
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      }),
    ).toBe(erc20);
  });

  it('matches native assets', () => {
    expect(
      lookupTokenByAssetInfo([hypercoreUsdc], { type: TokenType.NATIVE }),
    ).toBe(hypercoreUsdc);
  });
});
