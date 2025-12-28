import { Action, MaxBuyOption } from '@core/types';
import { ValidationResult } from '../../models';

/**
 * The fee percentage that Core gathers on Markr swaps.
 * An integer representing the basis points (BPS) of the fee percentage.
 * @example 85 -> 0.85%
 */
export const MARKR_PARTNER_FEE_BPS = 85;

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
    console.log('[SwapValidator:maxBuy] No limit set (unlimited)');
    return { isValid: true, requiresManualApproval: false };
  }

  console.log('[SwapValidator:maxBuy] Checking max buy limit:', {
    sourceUsdValue,
    maxBuyLimit,
    exceedsLimit: sourceUsdValue > maxBuyLimit,
  });

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
 * Helper function to find a token in balance change array by address
 */
export function findTokenInBalanceChange(
  balanceChangeArray: any[],
  tokenAddress: string,
  isNative: boolean,
): any | undefined {
  if (!balanceChangeArray || balanceChangeArray.length === 0) {
    return undefined;
  }

  for (const item of balanceChangeArray) {
    const token = item.token;
    if (!token) continue;

    // For native tokens, match by checking if token has no address or zero address
    if (isNative) {
      if (
        !token.address ||
        token.address === '0x0000000000000000000000000000000000000000'
      ) {
        return item;
      }
    } else {
      // For ERC20 tokens, match by address (case-insensitive)
      if (
        token.address &&
        token.address.toLowerCase() === tokenAddress.toLowerCase()
      ) {
        return item;
      }
    }
  }

  return undefined;
}

/**
 * Validate USD prices for swap and determine if auto-approval is safe
 * Returns validation result based on USD price comparison with slippage tolerance
 * Assumes balanceChange and tokens have already been validated
 */
