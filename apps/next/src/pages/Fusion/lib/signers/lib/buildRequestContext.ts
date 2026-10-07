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

import { getRecurringSwapsContext } from './recurringSignerContext';

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

  const recurringSwaps = getRecurringSwapsContext(step);

  const baseContext: JsonRpcRequestContext = {
    surpressSuccessToast: isCrossChainSwap || isIntermediateTransaction,
    actionStep: {
      currentSignature,
      requiredSignatures,
      currentSignatureReason,
    },
    ...(recurringSwaps ? { recurringSwaps } : {}),
  };

  // Check if auto-approve conditions are met
  // Auto-approve is only applicable for single-chain swaps with valid slippage and fee values
  const slippageBps = quote.slippageBps;
  const partnerFeeBps = quote.partnerFeeBps ?? 0;
  const areBpsInRange =
    Number.isFinite(slippageBps) &&
    slippageBps >= 0 &&
    slippageBps <= BASIS_POINTS_DIVISOR &&
    Number.isFinite(partnerFeeBps) &&
    partnerFeeBps >= 0 &&
    partnerFeeBps <= BASIS_POINTS_DIVISOR &&
    // Combined slippage + fee must stay below 100%, otherwise the swap could be
    // auto-approved while draining the entire output.
    slippageBps + partnerFeeBps < BASIS_POINTS_DIVISOR;

  const meetsAutoApprovePreconditions =
    areBpsInRange &&
    !isCrossChainSwap &&
    isQuickSwapsEnabled &&
    isAutoSignSupported &&
    quote.serviceType === ServiceType.MARKR;

  if (!meetsAutoApprovePreconditions) {
    return baseContext;
  }

  const slippagePercent = slippageBps / BASIS_POINTS_DIVISOR;
  const feePercent = partnerFeeBps / BASIS_POINTS_DIVISOR;
  const minAmountOut = new Big(String(quote.amountOut))
    .times(1 - slippagePercent - feePercent)
    .toFixed(0);

  if (!minAmountOut || minAmountOut === '0') {
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
      autoApprove: true,
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
