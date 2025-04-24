import { toBeHex } from 'ethers';
import { Network } from '@avalabs/core-chains-sdk';
import { DebankTransactionData, EthSendTransactionParams } from '@core/types';

export function txParamsToTransactionData(
  network: Network,
  tx: EthSendTransactionParams,
): DebankTransactionData {
  return {
    from: tx.from,
    to: tx.to ?? '0x',
    data: tx.data ?? '0x',
    value: tx.value ? toBeHex(tx.value) : '0x',
    chainId: network.chainId,
    gas: `0x${BigInt(tx.gas ?? 0).toString(16)}`,
    nonce: tx.nonce ? tx.nonce : `0x1`,
  };
}
