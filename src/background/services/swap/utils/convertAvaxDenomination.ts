import { Big } from '@avalabs/avalanche-wallet-sdk';

/**
 * Paraswap uses AVAX with denomination of 18 while the wallet uses denomination 9
 * convert amount between denomination of 9 and 18
 **/

export function avaxFrom9To18(amount: string): string {
  // add 9 extra zeros to the end to get to denomination 18
  return `${amount}000000000`;
}

export function avaxFrom18To9(amount: string): string {
  return new Big(amount).div(new Big(10).pow(9)).round().toString();
}
