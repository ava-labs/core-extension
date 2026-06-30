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
});
