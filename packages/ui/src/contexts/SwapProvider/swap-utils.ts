import {
  JsonRpcBatchInternal,
  SolanaProvider,
} from '@avalabs/core-wallets-sdk';
import type { BuildTxInputBase } from '@paraswap/sdk/dist/methods/swap/transaction';
import {
  findAssociatedTokenPda,
  TOKEN_PROGRAM_ADDRESS,
} from '@solana-program/token';
import { address } from '@solana/kit';
import { ethErrors } from 'eth-rpc-errors';
import { Contract } from 'ethers';
import { t } from 'i18next';

import { isJupiterQuote, SwapError } from './models';
import { isWrappedError, WrappedError } from '@core/common';
import { CommonError, SwapErrorCode } from '@core/types';

import { FetcherError, SwapSide, TransactionParams } from '@paraswap/sdk';
import {
  JUPITER_PARTNER_ADDRESS,
  PARASWAP_PARTNER_ADDRESS,
  PARASWAP_PARTNER_FEE_BPS,
  SOL_MINT,
} from './constants';
import type WAVAX_ABI from './ABI_WAVAX.json';
import type WETH_ABI from './ABI_WETH.json';
import {
  hasParaswapError,
  PARASWAP_RETRYABLE_ERRORS,
  ParaswapPricesResponse,
  SwapParams,
} from './models';
import { JupiterQuote } from './schemas';
import Big from 'big.js';

export function validateJupiterParams(
  params: Partial<SwapParams<JupiterQuote>>,
):
  | Required<
      SwapParams<JupiterQuote> & { srcAmount: string; destAmount: string }
    >
  | never {
  const {
    srcToken,
    destToken,
    srcDecimals,
    destDecimals,
    quote,
    slippage,
    swapProvider,
    amountIn,
    amountOut,
  } = params;

  if (!quote) {
    throw swapError(
      SwapErrorCode.MissingParams,
      new Error('Missing parameter: quote'),
    );
  }

  if (!isJupiterQuote(quote)) {
    throw swapError(
      SwapErrorCode.InvalidParams,
      new Error('Invalid parameter: quote'),
    );
  }

  if (!srcToken) {
    throw swapError(
      SwapErrorCode.MissingParams,
      new Error('Missing parameter: srcToken'),
    );
  }

  if (!destToken) {
    throw swapError(
      SwapErrorCode.MissingParams,
      new Error('Missing parameter: destToken'),
    );
  }

  if (!srcDecimals) {
    throw swapError(
      SwapErrorCode.MissingParams,
      new Error('Missing parameter: srcDecimals'),
    );
  }

  if (!destDecimals) {
    throw swapError(
      SwapErrorCode.MissingParams,
      new Error('Missing parameter: destDecimals'),
    );
  }

  if (!slippage) {
    throw swapError(
      SwapErrorCode.MissingParams,
      new Error('Missing parameter: slippage'),
    );
  }

  if (!swapProvider) {
    throw swapError(
      SwapErrorCode.MissingParams,
      new Error('Missing parameter: swapProvider'),
    );
  }

  if (!amountIn) {
    throw swapError(
      SwapErrorCode.MissingParams,
      new Error('Missing parameter: amountIn'),
    );
  }

  if (!amountOut) {
    throw swapError(
      SwapErrorCode.MissingParams,
      new Error('Missing parameter: amountOut'),
    );
  }

  const isSelling = quote.swapMode === 'ExactIn';

  return {
    srcToken,
    srcAmount: isSelling ? quote.outAmount : quote.inAmount,
    destToken,
    destAmount: isSelling ? quote.inAmount : quote.outAmount,
    srcDecimals,
    destDecimals,
    quote,
    slippage,
    swapProvider,
    amountIn,
    amountOut,
  };
}

const normalizeError = (err: unknown) => {
  if (isWrappedError(err)) {
    return err;
  }

  if (err instanceof Error) {
    return err;
  }

  if (typeof err === 'string') {
    return new Error(err);
  }

  return new Error((err as any)?.message ?? 'Unknown error');
};

