import {
  BtcSigner,
  EvmSignerWithMessage,
  Quote,
  RecurringQuoteFee,
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
import { type ChainOption } from '@/components/TokenSelect/components/ChainFilterChips';
import { useSwapQuery } from './hooks';
import {
  PriceImpactAvailability,
  PriceImpactSeverity,
} from './hooks/usePriceImpact';
import type { RecurringEligibility } from './contexts/hooks/useRecurringEligibility';

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

export type RequiredTokenPurpose = 'input' | 'network-fee' | 'additive-fee';

export type RequiredToken = {
  id: string;
  token: FungibleTokenBalance;
  amounts: [bigint, RequiredTokenPurpose][];
  total: bigint;
};

export type RequiredTokenAmounts = {
  state: 'idle' | 'loading' | 'complete' | 'incomplete';
  tokens: RequiredToken[];
};

// `isRecurring` lives in the URL alongside the other swap query params but is
// owned by `RecurringSwapState`, not `FusionState`.
export type QueryState = Omit<
  ReturnType<typeof useSwapQuery>,
  'update' | 'clear' | 'isRecurring'
> & {
  updateQuery: ReturnType<typeof useSwapQuery>['update'];
};
export type FusionState = QueryState & {
  debouncedUserAmount: string;
  manager: TransferManager | undefined;
  sourceTokenList: FungibleTokenBalance[];
  targetTokenList: FungibleTokenBalance[];
  fetchNextTargetTokenPage: () => void;
  isTargetTokenListLoading: boolean;
  isTargetTokenListFetching: boolean;
  targetChainOptions: ChainOption[];
  selectedTargetChainId: number | 'avalanche' | null;
  /** Updates the browse chain while the dropdown is open. Only call from chip interactions inside the open dropdown. */
  setSelectedTargetChainId: (id: number | 'avalanche' | null) => void;
  setIsTargetSelectOpen: (isOpen: boolean) => void;
  onTargetTokenChange: (tokenId: string) => void;
  onTokenPairFlip: () => void;
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
  createRecurringSwap: () => Promise<void>;
  isCreatingRecurringSwap: boolean;
  recurringEligibility: RecurringEligibility;
  /** One-time native schedule fee from the recurring quote, when recurring. */
  recurringScheduleFee: RecurringQuoteFee | undefined;
  status: SwapStatus;
  quotesStatus: QuoteStreamingStatus;
  minimalQuote: Quote | null;
  formError: string | React.ReactNode;
  minimumRequiredTokens: RequiredTokenAmounts;
  currentRequiredTokens: RequiredTokenAmounts;
};
