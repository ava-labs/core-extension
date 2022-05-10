import { BridgeTransaction, useBridgeSDK } from '@avalabs/bridge-sdk';
import { TransactionERC20 } from '@avalabs/wallet-react-components';
import { isPendingBridgeTransaction } from '@src/utils/bridgeTransactionUtils';

export function useBlockchainNames(item: TransactionERC20 | BridgeTransaction) {
  const pending = isPendingBridgeTransaction(item);
  const { avalancheAssets } = useBridgeSDK();

  if (pending) {
    return {
      sourceBlockchain: titleCase(item.sourceChain),
      targetBlockchain: titleCase(item.targetChain),
    };
  }

  // e.g. remove '.e' from 'LINK.e'
  const symbol = item.tokenSymbol.split('.')[0];
  const isToAvalanche =
    item.from === '0x0000000000000000000000000000000000000000';
  const txBlockchain = titleCase(
    avalancheAssets[symbol]?.nativeNetwork || 'N/A'
  );

  return {
    sourceBlockchain: isToAvalanche ? txBlockchain : 'Avalanche',
    targetBlockchain: isToAvalanche ? 'Avalanche' : txBlockchain,
  };
}

function titleCase(name: string) {
  return name[0].toUpperCase() + name.slice(1);
}
