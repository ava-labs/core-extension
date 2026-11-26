import { NetworkFee, FungibleTokenBalance } from '@core/types';

import { getEvmMaxAmount } from './getEvmMaxAmount';

const feeRate = (maxFeePerGas: bigint) => ({ maxFeePerGas });

const fee = {
  low: feeRate(1n),
  medium: feeRate(2n),
  high: feeRate(10n),
} as unknown as NetworkFee;

const nativeToken = {
  assetType: 'evm_native',
  balance: 1_000_000n,
} as unknown as FungibleTokenBalance;

describe('getEvmMaxAmount', () => {
  it.each([
    ['low', 1n],
    ['medium', 2n],
    ['high', 10n],
  ] as const)('reserves the %s fee tier', (preset, rate) => {
    const { maxAmount, estimatedFee } = getEvmMaxAmount(
      fee,
      nativeToken,
      preset,
    );

    expect(estimatedFee).toBe(rate * 21_000n);
    expect(maxAmount).toBe(1_000_000n - rate * 21_000n);
  });

  it('does not subtract the fee for non-native tokens', () => {
    const erc20 = {
      assetType: 'evm_erc20',
      balance: 500n,
    } as unknown as FungibleTokenBalance;

    expect(getEvmMaxAmount(fee, erc20, 'high').maxAmount).toBe(500n);
  });
});
