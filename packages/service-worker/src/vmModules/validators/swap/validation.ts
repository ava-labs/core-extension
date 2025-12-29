import { Action, MaxBuyOption, MultiTxAction } from '@core/types';
import { ValidationResult } from '../../models';
import { MARKR_PARTNER_FEE_BPS, BASIS_POINTS_DIVISOR } from './constants';
import { findTokenInBalanceChange } from './helpers';
import {
  SwapValidationContext,
  TokenBalanceChange,
  BalanceChangeData,
} from './types';

/**
 * Convert MaxBuyOption to numeric USD limit
 */
function getMaxBuyLimit(maxBuy: MaxBuyOption | undefined): number | null {
  if (!maxBuy || maxBuy === 'unlimited') {
    return null; // No limit
  }
  return parseInt(maxBuy, 10);
}

/**
 * Validate that the swap amount doesn't exceed the user's max buy limit
 * @returns validation result - requires manual approval if exceeded
 */
export function validateMaxBuyLimit(
  sourceUsdValue: number,
  maxBuy: MaxBuyOption | undefined,
): { isValid: boolean; requiresManualApproval: boolean; reason?: string } {
  const maxBuyLimit = getMaxBuyLimit(maxBuy);

  if (maxBuyLimit === null) {
    return { isValid: true, requiresManualApproval: false };
  }

  if (sourceUsdValue > maxBuyLimit) {
    return {
      isValid: false,
      requiresManualApproval: true,
      reason: `Swap amount ($${sourceUsdValue.toFixed(2)}) exceeds max buy limit ($${maxBuyLimit})`,
    };
  }

  return { isValid: true, requiresManualApproval: false };
}

/**
 * Validate USD prices for swap and determine if auto-approval is safe
 * Returns validation result based on USD price comparison with slippage tolerance
 * Assumes balanceChange and tokens have already been validated
 */
export function validateSwapUsdPrices(
  sourceTokenOut: TokenBalanceChange,
  destinationTokenIn: TokenBalanceChange,
  context: Partial<SwapValidationContext>,
): { isValid: boolean; requiresManualApproval: boolean; reason?: string } {
  // Extract USD prices from items
  if (!sourceTokenOut.items || sourceTokenOut.items.length === 0) {
    return {
      isValid: false,
      requiresManualApproval: true,
      reason:
        'Source token found but has no items in balance change - cannot extract USD price',
    };
  }

  if (!destinationTokenIn.items || destinationTokenIn.items.length === 0) {
    return {
      isValid: false,
      requiresManualApproval: true,
      reason:
        'Destination token found but has no items in balance change - cannot extract USD price',
    };
  }

  // Calculate total USD values (sum across all items for each token)
  const sourceUsdValue = sourceTokenOut.items.reduce(
    (sum: number, item: any) => {
      const usdPrice = parseFloat(item.usdPrice || '0');
      return sum + (isNaN(usdPrice) ? 0 : usdPrice);
    },
    0,
  );

  const destUsdValue = destinationTokenIn.items.reduce(
    (sum: number, item: any) => {
      const usdPrice = parseFloat(item.usdPrice || '0');
      return sum + (isNaN(usdPrice) ? 0 : usdPrice);
    },
    0,
  );

  // Missing prices → manual approval
  if (
    !sourceUsdValue ||
    !destUsdValue ||
    sourceUsdValue === 0 ||
    destUsdValue === 0
  ) {
    return {
      isValid: false,
      requiresManualApproval: true,
      reason: 'USD prices unavailable or zero - cannot validate swap value',
    };
  }

  // Check max buy limit first
  const maxBuyValidation = validateMaxBuyLimit(sourceUsdValue, context?.maxBuy);
  if (!maxBuyValidation.isValid) {
    return maxBuyValidation;
  }

  // User gets more value → auto approve
  if (destUsdValue >= sourceUsdValue) {
    return {
      isValid: true,
      requiresManualApproval: false,
    };
  }

  // User loses value → check slippage tolerance and fee
  const slippage = context?.slippage;
  if (!slippage || typeof slippage !== 'number') {
    return {
      isValid: false,
      requiresManualApproval: true,
      reason:
        'Slippage not available in context - cannot validate loss tolerance',
    };
  }

  const slippagePercent = slippage / 100;

  // Add Markr partner fee (0.85%) when swap fees are enabled
  // Note: This validator only handles Markr swaps (checked at top level)
  const isSwapFeesEnabled = context?.isSwapFeesEnabled ?? false;
  const feePercent = isSwapFeesEnabled
    ? MARKR_PARTNER_FEE_BPS / BASIS_POINTS_DIVISOR
    : 0;
  const totalPercent = slippagePercent + feePercent;

  const minAcceptableUsdValue = sourceUsdValue * (1 - totalPercent);

  if (destUsdValue >= minAcceptableUsdValue) {
    return {
      isValid: true,
      requiresManualApproval: false,
    };
  }

  // Loss exceeds slippage + fee tolerance → manual approval
  const lossPercent = ((sourceUsdValue - destUsdValue) / sourceUsdValue) * 100;
  const totalTolerancePercent = slippage + feePercent * 100;
  return {
    isValid: false,
    requiresManualApproval: true,
    reason: `USD loss (${lossPercent.toFixed(2)}%) exceeds slippage tolerance (${slippage}%)${feePercent > 0 ? ` + fee (${(feePercent * 100).toFixed(2)}%)` : ''} = ${totalTolerancePercent.toFixed(2)}%`,
  };
}

