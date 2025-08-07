import { TransactionParams } from '@avalabs/evm-module';
import { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';
import { resolve } from '@avalabs/core-utils-sdk';
import { Network } from '@avalabs/core-chains-sdk';
import { getWrapUnwrapAbi } from './getWrapUnwrapAbi';
import { EvmUnwrapQuote, WrapUnwrapTxParams } from '../types';
import { swapError } from '../swap-utils';
import { CommonError, SwapErrorCode } from '@core/types';
import { Contract } from 'ethers';
import { isUserRejectionError } from '@core/common';
import { RpcMethod } from '@avalabs/vm-module-types';

type TxHash = string;

const buildUnwrapTx = async ({
  userAddress,
  tokenAddress,
  amount,
  provider,
  abi,
}: WrapUnwrapTxParams): Promise<{
  to: string;
  data: string;
  from: string;
}> => {
  const contract = new Contract(tokenAddress, abi, provider);

  if (!contract.withdraw) {
    throw new Error('Withdraw method not found on contract');
  }

  const { to, data } = await contract.withdraw.populateTransaction(
    `0x${BigInt(amount).toString(16)}`,
  );

  return {
    to,
    data,
    from: userAddress,
  };
};

// unwrap a token via the standard contract
export const unwrap = async ({
  userAddress,
  network,
  provider,
  quote,
  signAndSend,
}: {
  userAddress: string;
  network: Network;
  provider: JsonRpcBatchInternal;
  quote: EvmUnwrapQuote;
  signAndSend: (
    method: RpcMethod,
    txParams: [TransactionParams],
  ) => Promise<string>;
}): Promise<TxHash> => {
  if (network.isTestnet) throw swapError(CommonError.UnknownNetwork);

  const tokenAddress = quote.source.toLowerCase();

  const amount = quote.amount;

  const abi = getWrapUnwrapAbi(tokenAddress);

  if (!abi) throw swapError(SwapErrorCode.IncorrectTokenAddress);

  const txParams = {
    userAddress,
    tokenAddress,
    amount,
    provider,
    abi,
  };

  const tx = await buildUnwrapTx(txParams);

  const [txHash, signError] = await resolve(
    signAndSend(RpcMethod.ETH_SEND_TRANSACTION, [tx]),
  );

  if (isUserRejectionError(signError)) {
    throw signError;
  } else if (signError || !txHash) {
    throw swapError(CommonError.UnableToSign, signError);
  }

  return txHash;
};
