import { Transaction } from '../models';
import { firstValueFrom } from 'rxjs';
import { gasPrice$ } from '../../gas/gas';
import { BN } from '@avalabs/avalanche-wallet-sdk';

export async function txToCustomEvmTx(tx?: Transaction) {
  if (!tx) {
    throw new Error('transaction is malformed');
  }

  const gasPrice = await firstValueFrom(gasPrice$);

  const txParams = tx.txParams;
  const { gas, to, from, data, value, gasPrice: txGasPriceHex } = txParams;

  if (!gas || !gasPrice) {
    throw new Error('Gas or gas estimate is malformed');
  }

  if (!to && !data) {
    throw new Error('the to or data is malformed');
  }

  const gasLimit = Number(gas);
  const bnGasPrice = txGasPriceHex && new BN(txGasPriceHex, 'hex');

  return {
    gasPrice: bnGasPrice || gasPrice.bn,
    gasLimit: gasLimit,
    to,
    from,
    data,
    value,
  };
}
