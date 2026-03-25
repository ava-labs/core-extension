import { useTranslation, Trans } from 'react-i18next';
import { bigintToBig, stringToBigint } from '@core/common';
import { bigIntToString } from '@avalabs/core-utils-sdk';
import { CollapsedTokenAmount } from '@/components/CollapsedTokenAmount';
import { ComponentProps } from 'react';
import { FusionState } from '../types';

const collapsedTokenAmountProps: Omit<
  ComponentProps<typeof CollapsedTokenAmount>,
  'amount'
> = {
  regularProps: { variant: 'caption' },
  overlineProps: { variant: 'caption2', sx: { transform: 'scale(0.8)' } },
  showApproximationSign: false,
};

type UseSwapFormErrorArgs = Pick<
  FusionState,
  | 'debouncedUserAmount'
  | 'quotes'
  | 'quotesStatus'
  | 'sourceToken'
  | 'isFeeLoading'
  | 'feeError'
  | 'minimumTransferAmount'
  | 'maxSwapAmount'
  | 'maxSwapAmountFees'
  | 'isMaxSwapAmountLoading'
>;

export const useSwapFormError = ({
  debouncedUserAmount,
  quotes,
  quotesStatus,
  sourceToken,
  isFeeLoading,
  feeError,
  minimumTransferAmount,
  maxSwapAmount,
  maxSwapAmountFees,
  isMaxSwapAmountLoading,
}: UseSwapFormErrorArgs) => {
  const { t } = useTranslation();

  let sourceAmountBigInt: bigint = 0n;

  try {
    sourceAmountBigInt =
      sourceToken && debouncedUserAmount
        ? stringToBigint(debouncedUserAmount, sourceToken.decimals)
        : 0n;
  } catch {
    return t('Please enter a valid amount.');
  }

  if (!sourceAmountBigInt || isFeeLoading || isMaxSwapAmountLoading) {
    return '';
  }

  if (sourceToken) {
    if (!isFeeLoading && !isMaxSwapAmountLoading) {
      if (maxSwapAmount === 0n) {
        const maxSwapAmountFeesString = bigintToBig(
          maxSwapAmountFees,
          sourceToken.decimals,
        ).toFixed(); // Avoid scientific notation

        return (
          <Trans
            i18nKey="Fees are higher than balance. Required fee is <amount /> {{symbol}}"
            components={{
              amount: (
                <CollapsedTokenAmount
                  amount={maxSwapAmountFeesString}
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

      if (sourceAmountBigInt > maxSwapAmount) {
        const maxAmountString = bigIntToString(
          maxSwapAmount,
          sourceToken.decimals,
        );

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

    if (sourceAmountBigInt <= 0n) {
      return t('Please enter an amount greater than 0.');
    }

    if (sourceAmountBigInt > sourceToken.balance) {
      return t('Amount higher than balance.');
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
