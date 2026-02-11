import {
  createContext,
  FC,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { useHistory } from 'react-router-dom';
import { Quote } from '@avalabs/unified-asset-transfer';
import { bigIntToString } from '@avalabs/core-utils-sdk';

import { Account } from '@core/types';
import { isUserRejectionError, Monitoring, stringToBigint } from '@core/common';
import {
  useAccountsContext,
  SwapError,
  useAnalyticsContext,
  useErrorMessage,
} from '@core/ui';

import { DEFAULT_SLIPPAGE } from '../fusion-config';
import { useSwapQuery, useSwapTokens } from '../hooks';
import {
  useUserAddresses,
  useTransferManager,
  useSigners,
  useAssetAndChain,
  useQuotes,
} from './hooks';
import { toast } from '@avalabs/k2-alpine';
import { shouldRetryWithNextQuote } from '../lib/swapErrors';

type QueryState = Omit<ReturnType<typeof useSwapQuery>, 'update' | 'clear'> & {
  updateQuery: ReturnType<typeof useSwapQuery>['update'];
};
type TokensState = ReturnType<typeof useSwapTokens>;
type FusionState = QueryState &
  TokensState & {
    account?: Account;
    isConfirming: boolean;
    slippage: number;
    setSlippage: (slippage: number) => void;
    autoSlippage: boolean;
    setAutoSlippage: (autoSlippage: boolean) => void;
    fromAmount?: string;
    toAmount?: string;
    isAmountLoading: boolean;
    swapError?: SwapError;
    userQuote: Quote | null;
    bestQuote: Quote | null;
    quotes: Quote[];
    selectQuoteById: (quoteId: string | null) => void;
    transfer: (specificQuote?: Quote) => Promise<void>;
    isReadyToTransfer: boolean;
  };

const FusionStateContext = createContext<FusionState | undefined>(undefined);

export const FusionStateContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { captureEncrypted } = useAnalyticsContext();
  const { replace } = useHistory();
  const getTranslatedError = useErrorMessage();

  const [slippage, setSlippage] = useState(DEFAULT_SLIPPAGE);
  const [autoSlippage, setAutoSlippage] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);

  const {
    update: updateQuery,
    userAmount,
    fromId,
    toId,
    fromQuery,
    toQuery,
  } = useSwapQuery();

  const { sourceTokens, targetTokens, fromToken, toToken } = useSwapTokens(
    fromId,
    toId,
  );

  const signers = useSigners();
  const manager = useTransferManager({ signers });

  const { chain: sourceChain, asset: sourceAsset } =
    useAssetAndChain(fromToken);
  const { chain: targetChain, asset: targetAsset } = useAssetAndChain(toToken);
  const { fromAddress, toAddress } = useUserAddresses(
    activeAccount,
    sourceChain,
    targetChain,
  );
  const { bestQuote, quotes, userQuote, selectQuoteById } = useQuotes({
    manager,
    fromAddress,
    toAddress,
    sourceAsset,
    sourceChain,
    targetAsset,
    targetChain,
    amount:
      userAmount && sourceAsset
        ? stringToBigint(userAmount, sourceAsset.decimals)
        : 0n,
    slippageBps: slippage * 100, // TODO: Support auto slippage when Markr supports it
  });

  const toAmount =
    bestQuote && targetAsset
      ? bigIntToString(bestQuote.amountOut, targetAsset.decimals)
      : undefined;

  const transfer = useCallback(
    async (specificQuote?: Quote) => {
      if (!manager) {
        throw new Error('Manager or quote not found');
      }

      setIsConfirming(true);

      const quoteToUse = specificQuote ?? userQuote ?? bestQuote;

      if (!quoteToUse) {
        throw new Error('Quote not found');
      }

      captureEncrypted('SwapReviewOrder', {
        provider: quoteToUse.aggregator.name,
        slippage,
      });

      try {
        await manager.transferAsset({ quote: quoteToUse });
        captureEncrypted('SwapConfirmed', {
          address: fromAddress,
          chainId: quoteToUse.sourceChain.chainId,
        });
        replace('/');
      } catch (err) {
        if (isUserRejectionError(err)) {
          setIsConfirming(false);
          return;
        }

        const wasManuallySelectedQuote = !!userQuote;

        // If no specific quote was selected manually by the user, retry with the next quote (if applicable).
        if (!wasManuallySelectedQuote && shouldRetryWithNextQuote(err)) {
          const currentQuoteIndex = quotes.findIndex(
            (q) => q.id === quoteToUse.id,
          );
          const nextQuote = quotes[currentQuoteIndex + 1];

          if (nextQuote) {
            return transfer(nextQuote);
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

        captureEncrypted('SwapFailed', {
          address: fromAddress,
          chainId: quoteToUse.sourceChain.chainId,
        });
      }
    },
    [
      manager,
      fromAddress,
      userQuote,
      bestQuote,
      slippage,
      replace,
      captureEncrypted,
      getTranslatedError,
      quotes,
    ],
  );

  return (
    <FusionStateContext.Provider
      value={{
        updateQuery,
        fromId,
        toId,
        fromQuery,
        toQuery,
        userAmount,
        fromAmount: userAmount,
        toAmount,
        sourceTokens,
        targetTokens,
        fromToken,
        toToken,
        account: activeAccount,
        isAmountLoading: Boolean(userAmount && toAmount === undefined),
        isConfirming,
        slippage,
        setSlippage,
        autoSlippage,
        setAutoSlippage,
        swapError: undefined, // TODO:
        userQuote,
        bestQuote,
        quotes,
        selectQuoteById,
        transfer,
        isReadyToTransfer: Boolean((userQuote ?? bestQuote) && manager),
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
