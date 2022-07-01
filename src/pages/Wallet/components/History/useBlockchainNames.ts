import { Blockchain, BridgeTransaction } from '@avalabs/bridge-sdk';
import { BITCOIN_NETWORK, ChainId } from '@avalabs/chains-sdk';
import { TxHistoryItem } from '@src/background/services/history/models';
import {
  ETHEREUM_ADDRESS,
  isPendingBridgeTransaction,
} from '@src/utils/bridgeTransactionUtils';

export function useBlockchainNames(item: TxHistoryItem | BridgeTransaction) {
  const pending = isPendingBridgeTransaction(item);

  if (pending) {
    return {
      sourceBlockchain: titleCase(item.sourceChain),
      targetBlockchain: titleCase(item.targetChain),
    };
  }

  const isToAvalanche = isTxToAvalanche(item);
  const txBlockchain = getTxBlockchain(item);

  return {
    sourceBlockchain: isToAvalanche ? txBlockchain : 'Avalanche',
    targetBlockchain: isToAvalanche ? 'Avalanche' : txBlockchain,
  };
}

function titleCase(name: string) {
  return (name[0] || '').toUpperCase() + name.slice(1);
}

function isBridgeTransaction(
  tx: TxHistoryItem | BridgeTransaction
): tx is BridgeTransaction {
  return 'addressBTC' in tx;
}

function isTxToAvalanche(tx: TxHistoryItem | BridgeTransaction): boolean {
  if (isBridgeTransaction(tx)) {
    return tx.targetChain === Blockchain.AVALANCHE;
  } else if (tx.from === ETHEREUM_ADDRESS) {
    return true;
  } else if (tx.isOutgoing) {
    return (
      tx.chainId !== ChainId.AVALANCHE_MAINNET_ID.toString() &&
      tx.chainId !== ChainId.AVALANCHE_TESTNET_ID.toString()
    );
  } else if (tx.isIncoming) {
    return (
      tx.chainId === ChainId.AVALANCHE_MAINNET_ID.toString() ||
      tx.chainId === ChainId.AVALANCHE_TESTNET_ID.toString()
    );
  }
  return false;
}

function getTxBlockchain(tx: TxHistoryItem | BridgeTransaction) {
  const symbol = isBridgeTransaction(tx) ? tx.symbol : tx.token?.symbol;
  const ethereum = 'Ethereum';
  const bitcoin = 'Bitcoin';

  if (symbol === BITCOIN_NETWORK.networkToken.symbol) {
    return bitcoin;
  }
  const symbolPostfix = symbol?.split('.')[1];

  switch (symbolPostfix) {
    case 'e':
      return ethereum;
    case 'b':
      return bitcoin;
    default:
      return 'N/A';
  }
}