export function validateSwapUsdPrices(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  balanceChange: any,
  sourceTokenOut: any,
  destinationTokenIn: any,
  context: any,
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

  console.log('[SwapValidator] USD price validation', {
    sourceUsdValue,
    destUsdValue,
    difference: destUsdValue - sourceUsdValue,
    percentageChange: ((destUsdValue - sourceUsdValue) / sourceUsdValue) * 100,
  });

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
  const feePercent = isSwapFeesEnabled ? MARKR_PARTNER_FEE_BPS / 10_000 : 0;
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
 * Validate swap amounts from scan results match expected quote
 * Strict validation: fails if scan results unavailable or simulation failed
 */
export function validateSwapAmounts(
  action: Action,
  context: any,
): ValidationResult {
  console.log('[SwapValidator:validateSwapAmounts] ━━━ START ━━━');
  console.log('[SwapValidator:validateSwapAmounts] Context received:', {
    minAmountOut: context?.minAmountOut,
    slippage: context?.slippage,
    maxBuy: context?.maxBuy,
    srcTokenAddress: context?.srcTokenAddress,
    destTokenAddress: context?.destTokenAddress,
    isSrcTokenNative: context?.isSrcTokenNative,
    isDestTokenNative: context?.isDestTokenNative,
    isSwapFeesEnabled: context?.isSwapFeesEnabled,
  });

  // Check if minAmountOut is 0 or undefined → manual approval needed
  const expectedMinAmountOut = context?.minAmountOut;
  if (!expectedMinAmountOut || expectedMinAmountOut === '0') {
    console.log(
      '[SwapValidator:validateSwapAmounts] ✗ minAmountOut missing or zero',
    );
    return {
      isValid: false,
      requiresManualApproval: true,
      reason: 'minAmountOut is missing or zero - manual approval required',
    };
  }

  // Check if simulation was successful - hard reject if failed
  const isSimulationSuccessful = action.displayData?.isSimulationSuccessful;
  console.log('[SwapValidator:validateSwapAmounts] Simulation status:', {
    isSimulationSuccessful,
    hasDisplayData: !!action.displayData,
  });

  if (isSimulationSuccessful === false) {
    console.log(
      '[SwapValidator:validateSwapAmounts] ✗ Simulation failed - HARD REJECT',
    );
    return {
      isValid: false,
      requiresManualApproval: false,
      reason: 'Transaction simulation failed - cannot safely auto-approve swap',
    };
  }

  // Get scan results from displayData
  const balanceChange = action.displayData?.balanceChange;
  if (!balanceChange) {
    console.log(
      '[SwapValidator:validateSwapAmounts] ✗ No balanceChange in displayData',
    );
    return {
      isValid: false,
      requiresManualApproval: true,
      reason:
        'No balance change data in scan results - cannot validate swap amounts',
    };
  }

  console.log('[SwapValidator:validateSwapAmounts] Balance change data:', {
    outsCount: balanceChange.outs?.length || 0,
    insCount: balanceChange.ins?.length || 0,
  });

  // Get token addresses from context
  const srcTokenAddress = context?.srcTokenAddress;
  const isSrcTokenNative = context?.isSrcTokenNative;
  const destTokenAddress = context?.destTokenAddress;
  const isDestTokenNative = context?.isDestTokenNative;

  if (!srcTokenAddress || !destTokenAddress) {
    console.log(
      '[SwapValidator:validateSwapAmounts] ✗ Missing token addresses',
    );
    return {
      isValid: false,
      requiresManualApproval: true,
      reason:
        'Missing source or destination token address in context - cannot identify tokens',
    };
  }

  // Validate balance change arrays exist
  if (!balanceChange.outs || balanceChange.outs.length === 0) {
    console.log('[SwapValidator:validateSwapAmounts] ✗ No outgoing tokens');
    return {
      isValid: false,
      requiresManualApproval: true,
      reason:
        'No outgoing tokens in balance change data - cannot validate source token',
    };
  }

  if (!balanceChange.ins || balanceChange.ins.length === 0) {
    console.log('[SwapValidator:validateSwapAmounts] ✗ No incoming tokens');
    return {
      isValid: false,
      requiresManualApproval: true,
      reason:
        'No incoming tokens in balance change data - cannot validate swap amounts',
    };
  }

  console.log('[SwapValidator:validateSwapAmounts] Looking for source token:', {
    srcTokenAddress,
    isSrcTokenNative,
  });

  // Find source token in outs (what user is sending)
  const sourceTokenOut = findTokenInBalanceChange(
    balanceChange.outs,
    srcTokenAddress,
    isSrcTokenNative,
  );

  if (!sourceTokenOut) {
    console.log(
      '[SwapValidator:validateSwapAmounts] ✗ Source token not found in outs',
    );
    return {
      isValid: false,
      requiresManualApproval: true,
      reason: `Could not find source token (${srcTokenAddress}) in balance change scan results`,
    };
  }

  console.log('[SwapValidator:validateSwapAmounts] ✓ Source token found:', {
    tokenSymbol: sourceTokenOut.token?.symbol,
    tokenAddress: sourceTokenOut.token?.address,
  });

  console.log(
    '[SwapValidator:validateSwapAmounts] Looking for destination token:',
    {
      destTokenAddress,
      isDestTokenNative,
    },
  );

  // Find destination token in ins (what user is receiving)
  const destinationTokenIn = findTokenInBalanceChange(
    balanceChange.ins,
    destTokenAddress,
    isDestTokenNative,
  );

  if (!destinationTokenIn) {
    console.log(
      '[SwapValidator:validateSwapAmounts] ✗ Destination token not found in ins',
    );
    return {
      isValid: false,
      requiresManualApproval: true,
      reason: `Could not find destination token (${destTokenAddress}) in balance change scan results`,
    };
  }

  console.log(
    '[SwapValidator:validateSwapAmounts] ✓ Destination token found:',
    {
      tokenSymbol: destinationTokenIn.token?.symbol,
      tokenAddress: destinationTokenIn.token?.address,
    },
  );

  // Validate USD prices first (before token amount validation)
  console.log(
    '[SwapValidator:validateSwapAmounts] ▶ Validating USD prices...',
  );
  const usdValidation = validateSwapUsdPrices(
    balanceChange,
    sourceTokenOut,
    destinationTokenIn,
    context,
  );
  if (!usdValidation.isValid) {
    console.log(
      '[SwapValidator:validateSwapAmounts] ✗ USD validation failed:',
      usdValidation.reason,
    );
    return {
      isValid: false,
      requiresManualApproval: usdValidation.requiresManualApproval,
      reason: usdValidation.reason || 'USD price validation failed',
    };
  }
  console.log('[SwapValidator:validateSwapAmounts] ✓ USD validation passed');

  // Validate destination token has items for amount validation
  if (!destinationTokenIn.items || destinationTokenIn.items.length === 0) {
    console.log(
      '[SwapValidator:validateSwapAmounts] ✗ Destination token has no items',
    );
    return {
      isValid: false,
      requiresManualApproval: true,
      reason: `Destination token found but has no items in balance change - cannot extract amount`,
    };
  }

  // Extract actual amount received for the destination token
  const tokenDecimals = destinationTokenIn.token?.decimals;
  if (tokenDecimals === undefined || tokenDecimals === null) {
    console.log('[SwapValidator:validateSwapAmounts] ✗ Token decimals missing');
    return {
      isValid: false,
      requiresManualApproval: true,
      reason:
        'Token decimals not found in scan results - cannot convert display value to raw amount',
    };
  }

  console.log(
    '[SwapValidator:validateSwapAmounts] ▶ Calculating received amount...',
    {
      tokenDecimals,
      itemCount: destinationTokenIn.items.length,
    },
  );

  const totalAmount = destinationTokenIn.items.reduce(
    (sum: bigint, item: any) => {
      // Convert displayValue to raw amount (considering decimals)
      const displayValue = item.displayValue || '0';
      // displayValue is already in human-readable format, convert back to raw
      const rawAmount = BigInt(
        Math.floor(parseFloat(displayValue) * Math.pow(10, tokenDecimals)),
      );
      console.log('[SwapValidator:validateSwapAmounts] Item:', {
        displayValue,
        rawAmount: rawAmount.toString(),
      });
      return sum + rawAmount;
    },
    0n,
  );

  const actualAmountReceived = totalAmount.toString();

  if (!actualAmountReceived || actualAmountReceived === '0') {
    console.log('[SwapValidator:validateSwapAmounts] ✗ Zero amount received');
    return {
      isValid: false,
      requiresManualApproval: true,
      reason:
        'Could not extract valid amount from scan results for destination token',
    };
  }

  // Compare actual amount with expected minimum
  const actualBigInt = BigInt(actualAmountReceived);
  const expectedBigInt = BigInt(expectedMinAmountOut);
  const isAmountValid = actualBigInt >= expectedBigInt;

  console.log('[SwapValidator:validateSwapAmounts] ▶ Amount comparison:', {
    expectedMinAmountOut,
    actualAmountReceived,
    difference: isAmountValid
      ? `+${(actualBigInt - expectedBigInt).toString()}`
      : `-${(expectedBigInt - actualBigInt).toString()}`,
    result: isAmountValid ? '✓ OK' : '✗ BELOW_MINIMUM',
    isSimulationSuccessful,
  });

  // Actual amount must be >= expected minimum
  if (!isAmountValid) {
    const difference =
      Number(expectedBigInt - actualBigInt) / Math.pow(10, tokenDecimals);
    console.log(
      '[SwapValidator:validateSwapAmounts] ✗ Amount below minimum, requires manual approval',
    );
    console.log(
      '[SwapValidator:validateSwapAmounts] ━━━ END (manual approval) ━━━',
    );
    return {
      isValid: false,
      requiresManualApproval: true,
      reason: `Swap amount ${actualAmountReceived} is below minimum expected ${expectedMinAmountOut} (difference: ~${difference.toFixed(6)})`,
    };
  }

  console.log('[SwapValidator:validateSwapAmounts] ✓ All validations passed!');
  console.log('[SwapValidator:validateSwapAmounts] ━━━ END (auto-approve) ━━━');
  return { isValid: true };
}
