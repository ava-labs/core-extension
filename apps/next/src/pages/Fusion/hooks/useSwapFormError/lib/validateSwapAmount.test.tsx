import { TokenType } from '@avalabs/vm-module-types';

import { FungibleTokenBalance } from '@core/types';

import { RequiredTokenAmounts } from '../../../types';

import { validateSwapAmount } from './validateSwapAmount';

const ONE_AVAX = 1_000_000_000n;
const t = ((key: string) => key) as never;

const pChainToken = {
  type: TokenType.NATIVE,
  assetType: 'pvm_native',
  symbol: 'AVAX',
  decimals: 9,
  balance: 100n * ONE_AVAX,
  available: 40n * ONE_AVAX,
} as FungibleTokenBalance;

const evmToken = {
  type: TokenType.NATIVE,
  assetType: 'evm_native',
  symbol: 'AVAX',
  decimals: 18,
  balance: 100n,
} as FungibleTokenBalance;

const erc20Token = {
  type: TokenType.ERC20,
  symbol: 'USDC',
  decimals: 6,
  balance: 1_000_000_000n,
} as FungibleTokenBalance;

const requiredTokens: RequiredTokenAmounts = {
  state: 'complete',
  tokens: [],
};

describe('validateSwapAmount', () => {
  it('rejects a P-Chain amount above the available balance with the staked/locked explanation', () => {
    expect(
      validateSwapAmount(50n * ONE_AVAX, t, {
        minimumTransferAmount: undefined,
        sourceToken: pChainToken,
        requiredTokens,
      }),
    ).toBe(
      'Amount higher than available balance. Staked and locked funds cannot be transferred.',
    );
  });

  it('accepts a P-Chain amount equal to the available balance', () => {
    expect(
      validateSwapAmount(40n * ONE_AVAX, t, {
        minimumTransferAmount: undefined,
        sourceToken: pChainToken,
        requiredTokens,
      }),
    ).toBeNull();
  });

  it('treats a missing P-Chain available value as zero', () => {
    expect(
      validateSwapAmount(1n, t, {
        minimumTransferAmount: undefined,
        sourceToken: { ...pChainToken, available: undefined } as never,
        requiredTokens,
      }),
    ).toBe(
      'Amount higher than available balance. Staked and locked funds cannot be transferred.',
    );
  });

  it('keeps the generic message for non-P/X-Chain tokens', () => {
    expect(
      validateSwapAmount(101n, t, {
        minimumTransferAmount: undefined,
        sourceToken: evmToken,
        requiredTokens,
      }),
    ).toBe('Amount higher than balance.');
  });

  describe('recurring budget', () => {
    const recurring = {
      numberOfOrders: 3,
      scheduleFeeNativeAmount: 1n * ONE_AVAX,
      isFrequencyBelowMinimum: false,
      minFrequencyMinutes: 1,
    };

    it('rejects a schedule that fits the total balance but not the available balance', () => {
      expect(
        validateSwapAmount(15n * ONE_AVAX, t, {
          minimumTransferAmount: undefined,
          sourceToken: pChainToken,
          requiredTokens,
          recurring,
        }),
      ).toBe('Insufficient funds');
    });

    it('subtracts the schedule fee from the available balance for native sources', () => {
      const validate = (available: bigint) =>
        validateSwapAmount(13n * ONE_AVAX, t, {
          minimumTransferAmount: undefined,
          sourceToken: { ...pChainToken, available } as never,
          requiredTokens,
          recurring,
        });

      expect(validate(39n * ONE_AVAX)).toBe('Insufficient funds');
      expect(validate(40n * ONE_AVAX)).toBeNull();
    });
  });

  describe('required token checks', () => {
    const feeTokens = (total: bigint): RequiredTokenAmounts => ({
      state: 'complete',
      tokens: [
        {
          id: 'pvm',
          token: pChainToken,
          amounts: [
            [total - ONE_AVAX, 'input'],
            [ONE_AVAX, 'network-fee'],
          ],
          total,
        },
      ],
    });

    it('flags a fee shortfall when only the total balance would cover the requirement', () => {
      expect(
        validateSwapAmount(39n * ONE_AVAX, t, {
          minimumTransferAmount: undefined,
          sourceToken: pChainToken,
          requiredTokens: feeTokens(60n * ONE_AVAX),
        }),
      ).toBe('Insufficient balance to cover the network fee.');
    });

    it('passes when the available balance covers the requirement', () => {
      expect(
        validateSwapAmount(39n * ONE_AVAX, t, {
          minimumTransferAmount: undefined,
          sourceToken: pChainToken,
          requiredTokens: feeTokens(40n * ONE_AVAX),
        }),
      ).toBeNull();
    });

    it('flags the recurring schedule fee when only the total balance covers it', () => {
      expect(
        validateSwapAmount(1_000_000n, t, {
          minimumTransferAmount: undefined,
          sourceToken: erc20Token,
          requiredTokens: {
            state: 'complete',
            tokens: [
              {
                id: 'pvm',
                token: pChainToken,
                amounts: [[39n * ONE_AVAX, 'network-fee']],
                total: 39n * ONE_AVAX,
              },
            ],
          },
          recurring: {
            numberOfOrders: 1,
            scheduleFeeNativeAmount: 2n * ONE_AVAX,
            isFrequencyBelowMinimum: false,
            minFrequencyMinutes: 1,
          },
        }),
      ).toBe('Insufficient funds to cover fees');
    });
  });
});
