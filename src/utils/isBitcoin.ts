import type { Network } from '@avalabs/core-chains-sdk';
import { NetworkVMType } from '@avalabs/core-chains-sdk';

export function isBitcoin(network?: Network) {
  return network?.vmName === NetworkVMType.BITCOIN;
}
