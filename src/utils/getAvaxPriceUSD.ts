import { Utils, BN } from '@avalabs/avalanche-wallet-sdk';
export function getAvaxBalanceUSD(balanceAvaxTotal: BN, avaxUSD: BN) {
  return Utils.bnToLocaleString(balanceAvaxTotal.mul(avaxUSD), 9);
}
