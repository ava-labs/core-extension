import { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';
import { Contract } from 'ethers';
import ERC20 from '@openzeppelin/contracts/build/contracts/ERC20.json';
import { swapError } from '../swap-utils';
import { CommonError, SwapErrorCode } from '@core/types';
import { isUserRejectionError, resolve } from '@core/common';
import { TransactionParams } from '@avalabs/evm-module';
import { RpcMethod } from '@avalabs/vm-module-types';

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

export async function buildApprovalTx({
  userAddress,
  spenderAddress,
  tokenAddress,
  amount,
  provider,
  isGaslessOn,
}: {
  userAddress: string;
  spenderAddress: string;
  tokenAddress: string;
  amount: bigint;
  provider: JsonRpcBatchInternal;
  isGaslessOn?: boolean;
}) {
  const contract = new Contract(tokenAddress, ERC20.abi, provider);
  const { data } = await contract.approve!.populateTransaction(
    spenderAddress,
    amount,
  );

  const chainId = `0x${provider._network.chainId.toString(16)}`;
  const tx = {
    from: userAddress,
    to: tokenAddress,
    chainId,
    data,
  };

  let approvalGasLimit: bigint | null = null;
  let approvalGasLimitError: Error | null = null;

  if (isGaslessOn) {
    // When gasless is enabled, use state override to simulate the user having enough balance
    // This prevents "insufficient funds for gas" errors during estimation
    const stateOverride = {
      [userAddress]: {
        balance: `0x${(10n ** 18n).toString(16)}`, // 1 AVAX for simulation
      },
    };

    [approvalGasLimit, approvalGasLimitError] = await resolve(
      provider
        .send('eth_estimateGas', [
          {
            from: userAddress,
            to: tokenAddress,
            data,
          },
          'latest',
          stateOverride,
        ])
        .then((result: string) => BigInt(result)),
    );
  } else {
    [approvalGasLimit, approvalGasLimitError] = await resolve(
      provider.estimateGas(tx),
    );
  }

  if (approvalGasLimitError) {
    throw swapError(CommonError.UnableToEstimateGas, approvalGasLimitError);
  }

  return {
    ...tx,
    gas: `0x${approvalGasLimit!.toString(16)}`,
  };
}

export async function ensureAllowance({
  provider,
  tokenAddress,
  userAddress,
  spenderAddress,
  amount,
  signAndSend,
  isOneClickSwapEnabled,
  batch,
  isGaslessOn,
}: {
  provider: JsonRpcBatchInternal;
  userAddress: string;
  spenderAddress: string;
  tokenAddress: string;
  amount: bigint;
  signAndSend: (
    method: RpcMethod,
    txParams: [TransactionParams],
    context?: Record<string, unknown>,
  ) => Promise<string>;
  isOneClickSwapEnabled?: boolean;
  batch?: TransactionParams[];
  isGaslessOn?: boolean;
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
    isGaslessOn,
  });

  if (isOneClickSwapEnabled) {
    if (!batch)
      throw swapError(
        SwapErrorCode.MissingParams,
        new Error('Missing parameter: batch'),
      );
    batch.push(tx);
    return;
  }

  const [txHash, signError] = await resolve(
    signAndSend(RpcMethod.ETH_SEND_TRANSACTION, [tx]),
  );

  if (isUserRejectionError(signError)) {
    throw signError;
  } else if (signError) {
    throw swapError(CommonError.UnableToSign, signError);
  }

  return txHash;
}
