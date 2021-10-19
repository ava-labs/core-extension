import { BN } from '@avalabs/avalanche-wallet-sdk';

/**
 * BN has a bug when a converting hex to BN, if the hex starts with
 * 0x BN doesnt know how to handle it and returns an incorrect value
 *
 * On the flip, BigInt cant parse hex without the 0x so we will use
 * this helper function to deal with this
 * @param hex the hex value
 * @returns BN
 */
export function hexToBN(hex: string) {
  return hex.match('0x') ? new BN(BigInt(hex) as any) : new BN(hex, 'hex');
}
