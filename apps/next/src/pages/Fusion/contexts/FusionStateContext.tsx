import {
  createContext,
  FC,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import {
  toast,
  useFeatureFlagContext,
  useNetworkFeeContext,
  useSettingsContext,
} from '@core/ui';
import { useHistory } from 'react-router-dom';
import { Quote } from '@avalabs/fusion-sdk';
import { bigIntToString } from '@avalabs/core-utils-sdk';
import { useDebouncedValue } from '@tanstack/react-pacer';

import { FeatureVars, isCrossChainTransfer } from '@core/types';
import {
  isUserRejectionError,
  Monitoring,
  resolve,
  stringToBigint,
  getTransferTxHash,
} from '@core/common';
import {
  useAccountsContext,
  useAnalyticsContext,
  useBalancesContext,
  useErrorMessage,
  useTransferTrackingContext,
} from '@core/ui';

import { useSwapFormError, useSwapQuery } from '../hooks';
import { usePriceImpact } from '../hooks/usePriceImpact';
import { shouldRetryWithNextQuote } from '../lib/swapErrors';
import {
  useUserAddresses,
  useTransferManager,
  useAssetAndChain,
  useQuotes,
  useSupportedChainsMap,
  useSwapSourceTokenList,
  useSwapSourceToken,
  useSwapTargetTokenList,
  useSwapTargetToken,
  useSlippageTolerance,
} from './hooks';
import { getSwapStatus } from './lib/getSwapStatus';
import { FusionState } from '../types';
import { useFusionMinimumTransferAmount } from './hooks/useMinimumTransferAmount';
import { useMaxButtonFeeEstimate } from './hooks/useMaxButtonFeeEstimate';
import { useMaxSwapAmount } from './hooks/useMaxSwapAmount';

const FusionStateContext = createContext<FusionState | undefined>(undefined);

export const FusionStateContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { selectFeatureFlag } = useFeatureFlagContext();
  const { trackTransfer } = useTransferTrackingContext();
  const { captureEncrypted } = useAnalyticsContext();
  const { replace } = useHistory();
  const { getNetworkFee } = useNetworkFeeContext();
  const getTranslatedError = useErrorMessage();
  const { feeSetting } = useSettingsContext();
  const {
    balances: { loading: isBalancesLoading },
  } = useBalancesContext();

  const [isConfirming, setIsConfirming] = useState(false);

  const {
    update: updateQuery,
    userAmount,
    fromId,
    toId,
    fromQuery,
    toQuery,
  } = useSwapQuery();

  const transferMarginBps = Number(
    selectFeatureFlag(FeatureVars.FUSION_TRANSFER_GAS_MARGIN_BPS),
  );

  const { manager, error: initializationError } = useTransferManager();
  const supportedChainsMap = useSupportedChainsMap(manager);
  const sourceTokenList = useSwapSourceTokenList(supportedChainsMap);
  const sourceToken = useSwapSourceToken(sourceTokenList, fromId);
  const targetTokenList = useSwapTargetTokenList(
    supportedChainsMap,
    sourceToken,
  );
  const targetToken = useSwapTargetToken(targetTokenList, sourceToken, toId);

  const { chain: sourceChain, asset: sourceAsset } =
    useAssetAndChain(sourceToken);
  const { chain: targetChain, asset: targetAsset } =
    useAssetAndChain(targetToken);

  const { fromAddress, toAddress } = useUserAddresses(
    activeAccount,
    sourceChain,
    targetChain,
  );

  const { slippage, setSlippage, autoSlippage, setAutoSlippage } =
    useSlippageTolerance();

  const sourceAmountBigInt =
    userAmount && sourceAsset
      ? stringToBigint(userAmount, sourceAsset.decimals)
      : 0n;

  const {
    data: minimumTransferAmount,
    isLoading: isMinimumTransferAmountLoading,
  } = useFusionMinimumTransferAmount({
    selectedFromToken: sourceToken,
    selectedToToken: targetToken,
    transferManager: manager,
  });

  const isAmountHigherThanBalance =
    sourceAmountBigInt > (sourceToken?.balance ?? 0n);

  const isAmountLowerThanMinimum =
    typeof minimumTransferAmount === 'bigint' &&
    sourceAmountBigInt < minimumTransferAmount;

  const skipFetching = isAmountHigherThanBalance || isAmountLowerThanMinimum;

  // Avoid spamming quoters by debouncing the user amount
  const [debouncedUserAmount] = useDebouncedValue(userAmount, {
    wait: 200,
    trailing: true,
    leading: false,
  });
  const debouncedSourceAmountBigInt =
    debouncedUserAmount && sourceAsset
      ? stringToBigint(debouncedUserAmount, sourceAsset.decimals)
      : 0n;

  const {
    bestQuote,
    quotes,
    userQuote,
    selectedQuote,
    isUserSelectedQuote,
    selectQuoteById,
    status: quotesStatus,
  } = useQuotes(
    {
      manager,
      fromAddress,
      toAddress,
      sourceAsset,
      sourceChain,
      targetAsset,
      targetChain,
      amount: debouncedSourceAmountBigInt,
      slippageBps: autoSlippage ? undefined : slippage * 100,
    },
    skipFetching,
  );

  const toAmount =
    selectedQuote && targetAsset
      ? bigIntToString(selectedQuote.amountOut, targetAsset.decimals)
      : undefined;

  const { priceImpact, priceImpactSeverity, priceImpactAvailability } =
    usePriceImpact(selectedQuote, sourceToken, targetToken);

  const transfer = useCallback(
    async (specificQuote?: Quote, autoRetryAttempt = 0) => {
      if (!manager) {
        throw new Error('Manager or quote not found');
      }

      setIsConfirming(true);

      const quoteToUse = specificQuote ?? selectedQuote;

      if (!quoteToUse) {
        throw new Error('Quote not found');
      }

      captureEncrypted('SwapReviewOrder', {
        provider: quoteToUse.aggregator.name,
        slippage,
      });

      try {
        const [fee] = await resolve(
          getNetworkFee(quoteToUse.sourceChain.chainId),
        );

        const gasSettings = fee
          ? {
              maxFeePerGas: fee[feeSetting].maxFeePerGas,
              maxPriorityFeePerGas: fee[feeSetting].maxPriorityFeePerGas,
            }
          : undefined;

        const transferObject = await manager.transferAsset({
          quote: quoteToUse,
          gasSettings: {
            estimateGasMarginBps: transferMarginBps,
            ...gasSettings,
          },
        });

        captureEncrypted('SwapConfirmed', {
          sourceAddress: fromAddress,
          targetAddress: toAddress,
          sourceChainId: quoteToUse.sourceChain.chainId,
          targetChainId: quoteToUse.targetChain.chainId,
          sourceTxHash: getTransferTxHash('source', transferObject),
          quoteSelectionMode: isUserSelectedQuote ? 'manual' : 'auto',
          autoRetryAttempt: isUserSelectedQuote ? undefined : autoRetryAttempt,
        });

        await trackTransfer(transferObject);

        replace(
          isCrossChainTransfer(transferObject)
            ? `/fusion-transfer/${transferObject.id}`
            : '/',
        );
      } catch (err) {
        if (isUserRejectionError(err)) {
          setIsConfirming(false);
          return;
        }

        // If no specific quote was selected manually by the user, retry with the next quote (if applicable).
        if (!isUserSelectedQuote && shouldRetryWithNextQuote(err)) {
          const currentQuoteIndex = quotes.findIndex(
            (q) => q.id === quoteToUse.id,
          );
          const nextQuote = quotes[currentQuoteIndex + 1];

          if (nextQuote) {
            return transfer(nextQuote, currentQuoteIndex + 1);
          }
        }

        setIsConfirming(false);

        console.error(err);
        Monitoring.sentryCaptureException(
          err as Error,
          Monitoring.SentryExceptionTypes.SWAP,
        );

        const { title, hint } = getTranslatedError(err);

        toast.error(title, {
          description: hint,
        });
      }
    },
    [
      manager,
      fromAddress,
      toAddress,
      slippage,
      replace,
      captureEncrypted,
      getTranslatedError,
      quotes,
      isUserSelectedQuote,
      selectedQuote,
      trackTransfer,
      transferMarginBps,
      getNetworkFee,
      feeSetting,
    ],
  );

  const { fee, isFeeLoading, feeError, minimalQuote } = useMaxButtonFeeEstimate(
    {
      manager,
      fromAddress,
      toAddress,
      sourceAsset,
      sourceChain,
      targetAsset,
      targetChain,
      sourceToken,
      minimumTransferAmount: isMinimumTransferAmountLoading
        ? undefined
        : minimumTransferAmount,
      slippageBps: autoSlippage ? undefined : slippage * 100,
    },
  );

  const { isLoading: isMaxSwapAmountLoading, maxAmount: maxSwapAmount } =
    useMaxSwapAmount({
      fee,
      sourceToken,
      minimalQuote,
    });

  const status = getSwapStatus(
    activeAccount,
    isBalancesLoading,
    manager,
    initializationError,
    sourceTokenList,
    targetTokenList,
    selectedQuote,
  );

  const formError = useSwapFormError({
    debouncedUserAmount,
    quotes,
    quotesStatus,
    sourceToken,
    fee,
    isFeeLoading,
    feeError,
    minimumTransferAmount,
    isMaxSwapAmountLoading,
    maxSwapAmount,
    minimalQuote,
  });

  return (
    <FusionStateContext.Provider
      value={{
        updateQuery,
        fromId,
        toId,
        fromQuery,
        toQuery,
        manager,
        userAmount,
        debouncedUserAmount,
        toAmount,
        priceImpact,
        priceImpactSeverity,
        priceImpactAvailability,
        sourceTokenList,
        targetTokenList,
        sourceToken,
        targetToken,
        account: activeAccount,
        isConfirming,
        slippage,
        setSlippage,
        autoSlippage,
        setAutoSlippage,
        status,
        userQuote,
        bestQuote,
        selectedQuote,
        quotes,
        quotesStatus,
        selectQuoteById,
        transfer,
        minimumTransferAmount,
        fee,
        isFeeLoading,
        feeError,
        maxSwapAmount,
        isMaxSwapAmountLoading,
        minimalQuote,
        formError,
      }}
    >
      {children}
    </FusionStateContext.Provider>
  );
};

export const useFusionState = () => {
  const context = useContext(FusionStateContext);
  if (!context) {
    throw new Error(
      'useFusionState must be used within FusionStateContextProvider',
    );
  }

  return context;
};
