import { TokenType } from '@avalabs/fusion-sdk';

import { HYPERCORE_CHAIN_ID } from '@core/common';

import { buildAsset } from './buildAsset';
import { HYPERLIQUID_USDC_TOKEN_ADDRESS } from '../../../../lib/isHypercoreUsdcToken';

describe('buildAsset', () => {
  it('maps HyperCore USDC native balance to Markr zero-address ERC20', () => {
    expect(
      buildAsset(
        'evm_native',
        'USD Coin',
        'USDC',
        8,
        undefined,
        HYPERCORE_CHAIN_ID,
      ),
    ).toEqual({
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 8,
      type: TokenType.ERC20,
      address: HYPERLIQUID_USDC_TOKEN_ADDRESS,
    });
  });

  it('keeps non-HyperCore EVM native assets as NATIVE', () => {
    expect(
      buildAsset('evm_native', 'Avalanche', 'AVAX', 18, undefined, 43114),
    ).toEqual({
      name: 'Avalanche',
      type: TokenType.NATIVE,
      symbol: 'AVAX',
      decimals: 18,
    });
  });

  it('does not special-case HyperCore non-USDC native symbols', () => {
    expect(
      buildAsset(
        'evm_native',
        'Something',
        'HYPE',
        18,
        undefined,
        HYPERCORE_CHAIN_ID,
      ),
    ).toEqual({
      name: 'Something',
      type: TokenType.NATIVE,
      symbol: 'HYPE',
      decimals: 18,
    });
  });
});
