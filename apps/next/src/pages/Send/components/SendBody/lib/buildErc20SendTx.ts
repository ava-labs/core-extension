import { Contract, TransactionRequest } from 'ethers';
import { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';
import ERC20 from '@openzeppelin/contracts/build/contracts/ERC20.json';

import { Erc20TokenBalance, NetworkFee } from '@core/types';

import { asHex } from './asHex';
import { estimateGasWithStateOverride } from './estimateGasWithStateOverride';

type Erc20SendOptions = {
  address: string;
  amount: bigint;
  token: Erc20TokenBalance;
  isGaslessOn?: boolean;
};

export const buildErc20SendTx = async (
  from: string,
  provider: JsonRpcBatchInternal,
  networkFee: NetworkFee,
  { address, amount, token, isGaslessOn }: Erc20SendOptions,
) => {
  const contract = new Contract(token.address || '', ERC20.abi, provider);

  const populatedTransaction = await contract.transfer!.populateTransaction(
    address,
    amount,
  );
  const unsignedTx: TransactionRequest = {
    ...populatedTransaction, // only includes `to` and `data`
    chainId: populatedTransaction.chainId
      ? Number(populatedTransaction.chainId)
      : undefined,
    from,
    maxFeePerGas: asHex(networkFee.high.maxFeePerGas),
    maxPriorityFeePerGas: asHex(networkFee.high.maxPriorityFeePerGas ?? 1n),
  };

  // When gasless is enabled, estimate gas with state override to avoid
  // "insufficient funds for gas" errors for users with 0 native balance
  if (isGaslessOn) {
    const gasLimit = await estimateGasWithStateOverride(
      provider,
      unsignedTx,
      from,
    );
    unsignedTx.gasLimit = gasLimit;
  }

  return unsignedTx;
};
