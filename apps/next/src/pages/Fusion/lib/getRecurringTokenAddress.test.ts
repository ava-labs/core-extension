import { type Asset, ERC_ZERO_ADDRESS, TokenType } from '@avalabs/fusion-sdk';

import { getRecurringTokenAddress } from './getRecurringTokenAddress';

describe('getRecurringTokenAddress', () => {
  it('maps a native asset to the zero address', () => {
    const asset = {
      type: TokenType.NATIVE,
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18,
    } as Asset;

    expect(getRecurringTokenAddress(asset)).toBe(ERC_ZERO_ADDRESS);
  });

  it('maps an ERC-20 asset to its contract address', () => {
    const address = '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E';
    const asset = {
      type: TokenType.ERC20,
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      address,
    } as Asset;

    expect(getRecurringTokenAddress(asset)).toBe(address);
  });

  it('returns undefined for non-EVM (SPL) assets', () => {
    const asset = {
      type: TokenType.SPL,
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    } as Asset;

    expect(getRecurringTokenAddress(asset)).toBeUndefined();
  });
});
