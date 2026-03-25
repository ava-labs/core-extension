import { useTranslation, Trans } from 'react-i18next';
import { bigintToBig, stringToBigint } from '@core/common';
import { FeatureVars, isNativeToken } from '@core/types';
import { bigIntToString } from '@avalabs/core-utils-sdk';
import { CollapsedTokenAmount } from '@/components/CollapsedTokenAmount';
import { ComponentProps } from 'react';
import { sumAdditiveFees } from '../lib/sumAdditiveFees';
import { getBufferMultiplierFromBps } from '../lib/getBufferMultiplierFromBps';
import { useFeatureFlagContext } from '@core/ui';
import { FusionState } from '../types';
import { getAdditiveFees } from '../lib/getAdditiveFees';

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
  | 'fee'
  | 'isFeeLoading'
  | 'feeError'
  | 'minimumTransferAmount'
  | 'maxSwapAmount'
  | 'isMaxSwapAmountLoading'
  | 'minimalQuote'
>;

export const useSwapFormError = ({
  debouncedUserAmount,
  quotes,
  quotesStatus,
  sourceToken,
  isFeeLoading,
  fee,
  feeError,
  minimumTransferAmount,
  maxSwapAmount,
  isMaxSwapAmountLoading,
  minimalQuote,
}: UseSwapFormErrorArgs) => {
  const { t } = useTranslation();
  const { selectFeatureFlag } = useFeatureFlagContext();

  const parsedUserAmount = parseFloat(debouncedUserAmount);

  if (
    debouncedUserAmount &&
    (Number.isNaN(parsedUserAmount) || !Number.isFinite(parsedUserAmount))
  ) {
    return t('Please enter a valid amount.');
  }

  if (
    !debouncedUserAmount ||
    !parsedUserAmount ||
    isFeeLoading ||
    isMaxSwapAmountLoading
  ) {
    return '';
  }

  const sourceAmountBigInt =
    sourceToken && debouncedUserAmount
      ? stringToBigint(debouncedUserAmount, sourceToken.decimals)
      : 0n;

  if (sourceToken) {
    if (!isFeeLoading && !isMaxSwapAmountLoading) {
      if (maxSwapAmount === 0n) {
        const additiveFeesAmount = sumAdditiveFees(
          sourceToken,
          getAdditiveFees(minimalQuote),
          getBufferMultiplierFromBps(
            selectFeatureFlag(FeatureVars.FUSION_ADDITIVE_FEES_BUFFER_BPS),
          ),
        );
        const allSourceTokenFees =
          additiveFeesAmount + (isNativeToken(sourceToken) ? (fee ?? 0n) : 0n);

        const allSourceTokenFeesString = bigintToBig(
          allSourceTokenFees,
          sourceToken.decimals,
        ).toFixed(); // Avoid scientific notation

        return (
          <Trans
            i18nKey="Fees are higher than balance. Required fee is <amount /> {{symbol}}"
            components={{
              amount: (
                <CollapsedTokenAmount
                  amount={allSourceTokenFeesString}
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
