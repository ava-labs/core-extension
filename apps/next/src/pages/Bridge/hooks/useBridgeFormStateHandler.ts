import { bigIntToString } from '@avalabs/core-utils-sdk';
import { stringToBigint } from '@core/common';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBridgeState } from '../contexts';
import { TokenType } from '@avalabs/vm-module-types';

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
      hasInsufficientBalance ||
      amountAfterFee === undefined
    ) {
      return '';
    }

    if (
      amountBigInt < minTransferAmount ||
      minTransferAmount > sourceToken.balance ||
      amountAfterFee <= 0n
    ) {
      return t(
        'The transfer amount needs to be greater than {{limit}}\u00A0{{symbol}}',
        {
          limit: bigIntToString(minTransferAmount, sourceToken.decimals),
          symbol: sourceToken.symbol,
        },
      );
    }
    return '';
  }, [
    amountBigInt,
    hasInsufficientBalance,
    minTransferAmount,
    sourceToken,
    t,
    amountAfterFee,
  ]);

  const maxAmountError = useMemo(() => {
    if (
      !amountBigInt ||
      !sourceToken ||
      !requiredNetworkFee ||
      !minTransferAmount ||
      !hasEnoughBalanceForTransfer ||
      hasInsufficientBalance
    ) {
      return '';
    }

    const maxAvailable =
      sourceToken.type === TokenType.NATIVE
        ? sourceToken.balance - requiredNetworkFee
        : sourceToken.balance;
    if (maxAvailable > minTransferAmount && maxAvailable < amountBigInt) {
      return t(
        'Maximum available after network fees is {{balance}}\u00A0{{symbol}}',
        {
          balance: bigIntToString(maxAvailable, sourceToken.decimals),
          symbol: sourceToken.symbol,
        },
      );
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

  const isReceiveAmountCorrect = typeof amountAfterFee === 'bigint';

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
    isBridgeExecuting,
  };
};
