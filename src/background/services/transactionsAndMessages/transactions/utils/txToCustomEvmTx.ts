import BN from 'bn.js';
import { Transaction } from '../models';

export async function txToCustomEvmTx(tx?: Transaction) {
  if (!tx) {
    throw new Error('transaction is malformed');
  }

  const txParams = tx.txParams;
  const { gas, gasPrice, to, from, data, value } = txParams;

  if (!gas || !gasPrice) {
    throw new Error('Gas or gas estimate is malformed');
  }

  if (!to && !data) {
    throw new Error('the to or data is malformed');
  }

  if (!value) {
    throw new Error('value is missing or malformed');
  }

  const gasBn = new BN(gas);
  const gasPriceNum = Number(gasPrice);

  return {
    gas: gasBn,
    gasPrice: gasPriceNum,
    to,
    from,
    data,
    value,
  };
}
