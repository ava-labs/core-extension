import Big from 'big.js';
import {
  ServiceType,
  TransferStepDetails,
  TokenType,
} from '@avalabs/fusion-sdk';

import {
  JsonRpcRequestContext,
  MaxBuyOption,
  ValidatorType,
} from '@core/types';
import { BASIS_POINTS_DIVISOR } from '@core/common';

type AppContext = {
  isBatch: boolean;
  isQuickSwapsEnabled: boolean;
  isAutoSignSupported: boolean;
  isSwapFeesEnabled: boolean;
  maxBuy: MaxBuyOption;
};

export const buildRequestContext = (
  step: TransferStepDetails,
  appContext?: AppContext,
): JsonRpcRequestContext => {
  const {
    requiredSignatures,
    currentSignature,
    currentSignatureReason,
    quote,
  } = step;
  const {
    isQuickSwapsEnabled,
    isAutoSignSupported,
    isSwapFeesEnabled,
    isBatch,
    maxBuy,
  } = appContext ?? {};
  const isCrossChainSwap =
    quote.sourceChain.chainId !== quote.targetChain.chainId;
  const isIntermediateTransaction = currentSignature < requiredSignatures;

  const baseContext: JsonRpcRequestContext = {
    surpressSuccessToast: isCrossChainSwap || isIntermediateTransaction,
    actionStep: {
      currentSignature,
      requiredSignatures,
      currentSignatureReason,
    },
  };

  // Calculate minAmountOut
  const slippagePercent = quote.slippageBps / BASIS_POINTS_DIVISOR;
  const feePercent = (quote.partnerFeeBps ?? 0) / BASIS_POINTS_DIVISOR;
  const minAmountOut = new Big(String(quote.amountOut))
    .times(1 - slippagePercent - feePercent)
    .toFixed(0);

  const hasMinAmountOut = Boolean(minAmountOut && minAmountOut !== '0');
  const autoApprove =
    !isCrossChainSwap &&
    hasMinAmountOut &&
    isQuickSwapsEnabled &&
    isAutoSignSupported &&
    quote.serviceType === ServiceType.MARKR;

  if (!autoApprove) {
    return baseContext;
  }

  const validatorType = isBatch ? ValidatorType.BATCH_SWAP : ValidatorType.SWAP;
  const isSrcTokenNative = quote.assetIn.type === TokenType.NATIVE;
  const srcTokenAddress = isSrcTokenNative
    ? quote.assetIn.symbol
    : quote.assetIn.address;

  const isDestTokenNative = quote.assetOut.type === TokenType.NATIVE;
  const destTokenAddress = isDestTokenNative
    ? quote.assetOut.symbol
    : quote.assetOut.address;

  return {
    ...baseContext,
    swapAutoApprove: {
      autoApprove,
      validatorType,
      srcTokenAddress,
      isSrcTokenNative,
      destTokenAddress,
      isDestTokenNative,
      minAmountOut,
      slippage: slippagePercent * 100,
      maxBuy,
      isSwapFeesEnabled,
    },
  };
};
