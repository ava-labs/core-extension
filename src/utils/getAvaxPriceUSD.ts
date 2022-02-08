import { bnToLocaleString, BN } from '@avalabs/avalanche-wallet-sdk';
export function getAvaxBalanceUSD(balanceAvaxTotal: BN, avaxUSD: BN) {
  return bnToLocaleString(balanceAvaxTotal.mul(avaxUSD), 9);
}
