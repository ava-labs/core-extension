import type { Network } from '@avalabs/core-chains-sdk';
import { ChainId, NetworkVMType } from '@avalabs/core-chains-sdk';

export function isPchainNetwork(network?: Network) {
  if (!network) {
    return false;
  }
  return network.vmName === NetworkVMType.PVM;
}

export function isPchainNetworkId(chainId: number) {
  return (
    ChainId.AVALANCHE_P === chainId ||
    ChainId.AVALANCHE_TEST_P === chainId ||
    ChainId.AVALANCHE_DEVNET_P === chainId // TODO: to remove this.
  );
}
