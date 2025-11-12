import {
  EvmSwapOperation,
  GetQuoteParams,
  isEvmProvider,
  isEvmUnwrapQuote,
  isEvmWrapQuote,
  NormalizedSwapQuote,
  NormalizedSwapQuoteResult,
  PerformSwapParams,
  SwapProvider,
  SwapProviders,
} from '../types';
import { swapError } from '../swap-utils';
import { CommonError, SwapErrorCode } from '@core/types';
import { SwapWalletState } from '../models';
import { WAVAX_ADDRESS, WETH_ADDRESS } from '../constants';
import { unwrap } from '../utils/unwrap';
import { wrap } from '../utils/wrap';

const getWrapOperation = (
  toTokenAddress: string,
  amount: string,
): NormalizedSwapQuote => {
  return {
    quote: {
      operation: EvmSwapOperation.WRAP,
      target: toTokenAddress,
      amount: amount,
    },
    metadata: {
      amountIn: amount,
      amountOut: amount,
    },
  };
};

const getUnwrapOperation = (
  fromTokenAddress: string,
  amount: string,
): NormalizedSwapQuote => {
  return {
    quote: {
      operation: EvmSwapOperation.UNWRAP,
      source: fromTokenAddress,
      amount: amount,
    },
    metadata: {
      amountIn: amount,
      amountOut: amount,
    },
  };
};

export const WNativeProvider: SwapProvider = {
  name: SwapProviders.WNATIVE,

  async getQuote({
    fromTokenAddress,
    toTokenAddress,
    amount,
    network,
  }: GetQuoteParams & SwapWalletState): Promise<NormalizedSwapQuoteResult> {
    if (!network || network.isTestnet) {
      throw swapError(CommonError.UnknownNetwork);
    }

    const isFromTokenNative = network.networkToken.symbol === fromTokenAddress;
    const wrappableTokens = [WAVAX_ADDRESS, WETH_ADDRESS];

    let quote: NormalizedSwapQuote;
    if (
      isFromTokenNative &&
      wrappableTokens.includes(toTokenAddress.toLowerCase())
    ) {
      quote = getWrapOperation(toTokenAddress, amount);
    } else {
      quote = getUnwrapOperation(fromTokenAddress, amount);
    }

    return {
      provider: this.name,
      quotes: [quote],
      selected: quote,
    };
  },

  async swap({
    quote,
    provider,
    userAddress,
    network,
    signAndSend,
  }: PerformSwapParams & SwapWalletState) {
    if (!userAddress)
      throw swapError(
        SwapErrorCode.MissingParams,
        new Error('Missing parameter: userAddress'),
      );
    if (!network)
      throw swapError(
        SwapErrorCode.MissingParams,
        new Error('Missing parameter: network'),
      );
    if (network.isTestnet)
      throw swapError(
        CommonError.UnknownNetwork,
        new Error('Network is not supported'),
      );

    if (!quote)
      throw swapError(
        SwapErrorCode.MissingParams,
        new Error('Missing parameter: quote'),
      );

    if (!isEvmProvider(provider)) {
      throw swapError(CommonError.MismatchingProvider);
    }

    if (isEvmWrapQuote(quote)) {
      return wrap({
        userAddress,
        network,
        provider,
        quote,
        signAndSend,
      });
    } else if (isEvmUnwrapQuote(quote)) {
      return unwrap({
        userAddress,
        network,
        provider,
        quote,
        signAndSend,
      });
    } else {
      throw swapError(SwapErrorCode.WrongQuoteProvider);
    }
  },
};
