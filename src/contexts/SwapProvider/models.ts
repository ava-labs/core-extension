import { BehaviorSubject } from 'rxjs';
import { Address, OptimalRate, PriceString, SwapSide } from '@paraswap/sdk';

import { DestinationInput } from '@src/pages/Swap/utils';
import { WalletDetails } from '@src/background/services/wallet/models';
import { Account } from '@src/background/services/accounts/models';
import { NetworkWithCaipId } from '@src/background/services/network/models';
import { NetworkFee } from '@src/background/services/networkFee/models';

/**
 * Paraswap may return both data and an error sometimes.
 * @see https://app.swaggerhub.com/apis/paraswapv5/api/1.0#/PriceRouteWithError
 */
type ParaswapPricesResponseWithError = {
  error: string;
  priceRoute?: OptimalRate;
};

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

export type SwapQuote = OptimalRate | JupiterQuote;

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

export type SwapParams<T extends SwapQuote> = {
  srcToken: string;
  destToken: string;
  srcDecimals: number;
  destDecimals: number;
  quote: T;
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
};

export type SwapFormValues = {
  amount?: bigint;
  toTokenAddress?: string;
  fromTokenAddress?: string;
  toTokenDecimals?: number;
  fromTokenDecimals?: number;
  destinationInputField?: DestinationInput;
  fromTokenBalance?: bigint;
};

type GetRateResult<T extends SwapQuote> =
  | {
      error: SwapError;
      quote: null;
      destAmount?: string;
    }
  | {
      error: undefined;
      quote: T;
      destAmount: string;
    };

export type SwapContextAPI = {
  getRate(params: GetRateParams): Promise<GetRateResult<SwapQuote>>;
  swap(params: SwapParams<SwapQuote>): Promise<void>;
  swapError: SwapError;
  setSwapError(error: SwapError): void;
  isSwapLoading: boolean;
  setIsSwapLoading(isSwapLoading: boolean): void;
  quote: OptimalRate | JupiterQuote | null;
  setQuote(quote: OptimalRate | JupiterQuote | null): void;
  swapFormValuesStream: BehaviorSubject<SwapFormValues>;
  destAmount: string;
  setDestAmount(destAmount: string): void;
};

export const DISALLOWED_SWAP_ASSETS: string[] = [
  // ETH is disabled in Swaps per issue CP-8409
  'ETH',
];

export type BuildTxParams = {
  network: string;
  srcToken: Address;
  destToken: Address;
  srcAmount: PriceString;
  destAmount: PriceString;
  priceRoute: OptimalRate;
  userAddress: Address;
  isNativeTokenSwap: boolean;
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

export enum SwapErrorCode {
  ClientNotInitialized = 'client-not-initialized',
  MissingParams = 'missing-params',
  CannotFetchAllowance = 'cannot-fetch-allowance',
  MissingContractMethod = 'missing-contract-method',
  ApiError = 'api-error',
  UnknownSpender = 'unknown-spender',
  UnexpectedApiResponse = 'unexpected-api-response',
  CannotBuildTx = 'cannot-build-tx',
}

export interface SwapError {
  message?: string;
  hasTryAgain?: boolean;
}

export type JupiterQuote = {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: 'ExactIn' | 'ExactOut';
  slippageBps: number;
  platformFee: {
    amount: string;
    feeBps: number;
  };
  priceImpactPct: string;
  routePlan: unknown[];
  contextSlot: number;
  timeTaken: number;
};

type WalletState = Partial<{
  account: Account;
  network: NetworkWithCaipId;
  networkFee: NetworkFee | null;
  walletDetails: WalletDetails;
}>;
export type SwapAdapter<T extends SwapQuote> = (walletState: WalletState) => {
  getRate: (params: GetRateParams) => Promise<GetRateResult<T>>;
  swap: (params: SwapParams<T>) => Promise<void>;
};
