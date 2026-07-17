import {
  createContext,
  FC,
  useCallback,
  useContext,
  useMemo,
  useEffect,
  useLayoutEffect,
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
import { ERC_ZERO_ADDRESS, Quote, ServiceType } from '@avalabs/fusion-sdk';
import { bigIntToString } from '@avalabs/core-utils-sdk';
import { useDebouncedValue } from '@tanstack/react-pacer';

import {
  type FungibleTokenBalance,
  FeatureVars,
  getUniqueTokenId,
  isCrossChainTransfer,
} from '@core/types';
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
  MIN_FREQUENCY_INTERVAL_SECONDS,
  getMinFrequencyMinutes,
  isFrequencyBelowMinimum,
} from '../lib/formatFrequency';
import {
  useUserAddresses,
  useTransferManager,
  useAssetAndChain,
  useQuotes,
  useSupportedChainsMap,
  useSwapSourceTokenList,
  useSwapSourceToken,
  useBridgeableTargetTokenList,
  useSwapTargetToken,
  useSlippageTolerance,
  useCreateRecurringSwap,
  useRecurringEligibility,
  useRecurringQuote,
} from './hooks';
import { getSwapStatus } from './lib/getSwapStatus';
import { FusionState } from '../types';
import { useFusionMinimumTransferAmount } from './hooks/useMinimumTransferAmount';
import { useRequiredTokenAmounts } from './hooks/useRequiredTokenAmounts';
import { useMinimalQuote } from './hooks/useMinimalQuote';
import { useRecurringSwapState } from './RecurringSwapContext';
import { isAvalancheCctRoute } from '../lib/isAvalancheCctRoute';

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
    updateBalanceOnNetworks,
  } = useBalancesContext();

  const [isConfirming, setIsConfirming] = useState(false);

  // Chip the user is browsing while the target dropdown is open.
  const [browseTargetChainId, setBrowseTargetChainId] = useState<
    number | 'avalanche' | null
  >('avalanche');
  // Chain of the committed target token.
  const [committedTargetChainId, setCommittedTargetChainId] = useState<
    number | 'avalanche' | null
  >('avalanche');
  const [isTargetSelectOpen, _setIsTargetSelectOpen] = useState(false);

  // While open the user browses freely; while closed we always reflect the
  // committed chain, so a "browse then dismiss" leaves the selection untouched.
  const selectedTargetChainId = isTargetSelectOpen
    ? browseTargetChainId
    : committedTargetChainId;

  const setIsTargetSelectOpen = useCallback(
    (open: boolean) => {
      // Start each browse session from the committed chain.
      if (open) {
        setBrowseTargetChainId(committedTargetChainId);
      }
      _setIsTargetSelectOpen(open);
    },
    [committedTargetChainId],
  );

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
  const sourceTokenId = sourceToken ? getUniqueTokenId(sourceToken) : undefined;
  const {
    tokens: targetTokenList,
    fetchNextPage: fetchNextTargetTokenPage,
    hasNextPage: hasNextTargetTokenPage,
    isLoading: isTargetTokenListLoading,
    isFetching: isTargetTokenListFetching,
    targetChainOptions,
  } = useBridgeableTargetTokenList(
    manager,
    supportedChainsMap,
    sourceToken,
    toQuery,
    selectedTargetChainId,
  );
  // Skip default selection while browsing so opening another chain never
  // auto-picks a token there.
  const candidateTargetToken = useSwapTargetToken(
    targetTokenList,
    sourceToken,
    toId,
    isTargetSelectOpen,
  );
  const isTargetSearchActive = !!(toQuery && toQuery.length >= 2);

  // Committed target token used by quotes and the trigger. Frozen while the
  // dropdown is open so browsing other chains never changes the selection.
  const [targetToken, setTargetToken] = useState<
    FungibleTokenBalance | undefined
  >(undefined);
  // Source token id at the moment the target id was committed.
  const [targetTokenSourceTokenId, setTargetTokenSourceTokenId] = useState<
    string | undefined
  >(undefined);
  const shouldKeepExplicitTarget =
    !!toId &&
    !!targetToken &&
    sourceTokenId !== undefined &&
    targetTokenSourceTokenId === sourceTokenId &&
    getUniqueTokenId(targetToken) === toId;

  useEffect(() => {
    if (isTargetSelectOpen) {
      return;
    }
    // Adopt a resolved candidate right away.
    if (candidateTargetToken) {
      setTargetToken(candidateTargetToken);
      return;
    }
    // Candidate is undefined: only clear the committed token once the list has
    // settled. While it's still fetching (e.g. right after a source change) keep
    // showing the previous token to avoid a deselect/reselect flicker when the
    // token is actually still a valid target on the incoming list.
    if (!isTargetTokenListFetching) {
      if (shouldKeepExplicitTarget) {
        return;
      }
      if (hasNextTargetTokenPage) {
        return;
      }
      const [onlyTargetToken] = targetTokenList;
      if (
        toId &&
        targetTokenList.length === 1 &&
        onlyTargetToken &&
        getUniqueTokenId(onlyTargetToken) !== sourceTokenId
      ) {
        setTargetToken(onlyTargetToken);
        setTargetTokenSourceTokenId(sourceTokenId);
        updateQuery({ to: getUniqueTokenId(onlyTargetToken) });
        return;
      }
      setTargetToken(undefined);
    }
  }, [
    candidateTargetToken,
    isTargetSelectOpen,
    isTargetTokenListFetching,
    hasNextTargetTokenPage,
    toId,
    targetToken,
    sourceTokenId,
    targetTokenSourceTokenId,
    shouldKeepExplicitTarget,
    targetTokenList,
    updateQuery,
  ]);

  // Persist an auto-selected target (default / single option) into the query id
  // so later source changes validate it — keep it while it's still a supported
  // route, deselect it otherwise — instead of re-running the default finder.
  useEffect(() => {
    if (!isTargetSelectOpen && targetToken && !toId) {
      setTargetTokenSourceTokenId(sourceTokenId);
      updateQuery({ to: getUniqueTokenId(targetToken) });
    }
  }, [isTargetSelectOpen, targetToken, toId, updateQuery, sourceTokenId]);

  // Keep the committed target chain usable for the current source. Reroute to
  // Avalanche (or the first available chain) when the committed chain either
  // isn't a valid target chain anymore, or has settled with no bridgeable
  // tokens for this source (e.g. switching to another same-chain source that
  // can't reach it). This avoids the "no routes" screen while other chains
  // still have targets, and lets the now-invalid target deselect. Runs before
  // paint so the corrected chain is applied in the same frame without a flash.
  useLayoutEffect(() => {
    if (targetChainOptions.length === 0) {
      return;
    }
    const isCommittedChainReachable = targetChainOptions.some(
      (option) => option.chainId === committedTargetChainId,
    );
    const isCommittedChainEmpty =
      !isTargetSelectOpen &&
      !isTargetSearchActive &&
      !isTargetTokenListFetching &&
      !shouldKeepExplicitTarget &&
      targetTokenList.length === 0;

    if (isCommittedChainReachable && !isCommittedChainEmpty) {
      return;
    }
    const fallbackChainId =
      targetChainOptions.find((option) => option.chainId === 'avalanche')
        ?.chainId ?? targetChainOptions[0]?.chainId;
    if (
      fallbackChainId !== undefined &&
      fallbackChainId !== committedTargetChainId
    ) {
      setCommittedTargetChainId(fallbackChainId);
    }
  }, [
    targetChainOptions,
    committedTargetChainId,
    isTargetSelectOpen,
    isTargetSearchActive,
    isTargetTokenListFetching,
    shouldKeepExplicitTarget,
    targetTokenList,
  ]);

  // Called only when the user explicitly picks a token — commits its chain.
  const onTargetTokenChange = useCallback(
    (tokenId: string) => {
      if (tokenId === sourceTokenId) {
        setTargetToken(undefined);
        setTargetTokenSourceTokenId(undefined);
        updateQuery({ to: tokenId, toQuery: '' });
        return;
      }

      // Set the token immediately so shouldKeepExplicitSelection can protect it
      // if it's an unverified token absent from the default (un-searched) list.
      const token = targetTokenList.find(
        (t) => getUniqueTokenId(t) === tokenId,
      );
      if (token) {
        setTargetToken(token);
      }
      setCommittedTargetChainId(browseTargetChainId);
      setTargetTokenSourceTokenId(sourceTokenId);
      updateQuery({ to: tokenId, toQuery: '' });
    },
    [browseTargetChainId, updateQuery, sourceTokenId, targetTokenList],
  );

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

  const {
    isRecurring,
    frequencyUnit,
    frequencyQuantity,
    numberOfOrders,
    resetForm,
  } = useRecurringSwapState();

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
    serviceType: isRecurring ? ServiceType.MARKR : undefined,
  });

  const isAmountHigherThanBalance =
    sourceAmountBigInt > (sourceToken?.balance ?? 0n);

  const isAmountBelowMinimumTransferAmount =
    typeof minimumTransferAmount === 'bigint' &&
    sourceAmountBigInt < minimumTransferAmount;
  const shouldAllowBelowMinimumQuote =
    isAvalancheCctRoute({
      sourceAsset,
      sourceChain,
      targetAsset,
      targetChain,
    }) && !isRecurring;

  const skipFetching =
    isAmountHigherThanBalance ||
    (isAmountBelowMinimumTransferAmount && !shouldAllowBelowMinimumQuote);

  // Avoid spamming quoters by debouncing the user amount
  const [debouncedUserAmount] = useDebouncedValue(userAmount, {
    wait: 200,
    trailing: true,
    leading: false,
  });
  const debouncedSourceAmountBigInt =
    debouncedUserAmount !== '' && sourceAsset
      ? stringToBigint(debouncedUserAmount, sourceAsset.decimals)
      : undefined;

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

        // HyperEVM is not indexed by the balance service, so do not rely on
        // the normal cache cadence to reflect a completed swap. Refresh both
        // sides of the route (a same-chain swap naturally de-duplicates).
        const chainIds = [
          ...new Set(
            [sourceToken?.coreChainId, targetToken?.coreChainId].filter(
              (chainId): chainId is number => typeof chainId === 'number',
            ),
          ),
        ];

        if (activeAccount && chainIds.length > 0) {
          void updateBalanceOnNetworks([activeAccount], chainIds).catch(
            (error) => {
              // A refresh failure must not make an already-submitted swap fail.
              console.error(
                '[Fusion] Failed to refresh balances after swap',
                error,
              );
            },
          );
        }

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
      activeAccount,
      fromAddress,
      toAddress,
      slippage,
      replace,
      captureEncrypted,
      getTranslatedError,
      quotes,
      isUserSelectedQuote,
      selectedQuote,
      sourceToken?.coreChainId,
      targetToken?.coreChainId,
      trackTransfer,
      updateBalanceOnNetworks,
      transferMarginBps,
      getNetworkFee,
      feeSetting,
    ],
  );

  const recurringEligibility = useRecurringEligibility({
    manager,
    sourceAsset,
    targetAsset,
    sourceChainId: sourceToken?.coreChainId,
    targetChainId: targetToken?.coreChainId,
    ownerAddress: fromAddress,
  });

  const { scheduleFee: recurringScheduleFee } = useRecurringQuote({
    manager,
    sourceAsset,
    targetAsset,
    sourceChain,
    amount: sourceAmountBigInt,
    slippageBps: autoSlippage ? undefined : slippage * 100,
    frequency: { unit: frequencyUnit, value: frequencyQuantity },
    numberOfOrders,
    enabled: isRecurring && recurringEligibility.isEligible,
  });

  const { createRecurringSwap, isCreatingRecurringSwap } =
    useCreateRecurringSwap({
      manager,
      fromAddress,
      sourceAsset,
      targetAsset,
      sourceChain,
      amount: sourceAmountBigInt,
      slippageBps: autoSlippage ? undefined : slippage * 100,
      gasMarginBps: transferMarginBps,
      frequency: { unit: frequencyUnit, value: frequencyQuantity },
      numberOfOrders,
      onCreated: resetForm,
    });

  const minimalQuote = useMinimalQuote({
    manager,
    fromAddress,
    toAddress,
    sourceAsset,
    sourceToken,
    sourceChain,
    targetAsset,
    targetChain,
    minimumTransferAmount: isMinimumTransferAmountLoading
      ? undefined
      : minimumTransferAmount,
    slippageBps: autoSlippage ? undefined : slippage * 100,
  });

  const status = getSwapStatus(
    activeAccount,
    isBalancesLoading,
    manager,
    initializationError,
    sourceTokenList,
    targetTokenList,
    selectedQuote,
    isTargetTokenListLoading,
    isTargetSearchActive,
    isTargetSelectOpen,
    isTargetTokenListFetching,
    !!targetToken,
  );

  const minimumRequiredTokens = useRequiredTokenAmounts(manager, minimalQuote);
  const currentRequiredTokens = useRequiredTokenAmounts(manager, selectedQuote);

  const isRecurringSubmission = isRecurring && recurringEligibility.isEligible;

  const minFrequencySeconds =
    recurringEligibility.minFrequencySeconds ?? MIN_FREQUENCY_INTERVAL_SECONDS;

  const recurringScheduleFeeNativeAmount = useMemo(() => {
    if (!isRecurringSubmission || !recurringScheduleFee) {
      return 0n;
    }
    const isNativeFee =
      recurringScheduleFee.token.address.toLowerCase() ===
      ERC_ZERO_ADDRESS.toLowerCase();
    return isNativeFee ? recurringScheduleFee.amount : 0n;
  }, [isRecurringSubmission, recurringScheduleFee]);

  const formError = useSwapFormError({
    debouncedUserAmount,
    quotes,
    quotesStatus,
    sourceToken,
    minimumTransferAmount,
    currentRequiredTokens,
    recurring: isRecurringSubmission
      ? {
          numberOfOrders,
          scheduleFeeNativeAmount: recurringScheduleFeeNativeAmount,
          isFrequencyBelowMinimum: isFrequencyBelowMinimum(
            frequencyQuantity,
            frequencyUnit,
            minFrequencySeconds,
          ),
          minFrequencyMinutes: getMinFrequencyMinutes(minFrequencySeconds),
        }
      : undefined,
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
        fetchNextTargetTokenPage,
        isTargetTokenListLoading,
        isTargetTokenListFetching,
        targetChainOptions,
        selectedTargetChainId,
        setSelectedTargetChainId: setBrowseTargetChainId,
        setIsTargetSelectOpen,
        onTargetTokenChange,
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
        createRecurringSwap,
        isCreatingRecurringSwap,
        recurringEligibility,
        recurringScheduleFee,
        minimumTransferAmount,
        minimalQuote,
        formError,
        minimumRequiredTokens,
        currentRequiredTokens,
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
