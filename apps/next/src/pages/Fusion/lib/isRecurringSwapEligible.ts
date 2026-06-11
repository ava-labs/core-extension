import { ChainId } from '@avalabs/core-chains-sdk';

import type { FungibleTokenBalance } from '@core/types';

type EligibilityInput = {
  sourceToken?: FungibleTokenBalance;
  targetToken?: FungibleTokenBalance;
};

// Placeholder eligibility check. Will be replaced by a helper from
// `@avalabs/fusion-sdk` once available.
// For now we only allow recurring swaps where the source token is
// USDC on Avalanche C-Chain and the swap stays on the same chain.
export const isRecurringSwapEligible = ({
  sourceToken,
  targetToken,
}: EligibilityInput): boolean => {
  if (!sourceToken || !targetToken) {
    return false;
  }

  if (sourceToken.symbol !== 'USDC') {
    return false;
  }

  if (sourceToken.coreChainId !== ChainId.AVALANCHE_MAINNET_ID) {
    return false;
  }

  if (targetToken.coreChainId !== ChainId.AVALANCHE_MAINNET_ID) {
    return false;
  }

  return true;
};
