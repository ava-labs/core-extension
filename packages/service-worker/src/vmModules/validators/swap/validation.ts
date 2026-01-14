import { Action, MaxBuyOption, MultiTxAction } from '@core/types';
import {
  stringToBigint,
  BASIS_POINTS_DIVISOR,
  MARKR_PARTNER_FEE_BPS,
} from '@core/common';
import { ValidationResult } from '../../models';
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
      reason: 'Unable to verify token details or pricing',
    };
  }

  if (!destinationTokenIn.items || destinationTokenIn.items.length === 0) {
    return {
      isValid: false,
      requiresManualApproval: true,
      reason: 'Unable to verify token details or pricing',
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
      reason: 'Unable to verify swap details due to currency price data',
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
      reason: 'Unable to verify slippage impact',
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
  return {
    isValid: false,
    requiresManualApproval: true,
    reason: 'Slippage tolerance exceeded',
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
      reason: 'Unable to verify balance change information',
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
      reason: 'Unable to verify balance change information',
    };
  }

  if (!balanceChange.outs || balanceChange.outs.length === 0) {
    return {
      isValid: false,
      requiresManualApproval: true,
      reason: 'Unable to verify balance change information',
    };
  }

  if (!balanceChange.ins || balanceChange.ins.length === 0) {
    return {
      isValid: false,
      requiresManualApproval: true,
      reason: 'Unable to verify balance change information',
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
      reason: 'Unable to verify balance change information',
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
        reason: 'Unable to verify token details or pricing',
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
        reason: 'Unable to verify token details or pricing',
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
      reason: 'Unable to verify token details or pricing',
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
        reason: 'Unable to verify token details or pricing',
      },
    };
  }

  try {
    const totalAmount = destinationTokenIn.items.reduce(
      (sum: bigint, item: any) => {
        const displayValue = item.displayValue || '0';
        const rawAmount = stringToBigint(displayValue, tokenDecimals);
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
          reason: 'Unable to verify balance change information',
        },
      };
    }

    return { result: null, actualAmountReceived };
  } catch {
    return {
      result: {
        isValid: false,
        requiresManualApproval: true,
        reason: 'Unable to verify balance change information',
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
): ValidationResult | null {
  const actualBigInt = BigInt(actualAmountReceived);
  const expectedBigInt = BigInt(expectedMinAmountOut);
  const isAmountValid = actualBigInt >= expectedBigInt;

  if (!isAmountValid) {
    return {
      isValid: false,
      requiresManualApproval: true,
      reason: 'Swap amount is below the minimum expected quantity',
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
  );
  if (minimumResult) return minimumResult;

  return { isValid: true };
}
