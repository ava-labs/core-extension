import { NetworkFee } from '@src/background/services/networkFee/models';
import { EthSendTransactionParamsWithGas } from '../models';

export function txToCustomEvmTx(
  txParams?: EthSendTransactionParamsWithGas,
  networkFee?: NetworkFee | null
) {
  if (!txParams) {
    throw new Error('transaction is malformed');
  }

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
    maxFeePerGas: maxFeePerGas || gasPrice || networkFee.low.maxFeePerGas,
    maxPriorityFeePerGas:
      maxPriorityFeePerGas || networkFee.low.maxPriorityFeePerGas,
    gasLimit: gasLimit,
    to,
    from,
    data,
    type,
    value,
  };
}
