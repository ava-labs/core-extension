import { ChainId, Network, NetworkVMType } from '@avalabs/chains-sdk';

export function isXchainNetwork(network?: Network) {
  if (!network) {
    return false;
  }
  return network.vmName === NetworkVMType.AVM;
}

//TODO: Fix this once we figure out how to separate between x and p chain ID
export function isXchainNetworkId(chainId: number) {
  return (
    ChainId.AVALANCHE_X === chainId || ChainId.AVALANCHE_TEST_X === chainId
  );
}
