import { BN, Utils } from '@avalabs/avalanche-wallet-sdk';

export function getAvaxBalanceUSD(balanceAvaxTotal, avaxUSD: number) {
  return Utils.bnToLocaleString(balanceAvaxTotal.mul(new BN(avaxUSD)), 9);
}
export function getAvaxBalanceTotal(balanceAvaxTotal) {
  return Utils.bnToLocaleString(balanceAvaxTotal, 9);
}
