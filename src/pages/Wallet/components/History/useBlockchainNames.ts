import { Blockchain, BridgeTransaction } from '@avalabs/core-bridge-sdk';
import { BridgeTransfer } from '@avalabs/bridge-unified';
import { BITCOIN_NETWORK, ChainId } from '@avalabs/core-chains-sdk';
import { TxHistoryItem } from '@src/background/services/history/models';
import { isEthereumChainId } from '@src/background/services/network/utils/isEthereumNetwork';
import { useUnifiedBridgeContext } from '@src/contexts/UnifiedBridgeProvider';
import { isUnifiedBridgeTransfer } from '@src/pages/Bridge/utils/isUnifiedBridgeTransfer';
import {
  ETHEREUM_ADDRESS,
  isPendingBridgeTransaction,
} from '@src/utils/bridgeTransactionUtils';
import { caipToChainId } from '@src/utils/caipConversion';
import { getBridgedAssetSymbol } from '@src/utils/bridge/getBridgedAssetSymbol';

export function useBlockchainNames(
  item: TxHistoryItem | BridgeTransaction | BridgeTransfer
) {
  const { isBridgeAddress } = useUnifiedBridgeContext();
  const pending = isPendingBridgeTransaction(item);

  if (pending) {
    return {
      sourceBlockchain: titleCase(
        typeof item.sourceChain === 'object'
          ? item.sourceChain.chainName
          : item.sourceChain
      ),
      targetBlockchain: titleCase(
        typeof item.targetChain === 'object'
          ? item.targetChain.chainName
          : item.targetChain
      ),
    };
  }

  const isToAvalanche = isTxToAvalanche(item);
  const txBlockchain = getTxBlockchain(item, isBridgeAddress);

  return {
    sourceBlockchain: isToAvalanche ? txBlockchain : 'Avalanche',
    targetBlockchain: isToAvalanche ? 'Avalanche' : txBlockchain,
  };
}

function titleCase(name: string) {
  return (name[0] || '').toUpperCase() + name.slice(1);
}

function isBridgeTransaction(
  tx: TxHistoryItem | BridgeTransaction | BridgeTransfer
): tx is BridgeTransaction | BridgeTransfer {
  return 'targetChain' in tx;
}

function isTxToAvalanche(
  tx: TxHistoryItem | BridgeTransaction | BridgeTransfer
): boolean {
  if (isBridgeTransaction(tx)) {
    if (isUnifiedBridgeTransfer(tx)) {
      return (
        caipToChainId(tx.targetChain.chainId) === ChainId.ETHEREUM_HOMESTEAD ||
        caipToChainId(tx.targetChain.chainId) === ChainId.ETHEREUM_TEST_GOERLY
      );
    }

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

function getTxBlockchain(
  tx: TxHistoryItem | BridgeTransaction | BridgeTransfer,
  isBridgeAddress: (...addresses: string[]) => boolean
) {
  const symbol = isBridgeTransaction(tx)
    ? getBridgedAssetSymbol(tx)
    : tx.tokens?.[0]?.symbol;
  const ethereum = 'Ethereum';
  const bitcoin = 'Bitcoin';

  if (symbol === BITCOIN_NETWORK.networkToken.symbol) {
    return bitcoin;
  }

  if (!isBridgeTransaction(tx)) {
    if (isEthereumChainId(Number(tx.chainId))) {
      return ethereum;
    }

    if (isBridgeAddress(tx.to, tx.from)) {
      return ethereum;
    }
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
