import { TxData } from '@ethereumjs/tx';
import { BNLike, BufferLike } from 'ethereumjs-util';
import { BigNumberish, TransactionRequest } from 'ethers';

/**
 * Convert tx data from `TransactionRequest` (ethers) to `TxData` (@ethereumjs)
 */
export function convertTxData(txData: TransactionRequest): TxData {
  return {
    to: txData.to?.toString(),
    nonce: makeBNLike(txData.nonce),
    gasPrice: makeBNLike(txData.gasPrice),
    gasLimit: makeBNLike(txData.gasLimit),
    value: makeBNLike(txData.value),
    data: txData.data as BufferLike,
    type: makeBNLike(txData.type),
  };
}

export function makeBNLike(
  n: BigNumberish | undefined | null
): BNLike | undefined {
  if (n == null) return undefined;
  return '0x' + BigInt(n).toString(16);
}
