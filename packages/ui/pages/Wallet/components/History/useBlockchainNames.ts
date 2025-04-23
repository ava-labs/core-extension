import { BridgeTransaction } from '@avalabs/core-bridge-sdk';
import { BridgeTransfer } from '@avalabs/bridge-unified';

import { TxHistoryItem } from '@core/service-worker';
import { isPendingBridgeTransaction } from '@core/utils';
import { useNetworkContext } from '@src/contexts/NetworkProvider';

export function useBlockchainNames(
  item: TxHistoryItem | BridgeTransaction | BridgeTransfer,
) {
  const pending = isPendingBridgeTransaction(item);
  const { getNetwork } = useNetworkContext();

  if (pending) {
    return {
      sourceBlockchain: titleCase(
        typeof item.sourceChain === 'object'
          ? item.sourceChain.chainName
          : item.sourceChain,
      ),
      targetBlockchain: titleCase(
        typeof item.targetChain === 'object'
          ? item.targetChain.chainName
          : item.targetChain,
      ),
    };
  }

  if (!item.bridgeAnalysis.isBridgeTx) {
    return {
      sourceBlockchain: undefined,
      targetBlockchain: undefined,
    };
  }

  const { sourceChainId, targetChainId } = item.bridgeAnalysis;

  return {
    sourceBlockchain: sourceChainId
      ? (getNetwork(sourceChainId)?.chainName ?? sourceChainId)
      : undefined,
    targetBlockchain: targetChainId
      ? (getNetwork(targetChainId)?.chainName ?? targetChainId)
      : undefined,
  };
}

function titleCase(name: string) {
  return (name[0] || '').toUpperCase() + name.slice(1);
}
