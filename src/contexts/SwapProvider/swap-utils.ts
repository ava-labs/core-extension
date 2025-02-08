import { APIError, Transaction } from 'paraswap';
import { Contract } from 'ethers';
import { ChainId } from '@avalabs/core-chains-sdk';
import { RpcMethod } from '@avalabs/vm-module-types';
import { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';
import { ethErrors } from 'eth-rpc-errors';
import ERC20 from '@openzeppelin/contracts/build/contracts/ERC20.json';
import { t } from 'i18next';

import {
  CommonError,
  WrappedError,
  isUserRejectionError,
  isWrappedError,
  wrapError,
} from '@src/utils/errors';
import { resolve } from '@src/utils/promiseResolver';
import { RequestHandlerType } from '@src/background/connections/models';
import { SwapError } from '@src/pages/Swap/hooks/useSwap';

import {
  PARASWAP_RETRYABLE_ERRORS,
  ParaswapPricesResponse,
  SwapErrorCode,
  SwapParams,
  hasParaswapError,
} from './models';

export function validateParams(
  params: Partial<SwapParams>,
): Required<SwapParams> | never {
  const {
    srcToken,
    destToken,
    srcAmount,
    srcDecimals,
    destDecimals,
    destAmount,
    priceRoute,
    slippage,
  } = params;

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

  if (!srcAmount) {
    throw swapError(
      SwapErrorCode.MissingParams,
      new Error('Missing parameter: srcAmount'),
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

  if (!destAmount) {
    throw swapError(
      SwapErrorCode.MissingParams,
      new Error('Missing parameter: destAmount'),
    );
  }

  if (!priceRoute) {
    throw swapError(
      SwapErrorCode.MissingParams,
      new Error('Missing parameter: priceRoute'),
    );
  }

  if (!slippage) {
    throw swapError(
      SwapErrorCode.MissingParams,
      new Error('Missing parameter: slippage'),
    );
  }

  return {
    srcToken,
    destToken,
    srcAmount,
    srcDecimals,
    destDecimals,
    destAmount,
    priceRoute,
    slippage,
  };
}

export async function buildApprovalTx({
  userAddress,
  spenderAddress,
  tokenAddress,
  amount,
  provider,
}: {
  userAddress: string;
  spenderAddress: string;
  tokenAddress: string;
  amount: bigint;
  provider: JsonRpcBatchInternal;
}) {
  const contract = new Contract(tokenAddress, ERC20.abi, provider);
  const { data } = await contract.approve!.populateTransaction(
    spenderAddress,
    amount,
  );

  const tx = {
    from: userAddress,
    to: tokenAddress,
    chainId: `0x${ChainId.AVALANCHE_MAINNET_ID.toString(16)}`,
    data,
  };
  const [approvalGasLimit, approvalGasLimitError] = await resolve(
    provider.estimateGas(tx),
  );

  if (approvalGasLimitError) {
    throw swapError(CommonError.UnableToEstimateGas, approvalGasLimitError);
  }

  return {
    ...tx,
    gas: `0x${approvalGasLimit.toString(16)}`,
  };
}

export async function hasEnoughAllowance({
  tokenAddress,
  provider,
  userAddress,
  spenderAddress,
  requiredAmount,
}: {
  tokenAddress: string;
  provider: JsonRpcBatchInternal;
  userAddress: string;
  spenderAddress: string;
  requiredAmount: bigint;
}) {
  const contract = new Contract(tokenAddress, ERC20.abi, provider);

  if (!contract.allowance) {
    throw swapError(
      SwapErrorCode.MissingContractMethod,
      new Error(`Contract Error: allowance method is not available`),
    );
  }

  const [allowance, allowanceError] = await resolve(
    contract.allowance(userAddress, spenderAddress),
  );

  if (allowanceError) {
    throw swapError(SwapErrorCode.CannotFetchAllowance, allowanceError);
  }

  return allowance >= requiredAmount;
}

export async function ensureAllowance({
  provider,
  tokenAddress,
  userAddress,
  spenderAddress,
  amount,
  request,
}: {
  provider: JsonRpcBatchInternal;
  userAddress: string;
  spenderAddress: string;
  tokenAddress: string;
  amount: bigint;
  request: RequestHandlerType;
}) {
  const allowanceCoversAmount = await hasEnoughAllowance({
    tokenAddress,
    provider,
    userAddress,
    spenderAddress,
    requiredAmount: amount,
  });

  if (allowanceCoversAmount) {
    return;
  }

  const tx = await buildApprovalTx({
    amount,
    provider,
    spenderAddress,
    tokenAddress,
    userAddress,
  });

  const [, signError] = await resolve(
    request({
      method: RpcMethod.ETH_SEND_TRANSACTION,
      params: [tx],
    }),
  );

  if (isUserRejectionError(signError)) {
    throw signError;
  } else if (signError) {
    throw swapError(CommonError.UnableToSign, signError);
  }
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

export const paraswapErrorToSwapError = (error: WrappedError): SwapError => {
  if (!error.data.originalError) {
    return {
      message: t('Unknown error occurred, '),
      hasTryAgain: true,
    };
  }

  const originalError = error.data.originalError as Error;

  switch (originalError.message) {
    case 'ESTIMATED_LOSS_GREATER_THAN_MAX_IMPACT':
      return {
        message: t(
          'Amount too low or too big to cover. Please adjust swap values.',
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

  if (/is too small to proceed/.test(originalError.message)) {
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
      // we need to propagate the error so we're able to show an approriate
      // message in the UI.
    } else if (isFetchError) {
      throw swapError(CommonError.NetworkError, response);
    } else {
      throw swapError(CommonError.Unknown, new Error(response.error));
    }
  }

  return false;
}

export function checkForErrorsInBuildTxResult(result: Transaction | APIError) {
  return (
    (result as APIError).message === 'Server too busy' ||
    // paraswap returns responses like this: {error: 'Not enough 0x4f60a160d8c2dddaafe16fcc57566db84d674…}
    // when they are too slow to detect the approval
    (result as any).error ||
    result instanceof Error
  );
}

export const getParaswapSpender = async (paraswapApiUrl: string) => {
  const response = await fetch(
    `${paraswapApiUrl}/adapters/contracts?network=${
      ChainId.AVALANCHE_MAINNET_ID
    }`,
  ).catch(wrapError(swapError(CommonError.NetworkError)));

  const result = await response
    .json()
    .catch(
      wrapError(
        swapError(
          SwapErrorCode.UnexpectedApiResponse,
          new Error('Failed to /adapters/contracts response'),
        ),
      ),
    );

  if (!result.TokenTransferProxy) {
    throw swapError(
      SwapErrorCode.UnknownSpender,
      new Error('Missing TokenTransferProxy address'),
    );
  }

  return result.TokenTransferProxy;
};
