import { useMemo } from 'react';
import { type Address } from 'viem';
import {
  type Asset,
  type TransferManager,
  isServiceUnavailableError,
} from '@avalabs/fusion-sdk';

import { getRecurringTokenAddress } from '../../lib/getRecurringTokenAddress';

export type RecurringEligibility = {
  /** Pair-level support (chain + token + EVM address). Controls the toggle. */
  isEligible: boolean;
};

const NOT_ELIGIBLE: RecurringEligibility = {
  isEligible: false,
};

type UseRecurringEligibilityProps = {
  manager: TransferManager | undefined;
  sourceAsset: Asset | undefined;
  targetAsset: Asset | undefined;
  sourceChainId: number | undefined;
  targetChainId: number | undefined;
  ownerAddress: string | undefined;
};

export const useRecurringEligibility = ({
  manager,
  sourceAsset,
  targetAsset,
  sourceChainId,
  targetChainId,
  ownerAddress,
}: UseRecurringEligibilityProps): RecurringEligibility =>
  useMemo(() => {
    if (
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
    let result: ReturnType<typeof manager.recurring.checkEligibility>;
    try {
      result = manager.recurring.checkEligibility({
        fromTokenAddress,
        toTokenAddress,
        sourceChainId,
        targetChainId,
        ownerAddress: ownerAddress as Address,
      });
    } catch (err) {
      // `manager.recurring` throws ServiceUnavailableError when Markr isn't
      // initialized (e.g. feature flag off / non-PROD env) — an expected
      // "ineligible" signal. Any other error is unexpected, so log it rather
      // than masking a real regression. Either way we return ineligible to
      // keep this render-time check from crashing the tree.
      if (!isServiceUnavailableError(err)) {
        console.error('Unexpected error from recurring.checkEligibility', err);
      }
      return NOT_ELIGIBLE;
    }

    return { isEligible: result.eligible };
  }, [
    manager,
    sourceAsset,
    targetAsset,
    sourceChainId,
    targetChainId,
    ownerAddress,
  ]);
