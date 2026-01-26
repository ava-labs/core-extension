import { bigIntToString } from '@avalabs/core-utils-sdk';
import { TokenType } from '@avalabs/vm-module-types';
import { stringToBigint } from '@core/common';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBridgeState } from '../contexts';
import { trimEndZeros } from '../lib/trimEndZeros';

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
          limit: trimEndZeros(
            bigIntToString(minTransferAmount, sourceToken.decimals),
          ),
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
          balance: trimEndZeros(
            bigIntToString(maxAvailable, sourceToken.decimals),
          ),
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
  // Note: minTransferAmount can be 0n which is falsy, so we check for undefined explicitly
  const isAmountCorrect =
    canExecuteBridge &&
    minTransferAmount !== undefined &&
    !minAmountError &&
    !maxAmountError;

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
