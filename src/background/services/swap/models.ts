import { OptimalRate } from 'paraswap-core';

/**
 * Paraswap may return both data and an error sometimes.
 * @see https://app.swaggerhub.com/apis/paraswapv5/api/1.0#/PriceRouteWithError
 */
export type ParaswapPricesResponseWithError = {
  error: string;
  priceRoute?: OptimalRate;
};

export type ParaswapPricesSuccessResponse = {
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
  response: ParaswapPricesResponse
): response is ParaswapPricesResponseWithError => {
  return typeof response.error === 'string';
};
