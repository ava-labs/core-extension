import { BehaviorSubject } from 'rxjs';
import { Address, OptimalRate, PriceString, SwapSide } from '@paraswap/sdk';

import { Account, WrappedError } from '@core/types';
import { WalletDetails } from '@core/types';
import { NetworkWithCaipId } from '@core/types';

import type { JupiterQuote } from './schemas';
import {
  EvmUnwrapQuote,
  EvmWrapQuote,
  isEvmUnwrapQuote,
  isEvmWrapQuote,
  NormalizedSwapQuoteResult,
} from './types';
import { Dispatch, SetStateAction } from 'react';

/**
 * Paraswap may return both data and an error sometimes.
 * @see https://app.swaggerhub.com/apis/paraswapv5/api/1.0#/PriceRouteWithError
 */
type ParaswapPricesResponseWithError = {
  error: string;
  priceRoute?: OptimalRate;
};

export type DestinationInput = 'from' | 'to' | '';

type ParaswapPricesSuccessResponse = {
  error: never;
  priceRoute: OptimalRate;
};

export type ParaswapPricesResponse =
  | ParaswapPricesSuccessResponse
  | ParaswapPricesResponseWithError;

/**
 * Paraswap API errors after which it may be useful to retry the request.
 *
 * @see https://app.swaggerhub.com/apis/paraswapv5/api/1.0#/PriceErrorMessage
 */
export const PARASWAP_RETRYABLE_ERRORS = [
  'Price Timeout',
  'An error has occurred, please try again later or contact our support',
];

export const hasParaswapError = (
  response: ParaswapPricesResponse,
): response is ParaswapPricesResponseWithError => {
  return typeof response.error === 'string';
};

export type EvmSwapQuote =
  | OptimalRate
  | EvmWrapQuote
  | EvmUnwrapQuote
  | MarkrQuote;
export type SvmSwapQuote = JupiterQuote;
export type SwapQuote = EvmSwapQuote | SvmSwapQuote;

export const isJupiterSwapParams = (
  swapParams: SwapParams<SwapQuote>,
): swapParams is SwapParams<JupiterQuote> => {
  return isJupiterQuote(swapParams.quote);
};

export const isParaswapSwapParams = (
  swapParams: SwapParams<SwapQuote>,
): swapParams is SwapParams<OptimalRate> => {
  return isParaswapQuote(swapParams.quote);
};

export const isEvmWrapSwapParams = (
  swapParams: SwapParams<SwapQuote>,
): swapParams is SwapParams<EvmWrapQuote> => {
  return isEvmWrapQuote(swapParams.quote);
};

export const isEvmUnwrapSwapParams = (
  swapParams: SwapParams<SwapQuote>,
): swapParams is SwapParams<EvmUnwrapQuote> => {
  return isEvmUnwrapQuote(swapParams.quote);
};

export const isMarkrSwapParams = (
  swapParams: SwapParams<SwapQuote>,
): swapParams is SwapParams<MarkrQuote> => {
  return isMarkrQuote(swapParams.quote);
};

export const isJupiterQuote = (quote: SwapQuote): quote is JupiterQuote => {
  return 'inputMint' in quote;
};

export const isParaswapQuote = (quote: SwapQuote): quote is OptimalRate => {
  return (
    'srcAmount' in quote &&
    'destAmount' in quote &&
    'srcToken' in quote &&
    'destToken' in quote
  );
};

export const isMarkrQuote = (quote: SwapQuote): quote is MarkrQuote => {
  return (
    'uuid' in quote &&
    'aggregator' in quote &&
    'amountIn' in quote &&
    'tokenIn' in quote &&
    'amountOut' in quote &&
    'tokenOut' in quote
  );
};

export function isAPIError(rate: any): rate is WrappedError {
  return typeof rate.message === 'string';
}

export type SwapParams<T extends SwapQuote> = {
  srcToken: string;
  destToken: string;
  srcDecimals: number;
  destDecimals: number;
  swapProvider: string;
  quote: T;
  amountIn: string;
  amountOut: string;
  slippage: number;
};

