import { useMemo } from 'react';
import { type Address } from 'viem';
import {
  type Asset,
  type TransferManager,
  RecurringEligibilityReason,
} from '@avalabs/fusion-sdk';

import { getRecurringTokenAddress } from '../../lib/getRecurringTokenAddress';

export type RecurringEligibility = {
  /** Pair-level support (chain + token + EVM address). Controls the toggle. */
  isEligible: boolean;
  /** Native → wrapped-native (e.g. AVAX → WAVAX): steer to a one-shot wrap. */
  isNativeToWrappedNative: boolean;
};

const NOT_ELIGIBLE: RecurringEligibility = {
  isEligible: false,
  isNativeToWrappedNative: false,
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
    // Guarded with try-catch: throws SERVICE_TYPE_NOT_CONFIGURED when the MARKR
    // service isn't initialized (e.g. feature flag off or older SDK version).
    let result: ReturnType<typeof manager.recurring.checkEligibility>;
    try {
      result = manager.recurring.checkEligibility({
        fromTokenAddress,
        toTokenAddress,
        sourceChainId,
        targetChainId,
        ownerAddress: ownerAddress as Address,
      });
    } catch {
      return NOT_ELIGIBLE;
    }

    if (result.eligible) {
      return { isEligible: true, isNativeToWrappedNative: false };
    }

    return {
      isEligible: false,
      isNativeToWrappedNative:
        result.reason === RecurringEligibilityReason.NativeToWrappedNative,
    };
  }, [
    manager,
    sourceAsset,
    targetAsset,
    sourceChainId,
    targetChainId,
    ownerAddress,
  ]);
