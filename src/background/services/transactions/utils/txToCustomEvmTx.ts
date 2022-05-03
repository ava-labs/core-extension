import { Transaction } from '../models';
import { hexToBN } from '@src/utils/hexToBN';
import { GasPrice } from '../../networkFee/models';

export async function txToCustomEvmTx(tx?: Transaction, gasPrice?: GasPrice) {
  if (!tx) {
    throw new Error('transaction is malformed');
  }

  const txParams = tx.txParams;
  const { gas, to, from, data, value, gasPrice: txGasPriceHex } = txParams;

  if (!gas || !gasPrice) {
    throw new Error('Gas or gas estimate is malformed');
  }

  if (!to && !data) {
    throw new Error('the to or data is malformed');
  }

  const gasLimit = Number(gas);
  const bnGasPrice = txGasPriceHex && hexToBN(txGasPriceHex);

  return {
    gasPrice: bnGasPrice || gasPrice.bn,
    gasLimit: gasLimit,
    to,
    from,
    data,
    value,
  };
}
