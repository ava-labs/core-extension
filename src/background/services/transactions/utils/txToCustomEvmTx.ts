import { Transaction } from '../models';
import { NetworkFee } from '../../networkFee/models';

export function txToCustomEvmTx(
  tx?: Transaction,
  networkFee?: NetworkFee | null
) {
  if (!tx) {
    throw new Error('transaction is malformed');
  }

  const txParams = tx.txParams;
  const {
    gas,
    to,
    from,
    data,
    type,
    value,
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
  } = txParams;

  if (!gas || !networkFee) {
    throw new Error('Gas or gas estimate is malformed');
  }

  if (!to && !data) {
    throw new Error('the to or data is malformed');
  }

  const gasLimit = Number(gas);

  if (!maxFeePerGas && !gasPrice) {
    throw new Error(
      `not enough gas price data: provide values for [gasPrice] or [maxFeePerGas]`
    );
  }

  return {
    maxFeePerGas: maxFeePerGas || gasPrice || networkFee.low.maxFee,
    maxPriorityFeePerGas: maxPriorityFeePerGas || networkFee.low.maxTip,
    gasLimit: gasLimit,
    to,
    from,
    data,
    type,
    value,
  };
}
