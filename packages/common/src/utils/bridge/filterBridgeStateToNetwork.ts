import { Network } from '@avalabs/core-chains-sdk';
import { BridgeState } from '@core/types';
import { isAvalancheNetwork } from '@core/common';
import { isEthereumNetwork } from '@core/common';
import { isBitcoinNetwork } from '@core/common';

enum BridgeNetwork {
  AVALANCHE = 'avalanche',
  BITCOIN = 'bitcoin',
  ETHEREUM = 'ethereum',
}

/**
 * Remove bridgeTransactions that don't belong to the given network.
 */
export function filterBridgeStateToNetwork(
  bridge: BridgeState,
  network: Network,
): BridgeState {
  const networkNameToCheck = isBitcoinNetwork(network)
    ? BridgeNetwork.BITCOIN
    : isAvalancheNetwork(network)
      ? BridgeNetwork.AVALANCHE
      : isEthereumNetwork(network)
        ? BridgeNetwork.ETHEREUM
        : null;

  const isMainnet = !network.isTestnet;
  const bridgeTransactions = Object.values(bridge.bridgeTransactions).reduce<
    BridgeState['bridgeTransactions']
  >((txs, btx) => {
    if (
      (btx.sourceChain.valueOf() === networkNameToCheck ||
        btx.targetChain.valueOf() === networkNameToCheck) &&
      btx.environment === (isMainnet ? 'main' : 'test')
    ) {
      txs[btx.sourceTxHash] = btx;
    }
    return txs;
  }, {});

  return { ...bridge, bridgeTransactions };
}
