import type { TxData } from '@ethereumjs/tx';
import type { BufferLike } from 'ethereumjs-util';
import type { TransactionRequest } from 'ethers';

import { makeBNLike } from '@src/utils/makeBNLike';

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
