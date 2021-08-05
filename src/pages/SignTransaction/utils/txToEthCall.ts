import { EthCall } from '@src/background/models';
import { Transaction } from '@src/background/services/transactions/models';

export function txToEthCall(tx?: Transaction): EthCall | undefined {
  if (!tx) return undefined;

  return {
    to: tx.txParams.to,
    id: tx.id,
    from: tx.txParams.from,
    value: tx.txParams.value,
    data: tx.txParams.data,
  };
}
