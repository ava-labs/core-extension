import {
  TransactionERC20,
  TransactionNormal,
} from '@avalabs/wallet-react-components';
import { BitcoinHistoryTx } from '@avalabs/wallets-sdk';

export interface TxHistoryItem {
  isBridge: boolean;
  isContractCall: boolean;
  isIncoming: boolean;
  isOutgoing: boolean;
  isSender: boolean;
  timestamp: string;
  hash: string;
  amount: string;
  from: string;
  to: string;
  token: {
    decimal: string;
    name: string;
    symbol: string;
  };
  explorerLink: string;
  chainId: string; // chainId from ActiveNetwork used to fetch tx
}

export type HistoricTxType =
  | TransactionNormal
  | TransactionERC20
  | BitcoinHistoryTx;
