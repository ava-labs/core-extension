import { getTxInfo } from './getTxInfo';
import { resolve } from '@src/utils/promiseResolver';
import { JsonRpcApiProvider, TransactionDescription } from 'ethers';
import { EthSendTransactionParams } from '../models';
import { Network } from '@avalabs/core-chains-sdk';

export async function getTxDescription(
  network: Network,
  provider: JsonRpcApiProvider,
  tx: EthSendTransactionParams
): Promise<TransactionDescription | null> {
  const toAddress = tx.to?.toLocaleLowerCase() || '';

  // the toAddress is empty for contract deployments
  if (!toAddress) {
    return null;
  }
  const [contractByteCode, error] = await resolve(provider.getCode(toAddress));

  if (error) {
    return null;
  }

  // the response is always `0x` if the address is EOA and it's the contract's source byte code otherwise
  // see https://docs.ethers.org/v5/single-page/#/v5/api/providers/provider/-%23-Provider-getCode
  if (contractByteCode === '0x') {
    return null;
  }
  try {
    return await getTxInfo(toAddress, tx.data ?? '', tx.value ?? '', network);
  } catch (err) {
    console.error(err);
    return null;
  }
}
