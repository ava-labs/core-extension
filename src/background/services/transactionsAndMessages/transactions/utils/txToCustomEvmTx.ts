import BN from 'bn.js';
import { Transaction } from '../models';
import { Utils } from '@avalabs/avalanche-wallet-sdk';

export async function txToCustomEvmTx(tx?: Transaction) {
  if (!tx) {
    throw new Error('transaction is malformed');
  }

  const txParams = tx.txParams;
  const { gas, gasPrice: gasPriceFromTx, to, from, data, value } = txParams;

  if (!gas || !gasPriceFromTx) {
    throw new Error('Gas or gas estimate is malformed');
  }

  if (!to && !data) {
    throw new Error('the to or data is malformed');
  }

  if (!value) {
    throw new Error('value is missing or malformed');
  }

  const gasPrice = Utils.numberToBNAvaxX(gasPriceFromTx);
  const gasLimit = Number(gas);

  return {
    gasPrice: gasPrice,
    gasLimit: gasLimit,
    to,
    from,
    data,
    value,
  };
}
