import { Network } from '@avalabs/chains-sdk';
import { DebankTransactionData } from '../models';
import { EthSendTransactionParams } from '../../wallet/handlers/eth_sendTransaction/models';

export function txParamsToTransactionData(
  network: Network,
  tx: EthSendTransactionParams
): DebankTransactionData {
  return {
    from: tx.from,
    to: tx.to ?? '0x',
    data: tx.data ?? '0x',
    value: tx.value ?? '0x',
    chainId: network.chainId,
    gas: `0x${BigInt(tx.gas ?? 0).toString(16)}`,
    nonce: tx.nonce ? tx.nonce : `0x1`,
  };
}
