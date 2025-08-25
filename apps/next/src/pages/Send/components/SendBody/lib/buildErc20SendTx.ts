import { Contract, TransactionRequest } from 'ethers';
import { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';
import ERC20 from '@openzeppelin/contracts/build/contracts/ERC20.json';

import { Erc20TokenBalance, NetworkFee } from '@core/types';

import { asHex } from './asHex';

type Erc20SendOptions = {
  address: string;
  amount: bigint;
  token: Erc20TokenBalance;
};

export const buildErc20SendTx = async (
  from: string,
  provider: JsonRpcBatchInternal,
  networkFee: NetworkFee,
  { address, amount, token }: Erc20SendOptions,
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

  return unsignedTx;
};
