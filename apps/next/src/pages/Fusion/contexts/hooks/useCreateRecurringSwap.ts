import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { type Address } from 'viem';
import {
  type Asset,
  type Chain,
  type RecurringFrequency,
  type TransferManager,
} from '@avalabs/fusion-sdk';

import {
  toast,
  useAnalyticsContext,
  useErrorMessage,
  useNetworkFeeContext,
  useSettingsContext,
} from '@core/ui';
import { isUserRejectionError, Monitoring, resolve } from '@core/common';

import { getRecurringSwapsPath } from '@/config/routes';

import { getRecurringTokenAddress } from '../../lib/getRecurringTokenAddress';

type UseCreateRecurringSwapProps = {
  manager: TransferManager | undefined;
  fromAddress: string | undefined;
  sourceAsset: Asset | undefined;
  targetAsset: Asset | undefined;
  /** Source chain — forwarded to the SDK for allowance + gas + dispatch. */
  sourceChain: Chain | undefined;
  /** Numeric EVM chain id the recurring schedule lives on (C-Chain only today). */
  sourceChainId: number | undefined;
  /** Per-order input amount, in `sourceAsset`'s smallest unit. */
  amount: bigint;
  /** Basis points; omit to let Markr apply its recommended slippage. */
  slippageBps?: number;
  /** Safety margin (bps) applied to the SDK's gas estimate. */
  gasMarginBps: number;
  frequency: RecurringFrequency;
  numberOfOrders: number;
  /** Called once the first-fill transaction is broadcast. */
  onCreated?: () => void;
};

export const useCreateRecurringSwap = ({
  manager,
  fromAddress,
  sourceAsset,
  targetAsset,
  sourceChain,
  sourceChainId,
  amount,
  slippageBps,
  gasMarginBps,
  frequency,
  numberOfOrders,
  onCreated,
}: UseCreateRecurringSwapProps) => {
  const { t } = useTranslation();
  const { captureEncrypted } = useAnalyticsContext();
  const { replace } = useHistory();
  const { getNetworkFee } = useNetworkFeeContext();
  const { feeSetting } = useSettingsContext();
  const getTranslatedError = useErrorMessage();

  const [isCreatingRecurringSwap, setIsCreatingRecurringSwap] = useState(false);

  const createRecurringSwap = useCallback(async () => {
    if (
      !manager ||
      !fromAddress ||
      !sourceAsset ||
      !targetAsset ||
      !sourceChain ||
      sourceChainId === undefined
    ) {
      throw new Error('Missing data required to create a recurring swap');
    }

    setIsCreatingRecurringSwap(true);

    const from = fromAddress as Address;
    const tokenIn = getRecurringTokenAddress(sourceAsset);
    const tokenOut = getRecurringTokenAddress(targetAsset);

    if (!tokenIn || !tokenOut) {
      throw new Error('Unsupported recurring swap asset type');
    }

    try {
      const quote = await manager.recurring.quote({
        chainId: sourceChainId,
        tokenIn,
        tokenInDecimals: sourceAsset.decimals,
        tokenOut,
        tokenOutDecimals: targetAsset.decimals,
        amount,
        numberOfOrders,
        frequency,
        slippage: slippageBps,
      });

      captureEncrypted('RecurringSwapReviewOrder', {
        frequencyUnit: frequency.unit,
        frequencyValue: frequency.value,
        numberOfOrders: quote.numberOfOrders,
      });

      const [fee] = await resolve(getNetworkFee(sourceChain.chainId));
      const gasSettings = {
        estimateGasMarginBps: gasMarginBps,
        ...(fee
          ? {
              maxFeePerGas: fee[feeSetting].maxFeePerGas,
              maxPriorityFeePerGas: fee[feeSetting].maxPriorityFeePerGas,
            }
          : {}),
      };

      // The SDK reads the on-chain allowance against `quote.totalAmountIn`,
      // signs an `approve` when short, then signs and broadcasts the first
      // fill — all through the `evmSigner` injected into the manager. We no
      // longer build, sign, or dispatch any of these transactions ourselves.
      const { txHash } = await manager.recurring.executeFirstFill({
        quote,
        fromAddress: from,
        sourceChain,
        gasSettings,
        fallbackToDefaultOnBatchFailure: true,
      });

      captureEncrypted('RecurringSwapConfirmed', {
        chainId: sourceChainId,
        numberOfOrders: quote.numberOfOrders,
        sourceTxHash: txHash,
      });

      toast.success(t('Recurring swap scheduled'));

      onCreated?.();
      replace(getRecurringSwapsPath());
    } catch (err) {
      setIsCreatingRecurringSwap(false);

      if (isUserRejectionError(err)) {
        return;
      }

      console.error(err);
      Monitoring.sentryCaptureException(
        err as Error,
        Monitoring.SentryExceptionTypes.SWAP,
      );

      const { title, hint } = getTranslatedError(err);
      toast.error(title, { description: hint });
    }
  }, [
    manager,
    fromAddress,
    sourceAsset,
    targetAsset,
    sourceChain,
    sourceChainId,
    amount,
    slippageBps,
    gasMarginBps,
    frequency,
    numberOfOrders,
    getNetworkFee,
    feeSetting,
    captureEncrypted,
    getTranslatedError,
    replace,
    onCreated,
    t,
  ]);

  return {
    createRecurringSwap,
    isCreatingRecurringSwap,
  };
};