export const swapError = (
  errorCode: CommonError | SwapErrorCode,
  originalError?: unknown,
) => {
  if (isWrappedError(originalError)) {
    return originalError;
  }

  return ethErrors.rpc.internal({
    data: {
      reason: errorCode,
      originalError: originalError
        ? normalizeError(originalError)
        : new Error('Unknown swap error'),
    },
  });
};

export const paraswapErrorToSwapError = (error: FetcherError): SwapError => {
  if (!error.message) {
    return {
      message: t('Unknown error occurred, '),
      hasTryAgain: true,
    };
  }

  switch (error.message) {
    case 'ESTIMATED_LOSS_GREATER_THAN_MAX_IMPACT':
      return {
        message: t(
          'Slippage tolerance exceeded, increase the slippage and try again.',
        ),
        hasTryAgain: false,
      };

    case 'No routes found with enough liquidity':
      return {
        message: t('No routes found with enough liquidity.'),
        hasTryAgain: false,
      };

    case 'Internal Error while computing the price':
      return {
        message: t('An error occurred while computing the price.'),
        hasTryAgain: false,
      };
  }

  if (/is too small to proceed/.test(error.message)) {
    return {
      message: t('Amount is too small to proceed.'),
      hasTryAgain: false,
    };
  }

  return {
    message: t('Unknown error occurred, '),
    hasTryAgain: true,
  };
};

export function checkForErrorsInGetRateResult(
  response: ParaswapPricesResponse | TypeError,
) {
  const isFetchError = response instanceof TypeError;
  const isParaswapError = !isFetchError && hasParaswapError(response);

  if (isFetchError || isParaswapError) {
    // If there is an error, we may want to retry the request if a network issue
    // or some of the documented Paraswap API errors occurred.
    const isNetworkIssue =
      isFetchError && response.message === 'Failed to fetch';
    const shouldBeRetried =
      isNetworkIssue ||
      (isParaswapError && PARASWAP_RETRYABLE_ERRORS.includes(response.error));

    if (shouldBeRetried) {
      return true;
      // If an error occurred, but there is no point in retrying a request,
      // we need to propagate the error so we're able to show an appropriate
      // message in the UI.
    } else if (isFetchError) {
      throw swapError(CommonError.NetworkError, response);
    } else {
      throw swapError(CommonError.Unknown, new Error(response.error));
    }
  }

  return false;
}

export function checkForErrorsInBuildTxResult(
  result: TransactionParams | WrappedError,
) {
  return (
    (isWrappedError(result) &&
      typeof result.data.originalError === 'object' &&
      result.data.originalError &&
      'message' in result.data.originalError &&
      result.data.originalError.message === 'Server too busy') ||
    // paraswap returns responses like this: {error: 'Not enough 0x4f60a160d8c2dddaafe16fcc57566db84d674…}
    // when they are too slow to detect the approval
    (result as any).error ||
    result instanceof Error
  );
}

/**
 * Responsible for adding the needed parameters to a swap transaction
 * in ParaSwap so that Core can gather fees from the swap.
 *
 * Should only be enabled if the feature flag is enabled. Otherwise no fees should be collected.
 *
 * @see https://ava-labs.atlassian.net/browse/CP-10050
 *
 * @param {boolean} featureFlagEnabled - Whether the feature flag is enabled or not.
 *
 * @returns The necessary parameters for Core to gather fees from the swap.
 */
export const getPartnerFeeParams = (
  featureFlagEnabled: boolean,
): Pick<
  BuildTxInputBase,
  'isDirectFeeTransfer' | 'partnerAddress' | 'partnerFeeBps'
> => {
  if (!featureFlagEnabled) {
    return {
      isDirectFeeTransfer: false,
      partnerAddress: undefined,
      partnerFeeBps: undefined,
    };
  }

  return {
    partnerAddress: PARASWAP_PARTNER_ADDRESS,
    partnerFeeBps: PARASWAP_PARTNER_FEE_BPS,
    isDirectFeeTransfer: true,
  };
};

