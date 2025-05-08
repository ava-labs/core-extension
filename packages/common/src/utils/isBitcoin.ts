import { Network, NetworkVMType } from '@avalabs/core-chains-sdk';

export function isBitcoin(network?: Network) {
  return network?.vmName === NetworkVMType.BITCOIN;
}
