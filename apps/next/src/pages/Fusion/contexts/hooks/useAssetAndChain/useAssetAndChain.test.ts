import { renderHook } from '@testing-library/react';
import { TokenType } from '@avalabs/vm-module-types';

import { type FungibleTokenBalance } from '@core/types';

import { useAssetAndChain } from './useAssetAndChain';

jest.mock('@core/ui', () => ({
  useNetworkContext: () => ({ getNetwork: () => undefined }),
}));

const usdc = (overrides: Partial<FungibleTokenBalance> = {}) =>
  ({
    type: TokenType.ERC20,
    assetType: 'evm_erc20',
    name: 'USDC',
    symbol: 'USDC',
    decimals: 6,
    address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
    coreChainId: 43114,
    ...overrides,
  }) as unknown as FungibleTokenBalance;

describe('useAssetAndChain', () => {
  it('keeps the asset identity when only the name changes', () => {
    const { result, rerender } = renderHook(
      ({ token }) => useAssetAndChain(token),
      { initialProps: { token: usdc() } },
    );
    const initialAsset = result.current.asset;

    rerender({ token: usdc({ name: 'USD Coin' }) });

    expect(result.current.asset).toBe(initialAsset);
  });

  it('builds a new asset when a native token has a different symbol', () => {
    const native = (symbol: string) =>
      usdc({
        type: TokenType.NATIVE,
        assetType: 'evm_native',
        address: undefined,
        symbol,
        name: symbol,
      } as Partial<FungibleTokenBalance>);
    const { result, rerender } = renderHook(
      ({ token }) => useAssetAndChain(token),
      { initialProps: { token: native('AVAX') } },
    );
    const initialAsset = result.current.asset;

    rerender({ token: native('ETH') });

    expect(result.current.asset).not.toBe(initialAsset);
    expect(result.current.asset?.symbol).toBe('ETH');
  });

  it('builds a new asset when the decimals change', () => {
    const { result, rerender } = renderHook(
      ({ token }) => useAssetAndChain(token),
      { initialProps: { token: usdc() } },
    );
    const initialAsset = result.current.asset;

    rerender({ token: usdc({ decimals: 18 }) });

    expect(result.current.asset).not.toBe(initialAsset);
  });
});