export const getJupiterFeeAccount = async (
  isFlagEnabled: boolean,
  quote: JupiterQuote,
  provider: SolanaProvider,
  onFeeAccountNotInitialized: (mint: string) => void,
): Promise<string | undefined> => {
  if (!isFlagEnabled) {
    return;
  }

  // The `mints` array will hold token mints in which it would be possible for us to collect the fees,
  // with the preferred tokens being at the beginning of the array.
  let mints: [string] | [string, string] | undefined;
  /**
   * The fees are always collected either the input or output token
   * (e.g. we can't choose SOL if user is swapping USDC -> JUP).
   */
  if (quote.swapMode === 'ExactIn') {
    /*
     * With `swapMode` being "ExactOut", we can choose which of the tokens to use for fees.
     * SOL is always preferred, so we check if it's a part of the swap and if it is,
     * we try to collect fees on that token.
     */
    if (quote.outputMint === SOL_MINT) {
      mints = [SOL_MINT, quote.inputMint];
    } else if (quote.inputMint === SOL_MINT) {
      mints = [SOL_MINT, quote.outputMint];
    } else {
      mints = [quote.inputMint, quote.outputMint];
    }
  } else if (quote.swapMode === 'ExactOut') {
    // With `swapMode` being "ExactOut", we can only collect fees on the input token.
    mints = [quote.inputMint];
  }

  if (!mints) {
    return;
  }

  const [primaryFeeToken, secondaryFeeToken] = mints;

  const { feeAccount, isInitialized } = await getFeeAccountInfo(
    provider,
    primaryFeeToken,
  );

  if (isInitialized) {
    return feeAccount;
  } else {
    // Capture the primary fee account not being initialized.
    onFeeAccountNotInitialized(primaryFeeToken);
  }

  // If we can't collect fees on the other token either, return early.
  if (!secondaryFeeToken) {
    return;
  }

  // If we can use the other token to collect fees, let's try that:
  const {
    feeAccount: secondaryFeeAccount,
    isInitialized: isSecondaryFeeAccountInitialized,
  } = await getFeeAccountInfo(provider, secondaryFeeToken);

  if (isSecondaryFeeAccountInitialized) {
    return secondaryFeeAccount;
  }

  // Capture the secondary fee account not being initialized either.
  onFeeAccountNotInitialized(secondaryFeeToken);
};

export const getFeeAccountInfo = async (
  provider: SolanaProvider,
  feeAccountAddress: string,
) => {
  const [feeAccount] = await findAssociatedTokenPda({
    mint: address(feeAccountAddress),
    owner: address(JUPITER_PARTNER_ADDRESS),
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });

  const feeAccountInfo = await provider
    .getAccountInfo(feeAccount, { encoding: 'base64' })
    .send();

  return {
    feeAccount,
    isInitialized: Boolean(feeAccountInfo.value),
  };
};

type WrapUnwrapTxParams = {
  userAddress: string;
  tokenAddress: string;
  amount: string;
  provider: JsonRpcBatchInternal;
  abi: typeof WAVAX_ABI | typeof WETH_ABI;
};

export async function buildWrapTx({
  userAddress,
  tokenAddress,
  amount,
  provider,
  abi,
}: WrapUnwrapTxParams) {
  const contract = new Contract(tokenAddress, abi, provider);

  const { to, data } = await contract.deposit!.populateTransaction();

  return {
    to,
    data,
    from: userAddress,
    value: `0x${BigInt(amount).toString(16)}`,
  };
}

export async function buildUnwrapTx({
  userAddress,
  tokenAddress,
  amount,
  provider,
  abi,
}: WrapUnwrapTxParams) {
  const contract = new Contract(tokenAddress, abi, provider);

  const { to, data } = await contract.withdraw!.populateTransaction(
    `0x${BigInt(amount).toString(16)}`,
  );

  return {
    to,
    data,
    from: userAddress,
  };
}

export function applyFeeDeduction(amount: string, direction: SwapSide): string {
  const feePercent = PARASWAP_PARTNER_FEE_BPS / 10_000;

  if (direction === SwapSide.SELL) {
    const minAmountOut = new Big(amount).times(1 - feePercent).toFixed(0);
    return minAmountOut;
  } else {
    const maxAmountIn = new Big(amount).times(1 + feePercent).toFixed(0);
    return maxAmountIn;
  }
}
