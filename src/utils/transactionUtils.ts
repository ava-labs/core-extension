import {
  TransactionERC20,
  TransactionNormal,
} from '@avalabs/wallet-react-components';
import { BitcoinHistoryTx } from '@avalabs/wallets-sdk';
import { HistoricTxType } from '@src/background/services/history/models';

export function isTransactionERC20(tx: HistoricTxType): tx is TransactionERC20 {
  return 'tokenName' in tx;
}

export function isTransactionNormal(
  tx: HistoricTxType
): tx is TransactionNormal {
  return 'blockNumber' in tx && !('tokenName' in tx);
}

export function isTransactionBitcoin(
  tx: HistoricTxType
): tx is BitcoinHistoryTx {
  return 'containsMultisig' in tx;
}
