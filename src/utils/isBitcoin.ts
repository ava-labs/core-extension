import { Network, NetworkVMType } from '@avalabs/chains-sdk';

export function isBitcoin(network?: Network) {
  return network?.vmName === NetworkVMType.BITCOIN;
}
