import { bigIntToString } from '@avalabs/core-utils-sdk';
import { stringToBigint } from '@core/common';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBridgeState } from '../contexts';

export const useBridgeFormStateHandler = () => {
  const { t } = useTranslation();
  const {
    asset,
    minTransferAmount,
    query: { amount, targetNetwork: targetNetworkId },
    sourceToken,
    requiredNetworkFee,
    fee,
    amountAfterFee,
  } = useBridgeState();
  const [isBridgeExecuting, setIsBridgeExecuting] = useState(false);

  const amountBigInt =
    sourceToken && amount ? stringToBigint(amount, sourceToken.decimals) : 0n;

  const hasInsufficientBalance = sourceToken
    ? amountBigInt > sourceToken.balance
    : false;

  const hasEnoughBalanceForTransfer =
    sourceToken && minTransferAmount
      ? sourceToken.balance >= minTransferAmount
      : true;

  const minAmountError = useMemo(() => {
    if (
      !amountBigInt ||
      minTransferAmount == null ||
      !sourceToken ||
      hasInsufficientBalance
    ) {
      return '';
    }

    if (
      amountBigInt < minTransferAmount ||
      minTransferAmount > sourceToken.balance
    ) {
      return t('Minimum transfer amount is {{limit}}', {
        limit: bigIntToString(minTransferAmount, sourceToken.decimals),
      });
    }
    return '';
  }, [amountBigInt, hasInsufficientBalance, minTransferAmount, sourceToken, t]);

  const maxAmountError = useMemo(() => {
    if (
      !amountBigInt ||
      !sourceToken ||
      !requiredNetworkFee ||
      !minTransferAmount ||
      !hasEnoughBalanceForTransfer ||
      !hasInsufficientBalance
    ) {
      return '';
    }

    const maxAvailable = sourceToken.balance - requiredNetworkFee;
    if (maxAvailable > minTransferAmount && maxAvailable < amountBigInt) {
      return t('Maximum available after fees is {{balance}} {{symbol}}', {
        balance: bigIntToString(maxAvailable, sourceToken.decimals),
        symbol: sourceToken.symbol,
      });
    }
    return '';
  }, [
    amountBigInt,
    sourceToken,
    requiredNetworkFee,
    minTransferAmount,
    hasEnoughBalanceForTransfer,
    hasInsufficientBalance,
    t,
  ]);

  const isFeeLoading = fee === undefined;
  const canExecuteBridge = asset && amount && targetNetworkId;
  const isAmountCorrect =
    canExecuteBridge && minTransferAmount && !minAmountError && !maxAmountError;

  const isReceiveAmountCorrect =
    typeof amountAfterFee === 'bigint' && amountAfterFee > 0n;

  const isBridgeButtonDisabled = Boolean(
    !canExecuteBridge ||
      isFeeLoading ||
      !isAmountCorrect ||
      isBridgeExecuting ||
      !isReceiveAmountCorrect ||
      hasInsufficientBalance,
  );

  return {
    error: hasInsufficientBalance
      ? t('Insufficient balance')
      : minAmountError || maxAmountError,
    setIsBridgeExecuting,
    isBridgeButtonDisabled,
    canExecuteBridge,
  };
};
