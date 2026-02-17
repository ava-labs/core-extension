import {
  createContext,
  FC,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { toast } from '@avalabs/k2-alpine';
import { useHistory } from 'react-router-dom';
import { Quote } from '@avalabs/unified-asset-transfer';
import { bigIntToString } from '@avalabs/core-utils-sdk';

import { Account, FungibleTokenBalance } from '@core/types';
import { isUserRejectionError, Monitoring, stringToBigint } from '@core/common';
import {
  useAccountsContext,
  SwapError,
  useAnalyticsContext,
  useErrorMessage,
} from '@core/ui';

import { useSwapQuery } from '../hooks';
import { shouldRetryWithNextQuote } from '../lib/swapErrors';
import {
  useUserAddresses,
  useTransferManager,
  useSigners,
  useAssetAndChain,
  useQuotes,
  useSupportedChainIds,
  useSwapSourceTokenList,
  useSwapSourceToken,
  useSwapTargetTokenList,
  useSwapTargetToken,
  useSlippageTolerance,
} from './hooks';

type QueryState = Omit<ReturnType<typeof useSwapQuery>, 'update' | 'clear'> & {
  updateQuery: ReturnType<typeof useSwapQuery>['update'];
};
type FusionState = QueryState & {
  sourceTokenList: FungibleTokenBalance[];
  targetTokenList: FungibleTokenBalance[];
  sourceToken: FungibleTokenBalance | undefined;
  targetToken: FungibleTokenBalance | undefined;
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
  selectedQuote: Quote | null;
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

  const [isConfirming, setIsConfirming] = useState(false);

  const {
    update: updateQuery,
    userAmount,
    fromId,
    toId,
    fromQuery,
    toQuery,
  } = useSwapQuery();

  const signers = useSigners();
  const manager = useTransferManager(signers);
  const supportedChainsIds = useSupportedChainIds(manager);
  const sourceTokenList = useSwapSourceTokenList(supportedChainsIds);
  const sourceToken = useSwapSourceToken(sourceTokenList, fromId);
  const targetTokenList = useSwapTargetTokenList(
    sourceToken ? sourceToken.chainCaipId : supportedChainsIds,
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

  const {
    bestQuote,
    quotes,
    userQuote,
    selectedQuote,
    isUserSelectedQuote,
    selectQuoteById,
  } = useQuotes({
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
    slippageBps: autoSlippage ? undefined : slippage * 100,
  });

  const toAmount =
    selectedQuote && targetAsset
      ? bigIntToString(selectedQuote.amountOut, targetAsset.decimals)
      : undefined;

  const transfer = useCallback(
    async (specificQuote?: Quote) => {
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

        // Match legacy: report SwapConfirmed for any non–user-rejection result (success or failure)
        captureEncrypted('SwapConfirmed', {
          address: fromAddress,
          chainId: quoteToUse.sourceChain.chainId,
        });

        // If no specific quote was selected manually by the user, retry with the next quote (if applicable).
        if (!isUserSelectedQuote && shouldRetryWithNextQuote(err)) {
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
      slippage,
      replace,
      captureEncrypted,
      getTranslatedError,
      quotes,
      isUserSelectedQuote,
      selectedQuote,
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
        sourceTokenList,
        targetTokenList,
        sourceToken,
        targetToken,
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
        selectedQuote,
        quotes,
        selectQuoteById,
        transfer,
        isReadyToTransfer: Boolean(selectedQuote && manager),
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
