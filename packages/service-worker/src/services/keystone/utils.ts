import { TxData } from '@ethereumjs/tx';
import { BufferLike } from 'ethereumjs-util';
import { TransactionRequest } from 'ethers';

import { makeBNLike } from '@core/common';

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
