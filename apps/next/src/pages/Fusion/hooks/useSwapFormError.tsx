import { useTranslation, Trans } from 'react-i18next';
import { useFusionState } from '../contexts';
import { bigintToBig, stringToBigint } from '@core/common';
import { isNativeToken } from '@core/types';
import { bigIntToString } from '@avalabs/core-utils-sdk';
import { CollapsedTokenAmount } from '@/components/CollapsedTokenAmount';
import { ComponentProps } from 'react';

const collapsedTokenAmountProps: Omit<
  ComponentProps<typeof CollapsedTokenAmount>,
  'amount'
> = {
  regularProps: { variant: 'caption' },
  overlineProps: { variant: 'caption2', sx: { transform: 'scale(0.8)' } },
  showApproximationSign: false,
};

export const useSwapFormError = () => {
  const { t } = useTranslation();

  const {
    userAmount,
    quotes,
    quotesStatus,
    sourceToken,
    fee,
    isFeeLoading,
    feeError,
    minimumTransferAmount,
  } = useFusionState();

  if (!userAmount || isFeeLoading) {
    return '';
  }

  const sourceAmountBigInt =
    sourceToken && userAmount
      ? stringToBigint(userAmount, sourceToken.decimals)
      : 0n;

  if (sourceToken && sourceAmountBigInt <= 0n) {
    return t('Please enter an amount greater than 0.');
  }

  if (sourceToken && sourceAmountBigInt > sourceToken.balance) {
    return t('Amount higher than balance.');
  }

  if (sourceToken) {
    if (
      typeof minimumTransferAmount === 'bigint' &&
      sourceAmountBigInt < minimumTransferAmount
    ) {
      return t('Minimum possible amount is {{amount}} {{symbol}}', {
        amount: bigintToBig(
          minimumTransferAmount,
          sourceToken.decimals,
        ).toFixed(), // Avoid scientific notation
        symbol: sourceToken.symbol,
      });
    }

    if (!isFeeLoading) {
      const maxAmount = isNativeToken(sourceToken)
        ? sourceToken.balance - (fee ?? 0n)
        : sourceToken.balance;

      const maxAmountString = bigIntToString(maxAmount, sourceToken.decimals);

      if (sourceAmountBigInt > maxAmount) {
        return (
          <Trans
            i18nKey="Maximum available after fees is <amount /> {{symbol}}"
            components={{
              amount: (
                <CollapsedTokenAmount
                  amount={maxAmountString}
                  {...collapsedTokenAmountProps}
                />
              ),
            }}
            values={{
              symbol: sourceToken.symbol,
            }}
          />
        );
      }
    }
  }

  if (quotesStatus !== 'loading' && quotes.length === 0) {
    return t('No quotes found for selected token pair.');
  }

  if (feeError) {
    return t('Error estimating the network fee.');
  }

  return '';
};
