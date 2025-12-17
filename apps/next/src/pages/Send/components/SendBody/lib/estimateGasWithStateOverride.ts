import { TransactionRequest } from 'ethers';
import { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';

/**
 * Estimates gas for a transaction using state overrides to simulate the user having sufficient balance.
 * This is useful for gasless transactions where the user may have 0 native token balance.
 *
 * @param provider - The JSON-RPC provider
 * @param tx - The transaction request to estimate gas for
 * @param fromAddress - The address sending the transaction
 * @returns The estimated gas limit as a bigint
 */
export const estimateGasWithStateOverride = async (
  provider: JsonRpcBatchInternal,
  tx: TransactionRequest,
  fromAddress: string,
): Promise<bigint> => {
  // When gasless is enabled, use state override to simulate the user having enough balance
  // This prevents "insufficient funds for gas" errors during estimation
  const stateOverride = {
    [fromAddress]: {
      balance: `0x${(10n ** 18n).toString(16)}`, // 1 native token for simulation
    },
  };

  const result = await provider.send('eth_estimateGas', [
    {
      from: fromAddress,
      to: tx.to,
      data: tx.data,
      value: tx.value,
    },
    'latest',
    stateOverride,
  ]);

  return BigInt(result);
};