export type GetRateParams = {
  srcToken: string;
  srcDecimals: number;
  destToken: string;
  destDecimals: number;
  srcAmount: string;
  swapSide?: SwapSide;
  fromTokenBalance?: bigint;
  slippageTolerance?: string;
  onUpdate?: (update: NormalizedSwapQuoteResult) => void;
};

export type SwapFormValues = {
  amount?: bigint;
  toTokenAddress?: string;
  fromTokenAddress?: string;
  toTokenDecimals?: number;
  fromTokenDecimals?: number;
  destinationInputField?: DestinationInput;
  fromTokenBalance?: bigint;
  slippageTolerance?: string;
};

export type SwapContextAPI = {
  getRate(
    params: GetRateParams,
  ): Promise<NormalizedSwapQuoteResult | undefined>;
  swap(params: SwapParams<SwapQuote>): Promise<void>;
  error: SwapError;
  setError(error: SwapError): void;
  isSwapLoading: boolean;
  setIsSwapLoading(isSwapLoading: boolean): void;
  quotes: NormalizedSwapQuoteResult | null;
  setQuotes: Dispatch<SetStateAction<NormalizedSwapQuoteResult | null>>;
  manuallySelected: boolean;
  setManuallySelected(manuallySelected: boolean): void;
  swapFormValuesStream: BehaviorSubject<SwapFormValues>;
  destAmount: string | undefined;
  setDestAmount(destAmount: string | undefined): void;
  srcAmount: string | undefined;
  setSrcAmount(srcAmount: string | undefined): void;
  swapNetwork?: NetworkWithCaipId | undefined;
  setSwapNetwork: Dispatch<SetStateAction<NetworkWithCaipId | undefined>>;
};

export const DISALLOWED_SWAP_ASSETS: string[] = [
  // ETH is disabled in Swaps per issue CP-8409
  'ETH',
];

export type BuildTxParams = {
  network: NetworkWithCaipId;
  srcToken: Address;
  destToken: Address;
  srcAmount: PriceString;
  destAmount: PriceString;
  priceRoute: OptimalRate;
  userAddress: Address;
  partner?: string;

  partnerAddress?: string;
  partnerFeeBps?: number;
  isDirectFeeTransfer?: boolean;

  srcDecimals?: number;
  destDecimals?: number;
  ignoreChecks?: boolean; // Use it when executing transactions as a batch (approval + transfer)
};

export type GetSwapPropsParams = {
  srcToken: string;
  destToken: string;
  srcAmount: string;
  slippage: number;
  priceRoute: OptimalRate;
  nativeToken: string;
};

export type ValidTransactionResponse = {
  to: string;
  from: string;
  value: string;
  data: string;
  chainId: number;
  gas?: string;
  gasPrice?: string;
};

export interface SwapError {
  message?: string;
  hasTryAgain?: boolean;
}

export type SwapWalletState = Partial<{
  account: Account;
  network: NetworkWithCaipId;
  walletDetails: WalletDetails;
}>;

export type TransactionResult = {
  success: boolean;
  error?: string | null;
};

export type OnTransactionReceiptCallback = (params: {
  isSuccessful: boolean;
  txHash: string;
  chainId: number;
  userAddress: string;
  srcToken: string;
  destToken: string;
  srcAmount: string;
  destAmount: string;
  srcDecimals: number;
  destDecimals: number;
}) => void;

export type MarkrQuote = {
  uuid: string;
  aggregator: {
    id: string;
    name: string;
    logo_url: string;
  };
  chainId: number;
  tokenIn: string;
  tokenInDecimals: number;
  amountIn: string;
  tokenOut: string;
  tokenOutDecimals: number;
  amountOut: string;
  gasEstimate?: number;
  expiredAt?: number;
  done?: boolean;
};

export type MarkrTransaction = {
  to: string;
  value: string;
  data: string;
};

export type SwapAdapterMethods = {
  onTransactionReceipt: OnTransactionReceiptCallback;
};

export type SwapAdapter<T extends SwapQuote> = (
  walletState: SwapWalletState,
  methods: SwapAdapterMethods,
) => {
  getRate: (
    params: GetRateParams,
  ) => Promise<NormalizedSwapQuoteResult | undefined>;
  swap: (params: SwapParams<T>) => Promise<void>;
};

export type { JupiterQuote };