/**
 * Step 1: Validate minimum amount is provided
 */
function validateMinAmountOut(
  expectedMinAmountOut: string | undefined,
): ValidationResult | null {
  if (!expectedMinAmountOut || expectedMinAmountOut === '0') {
    return {
      isValid: false,
      requiresManualApproval: true,
      reason: 'minAmountOut is missing or zero - manual approval required',
    };
  }
  return null; // Validation passed, continue to next step
}

/**
 * Step 2: Validate simulation was successful (hard reject if failed)
 */
function validateSimulation(
  isSimulationSuccessful: boolean | undefined,
): ValidationResult | null {
  if (isSimulationSuccessful === false) {
    return {
      isValid: false,
      requiresManualApproval: false,
      reason: 'Transaction simulation failed - cannot safely auto-approve swap',
    };
  }
  return null;
}

/**
 * Step 3: Validate balance change data exists
 */
function validateBalanceChange(
  balanceChange: BalanceChangeData | undefined,
): ValidationResult | null {
  if (!balanceChange) {
    return {
      isValid: false,
      requiresManualApproval: true,
      reason:
        'No balance change data in scan results - cannot validate swap amounts',
    };
  }

  if (!balanceChange.outs || balanceChange.outs.length === 0) {
    return {
      isValid: false,
      requiresManualApproval: true,
      reason:
        'No outgoing tokens in balance change data - cannot validate source token',
    };
  }

  if (!balanceChange.ins || balanceChange.ins.length === 0) {
    return {
      isValid: false,
      requiresManualApproval: true,
      reason:
        'No incoming tokens in balance change data - cannot validate swap amounts',
    };
  }

  return null;
}

/**
 * Step 4: Validate token addresses are provided
 */
function validateTokenAddresses(
  srcTokenAddress: string | undefined,
  destTokenAddress: string | undefined,
): ValidationResult | null {
  if (!srcTokenAddress || !destTokenAddress) {
    return {
      isValid: false,
      requiresManualApproval: true,
      reason:
        'Missing source or destination token address in context - cannot identify tokens',
    };
  }
  return null;
}

/**
 * Step 5: Find and validate source token in balance change
 */
function validateSourceToken(
  balanceChange: BalanceChangeData,
  srcTokenAddress: string,
  isSrcTokenNative: boolean,
): { result: ValidationResult | null; sourceTokenOut?: TokenBalanceChange } {
  const sourceTokenOut = findTokenInBalanceChange(
    balanceChange.outs,
    srcTokenAddress,
    isSrcTokenNative,
  );

  if (!sourceTokenOut) {
    return {
      result: {
        isValid: false,
        requiresManualApproval: true,
        reason: `Could not find source token (${srcTokenAddress}) in balance change scan results`,
      },
    };
  }

  return { result: null, sourceTokenOut };
}

/**
 * Step 6: Find and validate destination token in balance change
 */
function validateDestinationToken(
  balanceChange: BalanceChangeData,
  destTokenAddress: string,
  isDestTokenNative: boolean,
): {
  result: ValidationResult | null;
  destinationTokenIn?: TokenBalanceChange;
} {
  const destinationTokenIn = findTokenInBalanceChange(
    balanceChange.ins,
    destTokenAddress,
    isDestTokenNative,
  );

  if (!destinationTokenIn) {
    return {
      result: {
        isValid: false,
        requiresManualApproval: true,
        reason: `Could not find destination token (${destTokenAddress}) in balance change scan results`,
      },
    };
  }

  return { result: null, destinationTokenIn };
}

/**
 * Step 7: Validate destination token has items for amount extraction
 */
function validateDestinationTokenItems(
  destinationTokenIn: TokenBalanceChange,
): ValidationResult | null {
  if (!destinationTokenIn.items || destinationTokenIn.items.length === 0) {
    return {
      isValid: false,
      requiresManualApproval: true,
      reason: `Destination token found but has no items in balance change - cannot extract amount`,
    };
  }
  return null;
}

/**
 * Step 8: Calculate actual amount received from destination token
 */
