import { Transaction } from '../models';
import { BigNumber } from 'ethers';
import { NetworkFee } from '../../networkFee/models';

export function txToCustomEvmTx(
  tx?: Transaction,
  networkFee?: NetworkFee | null
) {
  if (!tx) {
    throw new Error('transaction is malformed');
  }

  const txParams = tx.txParams;
  const { gas, to, from, data, value, gasPrice } = txParams;

  if (!gas || !networkFee) {
    throw new Error('Gas or gas estimate is malformed');
  }

  if (!to && !data) {
    throw new Error('the to or data is malformed');
  }

  const gasLimit = Number(gas);

  return {
    gasPrice: BigNumber.from(gasPrice || networkFee.low),
    gasLimit: gasLimit,
    to,
    from,
    data,
    value,
  };
}
