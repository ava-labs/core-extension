import { ComponentProps } from 'react';
import { TFunction, Trans } from 'react-i18next';
import { bigintToBig } from '@avalabs/core-utils-sdk';
import { TokenType } from '@avalabs/vm-module-types';

import { FungibleTokenBalance } from '@core/types';

import { CollapsedTokenAmount } from '@/components/CollapsedTokenAmount';

import { RequiredTokenAmounts } from '../../../types';

import { sumByPurpose } from '../../../lib/sumByPurpose';

const collapsedTokenAmountProps: Omit<
  ComponentProps<typeof CollapsedTokenAmount>,
  'amount'
> = {
  regularProps: { variant: 'caption' },
  overlineProps: { variant: 'caption2', sx: { transform: 'scale(0.8)' } },
  showApproximationSign: false,
};

export type RecurringSwapValidation = {
  numberOfOrders: number;
  scheduleFeeNativeAmount: bigint;
  isFrequencyBelowMinimum: boolean;
  minFrequencyMinutes: number;
};

export const validateSwapAmount = (
  sourceAmountBigInt: bigint,
  t: TFunction,
  {
    minimumTransferAmount,
    sourceToken,
    requiredTokens: { state, tokens },
    recurring,
  }: {
    minimumTransferAmount: bigint | undefined;
    sourceToken: FungibleTokenBalance;
    requiredTokens: RequiredTokenAmounts;
    recurring?: RecurringSwapValidation;
  },
) => {
  if (recurring && sourceAmountBigInt > 0n) {
    const totalScheduledSpend =
      sourceAmountBigInt * BigInt(recurring.numberOfOrders);
    const isNativeSource = sourceToken.type === TokenType.NATIVE;
    const budget = isNativeSource
      ? sourceToken.balance - recurring.scheduleFeeNativeAmount
      : sourceToken.balance;

    if (totalScheduledSpend > budget) {
      return t('Insufficient funds');
    }
  }

  if (state === 'loading') {
    return null;
  }

  if (sourceAmountBigInt < 0n) {
    return t('Please enter an amount greater than 0.');
  }

  if (sourceAmountBigInt > sourceToken.balance) {
    return t('Amount higher than balance.');
  }

  // Check if the minimum transfer amount is met.
  if (
    typeof minimumTransferAmount === 'bigint' &&
    sourceAmountBigInt < minimumTransferAmount
  ) {
    return t('Minimum possible amount is {{amount}} {{symbol}}', {
      amount: bigintToBig(
        minimumTransferAmount,
        sourceToken.decimals,
      ).toFixed(),
      symbol: sourceToken.symbol,
    });
  }

  // Check required balance for each asset taking part in the swap.
  for (const requiredToken of tokens) {
    if (requiredToken.token.balance >= requiredToken.total) {
      continue;
    }

    // 1. Check if the balance is enough to cover the input amount and the network fee.
    const inputPlusNetworkFeeTotal =
      sumByPurpose(requiredToken, 'input') +
      sumByPurpose(requiredToken, 'network-fee');
    const isEnoughForInputAndNetworkFee =
      requiredToken.token.balance >= inputPlusNetworkFeeTotal;

    // We can't validate the network fee amounts if we don't have the native fee data.
    if (!isEnoughForInputAndNetworkFee && state === 'complete') {
      return t('Insufficient balance to cover the network fee.');
    }

    // At this point, we know that it's the additive fees that are causing the balance to be exceeded.
    const additiveFeesTotal = sumByPurpose(requiredToken, 'additive-fee');
    const additiveFeesTotalString = bigintToBig(
      additiveFeesTotal,
      requiredToken.token.decimals,
    ).toFixed();

    return (
      <Trans
        i18nKey="Not enough {{symbol}} to cover the operating expenses. <amount /> is required."
        components={{
          amount: (
            <CollapsedTokenAmount
              amount={additiveFeesTotalString}
              {...collapsedTokenAmountProps}
            />
          ),
        }}
        values={{
          symbol: requiredToken.token.symbol,
        }}
      />
    );
  }

  if (
    recurring &&
    recurring.scheduleFeeNativeAmount > 0n &&
    sourceToken.type !== TokenType.NATIVE
  ) {
    const nativeRequired = tokens.find(
      (requiredToken) => requiredToken.token.type === TokenType.NATIVE,
    );

    if (
      nativeRequired &&
      nativeRequired.token.balance <
        nativeRequired.total + recurring.scheduleFeeNativeAmount
    ) {
      return t('Insufficient funds to cover fees');
    }
  }

  return null;
};
