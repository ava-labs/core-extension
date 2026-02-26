import { useTranslation } from 'react-i18next';
import { useFusionState } from '../contexts';
import { stringToBigint } from '@core/common';

export const useSwapFormError = () => {
  const { t } = useTranslation();

  const { userAmount, status, quotes, quotesStatus, sourceToken, fromAmount } =
    useFusionState();

  if (!userAmount) {
    return '';
  }

  if (
    status === 'ready-to-transfer' &&
    quotesStatus !== 'loading' &&
    quotes.length === 0
  ) {
    return t('No quotes found for selected token pair.');
  }

  const sourceAmountBigInt =
    sourceToken && fromAmount
      ? stringToBigint(fromAmount, sourceToken.decimals)
      : 0n;

  if (sourceToken && sourceAmountBigInt <= 0n) {
    return t('Please enter an amount greater than 0.');
  }

  // TODO: Take minimum transfer amount into account (use manager.getMinimumTransferAmount())
  // TODO: Take fees into account (use manager.estimateNativeFee())
  if (sourceToken && sourceAmountBigInt >= sourceToken.balance) {
    return t('Amount too high.');
  }

  return '';
};
