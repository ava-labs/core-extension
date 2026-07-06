jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import { renderHook } from '@testing-library/react';
import { TokenType } from '@avalabs/vm-module-types';

import { FungibleTokenBalance } from '@core/types';

import { RequiredTokenAmounts } from '../../types';

import { useSwapFormError } from './useSwapFormError';

const ONE_AVAX = 1_000_000_000_000_000_000n;

const sourceToken = {
  type: TokenType.NATIVE,
  assetType: 'evm_native',
  symbol: 'AVAX',
  decimals: 18,
  balance: 1000n * ONE_AVAX,
} as FungibleTokenBalance;

const completeRequiredTokens: RequiredTokenAmounts = {
  state: 'complete',
  tokens: [],
};

type Args = Parameters<typeof useSwapFormError>[0];

const baseArgs: Args = {
  debouncedUserAmount: '1',
  quotes: [],
  // 'loading' keeps the empty `quotes` array from tripping the
  // "No quotes found" branch, isolating the minimum-amount logic.
  quotesStatus: 'loading',
  sourceToken,
  minimumTransferAmount: undefined,
  currentRequiredTokens: completeRequiredTokens,
};

describe('useSwapFormError', () => {
  it('flags an amount below the one-shot minimum when a minimum is set', () => {
    const { result } = renderHook(() =>
      useSwapFormError({ ...baseArgs, minimumTransferAmount: 5n * ONE_AVAX }),
    );

    expect(result.current).toBe(
      'Minimum possible amount is {{amount}} {{symbol}}',
    );
  });

  it('does not enforce a minimum when none is provided (recurring mode)', () => {
    const { result } = renderHook(() =>
      useSwapFormError({ ...baseArgs, minimumTransferAmount: undefined }),
    );

    expect(result.current).toBe('');
  });

  it('validates an explicit zero amount against the minimum', () => {
    const { result } = renderHook(() =>
      useSwapFormError({
        ...baseArgs,
        debouncedUserAmount: '0',
        minimumTransferAmount: 1n,
      }),
    );

    expect(result.current).toBe(
      'Minimum possible amount is {{amount}} {{symbol}}',
    );
  });

  it('does not validate an empty amount', () => {
    const { result } = renderHook(() =>
      useSwapFormError({
        ...baseArgs,
        debouncedUserAmount: '',
        minimumTransferAmount: 1n,
      }),
    );

    expect(result.current).toBe('');
  });

  it('flags when the full scheduled spend exceeds the balance', () => {
    const smallBalanceToken = {
      ...sourceToken,
      balance: 3n * ONE_AVAX,
    } as FungibleTokenBalance;

    const { result } = renderHook(() =>
      useSwapFormError({
        ...baseArgs,
        debouncedUserAmount: '1',
        sourceToken: smallBalanceToken,
        recurring: { numberOfOrders: 4, scheduleFeeNativeAmount: 0n },
      }),
    );

    // 1 AVAX × 4 orders = 4 AVAX > 3 AVAX balance.
    expect(result.current).toBe('Insufficient funds');
  });

  it('allows a scheduled spend that fits within the balance', () => {
    const { result } = renderHook(() =>
      useSwapFormError({
        ...baseArgs,
        debouncedUserAmount: '1',
        recurring: { numberOfOrders: 4, scheduleFeeNativeAmount: 0n },
      }),
    );

    // 1 AVAX × 4 orders = 4 AVAX, well within the 1000 AVAX balance.
    expect(result.current).toBe('');
  });

  it('reserves the native schedule fee from a native source budget', () => {
    const tightBalanceToken = {
      ...sourceToken,
      balance: 4n * ONE_AVAX,
    } as FungibleTokenBalance;

    const { result } = renderHook(() =>
      useSwapFormError({
        ...baseArgs,
        debouncedUserAmount: '1',
        sourceToken: tightBalanceToken,
        // 4 AVAX spend fits the 4 AVAX balance, but the schedule fee pushes it over.
        recurring: { numberOfOrders: 4, scheduleFeeNativeAmount: ONE_AVAX },
      }),
    );

    expect(result.current).toBe('Insufficient funds');
  });
});
