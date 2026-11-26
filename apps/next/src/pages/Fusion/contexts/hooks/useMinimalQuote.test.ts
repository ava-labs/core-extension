jest.mock('./useQuotes', () => ({
  useQuotes: jest.fn(() => ({ selectedQuote: undefined })),
}));

import { renderHook } from '@testing-library/react';
import { TokenType } from '@avalabs/vm-module-types';

import { FungibleTokenBalance } from '@core/types';

import { useMinimalQuote } from './useMinimalQuote';
import { useQuotes } from './useQuotes';

const ONE_AVAX = 1_000_000_000n;

const pChainToken = {
  type: TokenType.NATIVE,
  assetType: 'pvm_native',
  symbol: 'AVAX',
  decimals: 9,
  balance: 100n * ONE_AVAX,
  available: 40n * ONE_AVAX,
} as FungibleTokenBalance;

const baseProps = {
  manager: {},
  fromAddress: 'from',
  toAddress: 'to',
  sourceAsset: {},
  sourceChain: {},
  targetAsset: {},
  targetChain: {},
  sourceToken: pChainToken,
} as never as Parameters<typeof useMinimalQuote>[0];

describe('useMinimalQuote', () => {
  beforeEach(() => jest.mocked(useQuotes).mockClear());

  it('simulates half of the available balance', () => {
    renderHook(() =>
      useMinimalQuote({ ...baseProps, minimumTransferAmount: 1n }),
    );

    expect(useQuotes).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 20n * ONE_AVAX }),
      false,
    );
  });

  it('falls back to the minimum transfer amount when half is lower', () => {
    renderHook(() =>
      useMinimalQuote({
        ...baseProps,
        minimumTransferAmount: 30n * ONE_AVAX,
      }),
    );

    expect(useQuotes).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 30n * ONE_AVAX }),
      false,
    );
  });
});