function calculateActualAmountReceived(
  destinationTokenIn: TokenBalanceChange,
): {
  result: ValidationResult | null;
  actualAmountReceived?: string;
} {
  const tokenDecimals = destinationTokenIn.token?.decimals;
  if (tokenDecimals === undefined || tokenDecimals === null) {
    return {
      result: {
        isValid: false,
        requiresManualApproval: true,
        reason:
          'Token decimals not found in scan results - cannot convert display value to raw amount',
      },
    };
  }

  try {
    const totalAmount = destinationTokenIn.items.reduce(
      (sum: bigint, item: any) => {
        const displayValue = item.displayValue || '0';
        const rawAmount = BigInt(
          Math.floor(parseFloat(displayValue) * Math.pow(10, tokenDecimals)),
        );
        return sum + rawAmount;
      },
      0n,
    );

    const actualAmountReceived = totalAmount.toString();

    if (!actualAmountReceived || actualAmountReceived === '0') {
      return {
        result: {
          isValid: false,
          requiresManualApproval: true,
          reason:
            'Could not extract valid amount from scan results for destination token',
        },
      };
    }

    return { result: null, actualAmountReceived };
  } catch {
    return {
      result: {
        isValid: false,
        requiresManualApproval: true,
        reason:
          'Failed to calculate received amount - manual approval required',
      },
    };
  }
}

/**
 * Step 9: Compare actual amount with expected minimum
 */
function validateAmountMeetsMinimum(
  actualAmountReceived: string,
  expectedMinAmountOut: string,
  tokenDecimals: number,
): ValidationResult | null {
  const actualBigInt = BigInt(actualAmountReceived);
  const expectedBigInt = BigInt(expectedMinAmountOut);
  const isAmountValid = actualBigInt >= expectedBigInt;

  if (!isAmountValid) {
    const difference =
      Number(expectedBigInt - actualBigInt) / Math.pow(10, tokenDecimals);
    return {
      isValid: false,
      requiresManualApproval: true,
      reason: `Swap amount ${actualAmountReceived} is below minimum expected ${expectedMinAmountOut} (difference: ~${difference.toFixed(6)})`,
    };
  }

  return null;
}

/**
 * Validate swap amounts from scan results match expected quote
 * Strict validation: fails if scan results unavailable or simulation failed
 * Works for both single swaps (Action) and batch swaps (MultiTxAction)
 */
export function validateSwapAmounts(
  action: Action | MultiTxAction,
  context: any,
): ValidationResult {
  // Step 1: Validate minAmountOut
  const minAmountResult = validateMinAmountOut(context?.minAmountOut);
  if (minAmountResult) return minAmountResult;

  // Step 2: Validate simulation
  const simulationResult = validateSimulation(
    action.displayData?.isSimulationSuccessful,
  );
  if (simulationResult) return simulationResult;

  // Step 3: Validate balance change exists
  const balanceChange = action.displayData?.balanceChange;
  const balanceChangeResult = validateBalanceChange(balanceChange);
  if (balanceChangeResult) return balanceChangeResult;

  // Step 4: Validate token addresses
  const srcTokenAddress = context?.srcTokenAddress;
  const destTokenAddress = context?.destTokenAddress;
  const tokenAddressResult = validateTokenAddresses(
    srcTokenAddress,
    destTokenAddress,
  );
  if (tokenAddressResult) return tokenAddressResult;

  // Step 5: Find and validate source token
  const { result: sourceResult, sourceTokenOut } = validateSourceToken(
    balanceChange,
    srcTokenAddress,
    context?.isSrcTokenNative,
  );
  if (sourceResult) return sourceResult;

  // Step 6: Find and validate destination token
  const { result: destResult, destinationTokenIn } = validateDestinationToken(
    balanceChange,
    destTokenAddress,
    context?.isDestTokenNative,
  );
  if (destResult) return destResult;

  // Step 7: Validate USD prices
  const usdValidation = validateSwapUsdPrices(
    sourceTokenOut!,
    destinationTokenIn!,
    context,
  );
  if (!usdValidation.isValid) {
    return {
      isValid: false,
      requiresManualApproval: usdValidation.requiresManualApproval,
      reason: usdValidation.reason || 'USD price validation failed',
    };
  }

  // Step 8: Validate destination token has items
  const itemsResult = validateDestinationTokenItems(destinationTokenIn!);
  if (itemsResult) return itemsResult;

  // Step 9: Calculate actual amount received
  const { result: amountResult, actualAmountReceived } =
    calculateActualAmountReceived(destinationTokenIn!);
  if (amountResult) return amountResult;

  // Step 10: Validate amount meets minimum
  const minimumResult = validateAmountMeetsMinimum(
    actualAmountReceived!,
    context?.minAmountOut,
    destinationTokenIn!.token.decimals,
  );
  if (minimumResult) return minimumResult;

  return { isValid: true };
}
