import {
  BtcSigner,
  EvmSignerWithMessage,
  Quote,
  TransferManager,
} from '@avalabs/fusion-sdk';

import {
  Account,
  Erc20TokenBalance,
  EvmNativeTokenBalance,
  FungibleTokenBalance,
  SolanaNativeTokenBalance,
  SolanaSplTokenBalance,
} from '@core/types';
import { useSwapQuery } from './hooks';
import {
  PriceImpactAvailability,
  PriceImpactSeverity,
} from './hooks/usePriceImpact';

export type SwappableAssetType =
  | 'evm_native'
  | 'evm_erc20'
  | 'svm_native'
  | 'svm_spl';

export type SwappableToken =
  | EvmNativeTokenBalance
  | Erc20TokenBalance
  | SolanaNativeTokenBalance
  | SolanaSplTokenBalance;

export type Signers = {
  evm: EvmSignerWithMessage;
  btc: BtcSigner;
};

export type QuoteStreamingStatus = 'done' | 'loading' | 'error';

export type SwapStatus =
  | 'loading'
  | 'initialized'
  | 'initialization-failed'
  | 'no-swappable-assets'
  | 'no-routes-found'
  | 'ready-to-transfer';

export type EstimatedFeeResult = {
  fee: bigint | undefined;
  isFeeLoading: boolean;
  feeError: Error | null;
};

export type QueryState = Omit<
  ReturnType<typeof useSwapQuery>,
  'update' | 'clear'
> & {
  updateQuery: ReturnType<typeof useSwapQuery>['update'];
};
export type FusionState = QueryState &
  EstimatedFeeResult & {
    debouncedUserAmount: string;
    manager: TransferManager | undefined;
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
    minimumTransferAmount: bigint | undefined;
    toAmount?: string;
    priceImpact: number | undefined;
    priceImpactSeverity: PriceImpactSeverity;
    priceImpactAvailability: PriceImpactAvailability;
    userQuote: Quote | null;
    bestQuote: Quote | null;
    selectedQuote: Quote | null;
    quotes: Quote[];
    selectQuoteById: (quoteId: string | null) => void;
    transfer: (specificQuote?: Quote) => Promise<void>;
    status: SwapStatus;
    quotesStatus: QuoteStreamingStatus;
    maxSwapAmount: bigint;
    maxSwapAmountFees: bigint;
    isMaxSwapAmountLoading: boolean;
    minimalQuote: Quote | null;
    formError: string | React.ReactNode;
  };
