import { useMemo } from 'react';
import { type Address } from 'viem';
import {
  type Asset,
  type TransferManager,
  RecurringEligibilityReason,
  isServiceUnavailableError,
} from '@avalabs/fusion-sdk';

import { getRecurringTokenAddress } from '../../lib/getRecurringTokenAddress';

export type RecurringEligibility = {
  /** Pair-level support (chain + token + EVM address). Controls the toggle. */
  isEligible: boolean;
  /** A non-zero amount was entered but it's below the per-order minimum. */
  isBelowMinimum: boolean;
  /** Per-order minimum (smallest unit), when known. */
  minimumAmount: bigint | undefined;
};

const NOT_ELIGIBLE: RecurringEligibility = {
  isEligible: false,
  isBelowMinimum: false,
  minimumAmount: undefined,
};

type UseRecurringEligibilityProps = {
  manager: TransferManager | undefined;
  sourceAsset: Asset | undefined;
  targetAsset: Asset | undefined;
  sourceChainId: number | undefined;
  targetChainId: number | undefined;
  ownerAddress: string | undefined;
  /** Per-order amount (smallest unit). `0n` skips the minimum check. */
  amount: bigint;
  enabled: boolean;
};

export const useRecurringEligibility = ({
  manager,
  sourceAsset,
  targetAsset,
  sourceChainId,
  targetChainId,
  ownerAddress,
  amount,
  enabled,
}: UseRecurringEligibilityProps): RecurringEligibility =>
  useMemo(() => {
    if (
      !enabled ||
      !manager ||
      !sourceAsset ||
      !targetAsset ||
      sourceChainId === undefined ||
      targetChainId === undefined ||
      !ownerAddress
    ) {
      return NOT_ELIGIBLE;
    }

    const fromTokenAddress = getRecurringTokenAddress(sourceAsset);
    const toTokenAddress = getRecurringTokenAddress(targetAsset);

    if (!fromTokenAddress || !toTokenAddress) {
      return NOT_ELIGIBLE;
    }

    // Pure, no-I/O check against the SDK's cached `/info/chains` metadata.
    // Passing `amount` only when > 0 keeps the toggle visible (pair stays
    // eligible) before the user has typed anything, while still flagging a
    // too-small amount once they have.
    const result = (() => {
      try {
        return manager.recurring.checkEligibility({
          fromTokenAddress,
          toTokenAddress,
          sourceChainId,
          targetChainId,
          ownerAddress: ownerAddress as Address,
          amount: amount > 0n ? amount : undefined,
        });
      } catch (err) {
        if (isServiceUnavailableError(err)) {
          return undefined;
        }

        throw err;
      }
    })();

    if (!result) {
      return NOT_ELIGIBLE;
    }

    if (result.eligible) {
      return {
        isEligible: true,
        isBelowMinimum: false,
        minimumAmount: BigInt(result.minimumAmount),
      };
    }

    // The pair is supported — only the amount is too low — so keep the form
    // visible and surface the minimum to the caller.
    if (result.reason === RecurringEligibilityReason.AmountBelowMinimum) {
      return {
        isEligible: true,
        isBelowMinimum: true,
        minimumAmount: BigInt(result.minimumAmount),
      };
    }

    return NOT_ELIGIBLE;
  }, [
    manager,
    sourceAsset,
    targetAsset,
    sourceChainId,
    targetChainId,
    ownerAddress,
    amount,
    enabled,
  ]);
