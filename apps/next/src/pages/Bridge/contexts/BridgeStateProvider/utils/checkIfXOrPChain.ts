import { isPchainNetworkId, isXchainNetworkId } from '@core/common';
import { NetworkWithCaipId } from '@core/types';

export function checkIfXorPChain(
  sourceNetwork: NetworkWithCaipId | undefined,
): boolean {
  if (!sourceNetwork) {
    return false;
  }

  return (
    isXchainNetworkId(sourceNetwork.chainId) ||
    isPchainNetworkId(sourceNetwork.chainId)
  );
}
