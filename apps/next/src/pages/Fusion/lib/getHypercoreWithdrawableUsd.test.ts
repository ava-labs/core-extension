import { TokenType } from '@avalabs/vm-module-types';

import { HYPERCORE_CHAIN_ID } from '@core/common';
import type { FungibleTokenBalance } from '@core/types';

import {
  exceedsHypercoreWithdrawable,
  getHypercoreStrandedAmount,
} from './getHypercoreWithdrawableUsd';

const usdcToken = (balance: bigint): FungibleTokenBalance =>
  ({
    type: TokenType.NATIVE,
    assetType: 'evm_native',
    symbol: 'USDC',
    decimals: 8,
    coreChainId: HYPERCORE_CHAIN_ID,
    balance,
  }) as FungibleTokenBalance;

describe('exceedsHypercoreWithdrawable', () => {
  it('is false when the withdrawable balance is unknown', () => {
    expect(
      exceedsHypercoreWithdrawable({
        amount: 10n,
        withdrawableBalance: undefined,
      }),
    ).toBe(false);
  });

  it('compares amount against withdrawable balance with bigint', () => {
    expect(
      exceedsHypercoreWithdrawable({
        amount: 10n,
        withdrawableBalance: 10n,
      }),
    ).toBe(false);
    expect(
      exceedsHypercoreWithdrawable({
        amount: 11n,
        withdrawableBalance: 10n,
      }),
    ).toBe(true);
  });
});

describe('getHypercoreStrandedAmount', () => {
  it('returns the gap for non-unified HyperCore USDC when balance exceeds withdrawable', () => {
    expect(
      getHypercoreStrandedAmount({
        sourceToken: usdcToken(100n),
        withdrawableBalance: 40n,
        abstractionMode: 'default',
      }),
    ).toBe(60n);
  });

  it('returns undefined for unified accounts', () => {
    expect(
      getHypercoreStrandedAmount({
        sourceToken: usdcToken(100n),
        withdrawableBalance: 40n,
        abstractionMode: 'unifiedAccount',
      }),
    ).toBeUndefined();
  });

  it('returns undefined when there is no gap', () => {
    expect(
      getHypercoreStrandedAmount({
        sourceToken: usdcToken(40n),
        withdrawableBalance: 40n,
        abstractionMode: 'default',
      }),
    ).toBeUndefined();
  });
});
