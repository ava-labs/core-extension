import { Big, isMainnetNetwork } from '@avalabs/avalanche-wallet-sdk';
import { ActiveNetwork } from '../network/models';
import { BridgeState } from './models';

/**
 * Deserialize bridgeState after retrieving from storage.
 * (i.e. convert Big string values back to Big)
 */
export function deserializeBridgeState(state: any): BridgeState {
  const bridgeTransactions = Object.entries<any>(
    state.bridgeTransactions
  ).reduce((txs, [txHash, tx]) => {
    txs[txHash] = {
      ...tx,
      amount: new Big(tx.amount),
      sourceNetworkFee: tx.sourceNetworkFee && new Big(tx.sourceNetworkFee),
      targetNetworkFee: tx.targetNetworkFee && new Big(tx.targetNetworkFee),
    };
    return txs;
  }, {} as BridgeState['bridgeTransactions']);

  return {
    ...state,
    bridgeTransactions,
  };
}

/**
 * Remove bridgeTransactions that don't belong to the given network.
 */
export function filterBridgeStateToNetwork(
  bridge: BridgeState,
  network: ActiveNetwork
): BridgeState {
  const isMainnet = isMainnetNetwork(network.config);
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
