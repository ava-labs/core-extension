import { APIError, Transaction } from 'paraswap';
import { Contract } from 'ethers';
import { ChainId } from '@avalabs/core-chains-sdk';
import { RpcMethod } from '@avalabs/vm-module-types';
import { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';
import ERC20 from '@openzeppelin/contracts/build/contracts/ERC20.json';

import { resolve } from '@src/utils/promiseResolver';
import { RequestHandlerType } from '@src/background/connections/models';

import {
  PARASWAP_RETRYABLE_ERRORS,
  ParaswapPricesResponse,
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
    throw new Error('Missing parameter: srcToken');
  }

  if (!destToken) {
    throw new Error('Missing parameter: destToken');
  }

  if (!srcAmount) {
    throw new Error('Missing parameter: srcAmount');
  }

  if (!srcDecimals) {
    throw new Error('Missing parameter: srcDecimals');
  }

  if (!destDecimals) {
    throw new Error('Missing parameter: destDecimals');
  }

  if (!destAmount) {
    throw new Error('Missing parameter: destAmount');
  }

  if (!priceRoute) {
    throw new Error('Missing parameter: priceRoute');
  }

  if (!slippage) {
    throw new Error('Missing parameter: slippage');
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
    throw new Error(
      `Unable to estimate gas limit for allowance approval. Error: ${approvalGasLimitError}`,
    );
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
    throw new Error(`Allowance Conract Error`);
  }

  const [allowance, allowanceError] = await resolve(
    contract.allowance(userAddress, spenderAddress),
  );

  if (allowanceError) {
    throw new Error(`Allowance Fetching Error: ${allowanceError}`);
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

  if (signError) {
    throwError(signError);
  }
}

export const throwError = (err: string | unknown): never => {
  if (typeof err === 'string') {
    throw new Error(err);
  }

  throw err;
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
      throw response;
    } else {
      throw new Error(response.error);
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
