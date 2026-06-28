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
  useConnectionContext,
  useErrorMessage,
  useNetworkFeeContext,
  useSettingsContext,
} from '@core/ui';
import {
  caipToChainId,
  isUserRejectionError,
  Monitoring,
  resolve,
} from '@core/common';
import { ExtensionRequest } from '@core/types';
import type { DiscoverRecurringSwaps } from '@core/service-worker';

import { getRecurringSwapsPath } from '@/config/routes';

import { getRecurringTokenAddress } from '../../lib/getRecurringTokenAddress';
import type { RecurringSignerContext } from '../../lib/signers';

type UseCreateRecurringSwapProps = {
  manager: TransferManager | undefined;
  fromAddress: string | undefined;
  sourceAsset: Asset | undefined;
  targetAsset: Asset | undefined;
  sourceChain: Chain | undefined;
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
  const { request } = useConnectionContext();
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
      !sourceChain.chainId
    ) {
      return;
    }

    const from = fromAddress as Address;
    const tokenIn = getRecurringTokenAddress(sourceAsset);
    const tokenOut = getRecurringTokenAddress(targetAsset);

    if (!tokenIn || !tokenOut) {
      return;
    }

    setIsCreatingRecurringSwap(true);

    try {
      const quote = await manager.recurring.quote({
        chainId: caipToChainId(sourceChain.chainId),
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

      // Rides with the request onto `step.signerContext` so the approval screen
      // can render token symbols (the SDK's synthetic quote ships empty ones).
      const signerContext: RecurringSignerContext = {
        fromTokenSymbol: sourceAsset.symbol,
        toTokenSymbol: targetAsset.symbol,
      };

      // The SDK reads the on-chain allowance, signs an approval when needed,
      // then signs and broadcasts the first fill via the injected evmSigner.
      const { txHash } = await manager.recurring.executeFirstFill({
        quote,
        fromAddress: from,
        sourceChain,
        gasSettings,
        fallbackToDefaultOnBatchFailure: true,
        signerContext,
      });

      captureEncrypted('RecurringSwapConfirmed', {
        chainId: caipToChainId(sourceChain.chainId),
        numberOfOrders: quote.numberOfOrders,
        sourceTxHash: txHash,
      });

      toast.success(t('Recurring swap scheduled'));

      onCreated?.();
      replace(getRecurringSwapsPath());

      // Hand off the order discovery to the service worker.
      request<DiscoverRecurringSwaps>({
        method: ExtensionRequest.NOTIFICATION_DISCOVER_RECURRING_SWAPS,
      }).catch((err) => {
        Monitoring.sentryCaptureException(
          err as Error,
          Monitoring.SentryExceptionTypes.NOTIFICATIONS,
        );
      });
    } catch (err) {
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
    } finally {
      setIsCreatingRecurringSwap(false);
    }
  }, [
    manager,
    fromAddress,
    sourceAsset,
    targetAsset,
    sourceChain,
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
    request,
    t,
  ]);

  return {
    createRecurringSwap,
    isCreatingRecurringSwap,
  };
};
