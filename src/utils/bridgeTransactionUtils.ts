import { Blockchain } from '@avalabs/bridge-sdk';
import {
  BitcoinConfigAssets,
  BridgeTransaction,
  EthereumConfigAssets,
} from '@avalabs/bridge-sdk';
import {
  getTransactionLink,
  TransactionERC20,
  WalletState,
} from '@avalabs/wallet-react-components';
import { BitcoinHistoryTx } from '@avalabs/wallets-sdk';
import { TxHistoryItem } from '@src/background/services/history/models';
import { isTransactionBitcoin, isTransactionERC20 } from './transactionUtils';

type HistoryTx = WalletState['recentTxHistory'][0] | BitcoinHistoryTx;

export const ETHEREUM_ADDRESS = '0x0000000000000000000000000000000000000000';

export function isBridgeTransaction(
  tx: HistoryTx,
  ethereumWrappedAssets: EthereumConfigAssets,
  bitcoinAssets: BitcoinConfigAssets,
  bitcoinWalletAddresses: string[]
) {
  const isAcceptedType = isTransactionERC20(tx) || isTransactionBitcoin(tx);
  return (
    isAcceptedType &&
    (isBridgeTransactionEVM(tx, ethereumWrappedAssets) ||
      isBridgeTransactionBTC(tx, bitcoinAssets, bitcoinWalletAddresses))
  );
}

/**
 * Checking if the transaction is a bridge transaction with Ethereum
 *
 * If the tx is TransactionERC20
 * to or from has to be ETHEREUM_ADDRESS
 * and the contractAddress of the transaction has to match one of the addresses from EthereumConfigAssets
 *
 * If the tx is BitcoinHistoryTx
 * it should be false since we currently do not support bridge between Bitcoin and Ethereum
 */
export function isBridgeTransactionEVM(
  tx: TransactionERC20 | BitcoinHistoryTx,
  ethereumWrappedAssets: EthereumConfigAssets
): boolean {
  if (isTransactionBitcoin(tx)) {
    return false;
  }

  return Object.values(ethereumWrappedAssets).some(
    ({ wrappedContractAddress }) => {
      return (
        wrappedContractAddress.toLowerCase() ===
          (tx as TransactionERC20).contractAddress.toLowerCase() &&
        ((tx as TransactionERC20).to === ETHEREUM_ADDRESS ||
          (tx as TransactionERC20).from === ETHEREUM_ADDRESS)
      );
    }
  );
}

/**
 * Checking if the transaction is a bridge transaction with Bitcoin
 *
 * If the tx is TransactionERC20
 * The contractAddress from the transaction has to match one of the addresses from BitcoinConfigAssets
 *
 * If the tx is BitcoinHistoryTx
 * addresses is an array of addresses to or from.
 * It should include
 * config.criticalBitcoin?.walletAddresses.btc or
 * config.criticalBitcoin?.walletAddresses.avalanche
 */
export function isBridgeTransactionBTC(
  tx: TransactionERC20 | BitcoinHistoryTx,
  bitcoinAssets: BitcoinConfigAssets,
  bitcoinWalletAddresses: string[]
): boolean {
  if (isTransactionBitcoin(tx)) {
    return tx.addresses.some((address) => {
      return bitcoinWalletAddresses.some(
        (walletAddress) => address.toLowerCase() === walletAddress.toLowerCase()
      );
    });
  }

  return Object.values(bitcoinAssets).some(
    ({ wrappedContractAddress }) =>
      wrappedContractAddress.toLowerCase() === tx.contractAddress.toLowerCase()
  );
}

export function isPendingBridgeTransaction(
  item: TxHistoryItem | BridgeTransaction
): item is BridgeTransaction {
  return 'addressBTC' in item;
}

export function getLinkForBridgeTransaction(
  chain: Blockchain,
  txHash: string,
  isMainnet: boolean
): string {
  switch (chain) {
    case Blockchain.AVALANCHE:
      return getTransactionLink(txHash, isMainnet);
    case Blockchain.BITCOIN:
      return getBTCBlockchainLink(txHash, isMainnet);
    default:
      return getEtherscanLink(txHash, isMainnet);
  }
}

export function getEtherscanLink(txHash: string, isMainnet: boolean) {
  const root = isMainnet
    ? 'https://etherscan.io'
    : 'https://rinkeby.etherscan.io';
  return `${root}/tx/${txHash}`;
}

export function getBTCBlockchainLink(txHash: string, isMainnet: boolean) {
  const env = isMainnet ? 'btc' : 'btc-testnet';
  return `https://www.blockchain.com/${env}/tx/${txHash}`;
}
