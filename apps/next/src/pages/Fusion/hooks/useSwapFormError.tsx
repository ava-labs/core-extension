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
  | 'additiveFees'
  | 'useMaxAmount'
>;

export const useSwapFormError = ({
  debouncedUserAmount,
  quotes,
  quotesStatus,
  sourceToken,
  fee,
  isFeeLoading,
  feeError,
  minimumTransferAmount,
  additiveFees,
  useMaxAmount,
}: UseSwapFormErrorArgs) => {
  const { t } = useTranslation();
  const { selectFeatureFlag } = useFeatureFlagContext();

  if (!debouncedUserAmount || isFeeLoading || useMaxAmount) {
    return '';
  }

  const sourceAmountBigInt =
    sourceToken && debouncedUserAmount
      ? stringToBigint(debouncedUserAmount, sourceToken.decimals)
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
      const additiveFeesAmount = sumAdditiveFees(
        sourceToken,
        additiveFees,
        getBufferMultiplierFromBps(
          selectFeatureFlag(FeatureVars.FUSION_ADDITIVE_FEES_BUFFER_BPS),
        ),
      );

      const maxAmount =
        sourceToken.balance -
        additiveFeesAmount -
        (isNativeToken(sourceToken) ? (fee ?? 0n) : 0n);

      if (maxAmount < 0) {
        return t(
          'Fees are higher than balance. Required fee is {{amount}} {{symbol}}',
          {
            amount: bigintToBig(
              additiveFeesAmount,
              sourceToken.decimals,
            ).toFixed(), // Avoid scientific notation
            symbol: sourceToken.symbol,
          },
        );
      }

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
