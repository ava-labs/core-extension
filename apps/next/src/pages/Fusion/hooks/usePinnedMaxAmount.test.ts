jest.mock('../contexts', () => ({
  useFusionState: jest.fn(),
}));

import { renderHook } from '@testing-library/react';
import { TokenType } from '@avalabs/vm-module-types';

import { FungibleTokenBalance, getUniqueTokenId } from '@core/types';

import { useFusionState } from '../contexts';
import { RequiredTokenAmounts } from '../types';
import { applyBuffer } from '../lib/applyBuffer';
import { MAX_AMOUNT_ADDITIONAL_NATIVE_FEE_BUFFER } from '../fusion-config';

import { usePinnedMaxAmount } from './usePinnedMaxAmount';

const ONE_AVAX = 1_000_000_000n;

const pChainToken = {
  type: TokenType.NATIVE,
  assetType: 'pvm_native',
  symbol: 'AVAX',
  decimals: 9,
  balance: 100n * ONE_AVAX,
  available: 40n * ONE_AVAX,
} as FungibleTokenBalance;

const requirements: RequiredTokenAmounts = { state: 'complete', tokens: [] };

describe('usePinnedMaxAmount', () => {
  beforeEach(() => {
    jest
      .mocked(useFusionState)
      .mockReturnValue({ updateQuery: jest.fn() } as never);
  });

  it('caps the max amount at the available P-Chain balance', () => {
    const { result } = renderHook(() =>
      usePinnedMaxAmount(pChainToken, requirements),
    );

    expect(result.current.maxAmount).toBe(40n * ONE_AVAX);
  });

  it('returns no max amount when nothing is available', () => {
    const { result } = renderHook(() =>
      usePinnedMaxAmount(
        { ...pChainToken, available: 0n } as FungibleTokenBalance,
        requirements,
      ),
    );

    expect(result.current.maxAmount).toBeUndefined();
  });

  it('reserves the buffered native fee out of the available balance, not the total', () => {
    const fee = ONE_AVAX / 10n;
    const withFee: RequiredTokenAmounts = {
      state: 'complete',
      tokens: [
        {
          id: getUniqueTokenId(pChainToken),
          token: pChainToken,
          amounts: [[fee, 'network-fee']],
          total: fee,
        },
      ],
    };

    const { result } = renderHook(() =>
      usePinnedMaxAmount(pChainToken, withFee),
    );

    const reservedFee = applyBuffer(
      fee,
      pChainToken.decimals,
      MAX_AMOUNT_ADDITIONAL_NATIVE_FEE_BUFFER,
    );

    expect(result.current.maxAmount).toBe(40n * ONE_AVAX - reservedFee);
  });
});
