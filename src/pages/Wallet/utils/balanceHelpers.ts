import { BN, Utils } from '@avalabs/avalanche-wallet-sdk';

export function getAvaxBalanceUSD(balanceAvaxTotal: BN, avaxUSD: number) {
  console.log(balanceAvaxTotal.toString(), avaxUSD);
  return Utils.bnToLocaleString(balanceAvaxTotal.mul(new BN(avaxUSD)), 9);
}
export function getAvaxBalanceTotal(balanceAvaxTotal: BN) {
  return Utils.bnToLocaleString(balanceAvaxTotal, 9);
}
