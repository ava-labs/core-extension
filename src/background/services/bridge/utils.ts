import { Network } from '@avalabs/chains-sdk';
import { BridgeState } from './models';

/**
 * Remove bridgeTransactions that don't belong to the given network.
 */
export function filterBridgeStateToNetwork(
  bridge: BridgeState,
  network: Network
): BridgeState {
  const isMainnet = !network.isTestnet;
  const bridgeTransactions = Object.values(bridge.bridgeTransactions).reduce<
    BridgeState['bridgeTransactions']
  >((txs, btx) => {
    if (btx.environment === (isMainnet ? 'main' : 'test')) {
      txs[btx.sourceTxHash] = btx;
    }
    return txs;
  }, {});

  return { ...bridge, bridgeTransactions };
}
