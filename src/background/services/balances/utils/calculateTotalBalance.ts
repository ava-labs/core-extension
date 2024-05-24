import { PChainBalance, XChainBalances } from '@avalabs/glacier-sdk';
import BN from 'bn.js';

export function calculateTotalBalance(
  uxtos: PChainBalance | XChainBalances
): BN {
  const sum = Object.values(uxtos).reduce(function (totalAcc, utxoList) {
    const typeSum = utxoList.reduce(function (typeAcc, utxo) {
      const balanceToAdd = Number(utxo.amount);
      return typeAcc + balanceToAdd;
    }, 0);

    return totalAcc + typeSum;
  }, 0);

  return new BN(sum);
}
