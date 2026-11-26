import { renderHook } from '@testing-library/react';
import { TokenType } from '@avalabs/vm-module-types';

import { FungibleTokenBalance } from '@core/types';

import { useMaxModeAmountSync } from './useMaxModeAmountSync';

const nativeToken = {
  type: TokenType.NATIVE,
  assetType: 'evm_native',
  symbol: 'ETH',
  decimals: 18,
  balance: 10n ** 18n,
} as unknown as FungibleTokenBalance;

const btcToken = {
  type: TokenType.NATIVE,
  assetType: 'btc_native',
  symbol: 'BTC',
  decimals: 8,
  balance: 100000n,
} as unknown as FungibleTokenBalance;

const erc20Token = {
  type: TokenType.ERC20,
  assetType: 'evm_erc20',
  symbol: 'USDC',
  decimals: 6,
  balance: 10n ** 6n,
} as unknown as FungibleTokenBalance;

describe('useMaxModeAmountSync', () => {
  const onSync = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const render = (props: Partial<Parameters<typeof useMaxModeAmountSync>[0]>) =>
    renderHook((p) => useMaxModeAmountSync(p), {
      initialProps: {
        isMaxMode: true,
        maxAmount: 5n * 10n ** 17n,
        token: nativeToken,
        amount: '',
        onSync,
        ...props,
      },
    });

  it('syncs the amount to maxAmount in max mode', () => {
    render({});

    expect(onSync).toHaveBeenCalledWith('0.5');
  });

  it('re-syncs when maxAmount changes', () => {
    const { rerender } = render({ amount: '0.5' });

    expect(onSync).not.toHaveBeenCalled();

    rerender({
      isMaxMode: true,
      maxAmount: 4n * 10n ** 17n,
      token: nativeToken,
      amount: '0.5',
      onSync,
    });

    expect(onSync).toHaveBeenCalledWith('0.4');
  });

  it('does not sync once max mode is cleared by a manual edit', () => {
    const { rerender } = render({ amount: '0.5' });

    rerender({
      isMaxMode: false,
      maxAmount: 4n * 10n ** 17n,
      token: nativeToken,
      amount: '0.123',
      onSync,
    });

    expect(onSync).not.toHaveBeenCalled();
  });

  it('syncs BTC amounts', () => {
    render({ token: btcToken, maxAmount: 50000n });

    expect(onSync).toHaveBeenCalledWith('0.0005');
  });

  it('syncs zero when max amount is not positive', () => {
    render({ maxAmount: -1n, amount: '0.5' });

    expect(onSync).toHaveBeenCalledWith('0');
  });

  it('waits for maxAmount to be known', () => {
    render({ maxAmount: undefined });

    expect(onSync).not.toHaveBeenCalled();
  });

  it('ignores unsupported tokens', () => {
    render({ token: erc20Token });

    expect(onSync).not.toHaveBeenCalled();
  });
});
