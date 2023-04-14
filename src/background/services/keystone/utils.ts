import { TxData } from '@ethereumjs/tx';
import { TransactionRequest } from '@ethersproject/providers';
import { BNLike, BufferLike } from 'ethereumjs-util';
import { BigNumber, BigNumberish } from 'ethers';

/**
 * Convert tx data from `TransactionRequest` (ethers) to `TxData` (@ethereumjs)
 */
export function convertTxData(txData: TransactionRequest): TxData {
  return {
    to: txData.to,
    nonce: makeBNLike(txData.nonce),
    gasPrice: makeBNLike(txData.gasPrice),
    gasLimit: makeBNLike(txData.gasLimit),
    value: makeBNLike(txData.value),
    data: txData.data as BufferLike,
    type: txData.type,
  };
}

export function makeBNLike(n: BigNumberish | undefined): BNLike | undefined {
  if (n == null) return undefined;
  return BigNumber.from(n).toHexString();
}
