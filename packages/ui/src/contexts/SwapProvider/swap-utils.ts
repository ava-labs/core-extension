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

import { isJupiterQuote } from './models';
import { isWrappedError } from '@core/common';
import { CommonError, SwapErrorCode } from '@core/types';

import { SwapSide } from '@paraswap/sdk';
import {
  JUPITER_PARTNER_ADDRESS,
  PARASWAP_PARTNER_ADDRESS,
  PARASWAP_PARTNER_FEE_BPS,
  SOL_MINT,
} from './constants';
import type WAVAX_ABI from './ABI_WAVAX.json';
import type WETH_ABI from './ABI_WETH.json';
import { SwapParams } from './models';
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
