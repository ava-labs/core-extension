import { PChainTransactionType, RichAddress } from '@avalabs/glacier-sdk';
import { TokenType } from '../balances/models';

export interface TxHistoryItemToken {
  decimal?: string;
  name: string;
  symbol: string;
  amount: string;
  imageUri?: string;
  from?: RichAddress;
  to?: RichAddress;
  collectableTokenId?: string;
  type: TokenType;
}
export interface TxHistoryItem {
  isBridge: boolean;
  isContractCall: boolean;
  isIncoming: boolean;
  isOutgoing: boolean;
  isSender: boolean;
  timestamp: string;
  hash: string;
  from: string;
  to: string;
  tokens: TxHistoryItemToken[];
  gasPrice?: string;
  gasUsed: string;
  explorerLink: string;
  chainId: string; // chainId from ActiveNetwork used to fetch tx
  type: TransactionType;
}

export interface PchainTxHistoryItem {
  from: string[];
  to: string[];
  isSender: boolean;
  timestamp: string;
  token: TxHistoryItemToken;
  gasUsed: string;
  explorerLink: string;
  chainId: string; // chainId from ActiveNetwork used to fetch tx
  type: PChainTransactionType;
}

export enum TransactionType {
  BRIDGE = 'Bridge',
  SWAP = 'Swap',
  SEND = 'Send',
  RECEIVE = 'Receive',
  NFT_BUY = 'NFT Buy',
  APPROVE = 'Approve',
  TRANSFER = 'Transfer',
  BASE_TX = 'BaseTx',
  UNKNOWN = 'Unknown',
}

export const NonContractCallTypes = [
  TransactionType.BRIDGE,
  TransactionType.SEND,
  TransactionType.RECEIVE,
  TransactionType.TRANSFER,
];

export interface HistoryItemCategories {
  isBridge: boolean;
  isSwap: boolean;
  isNativeSend: boolean;
  isNativeReceive: boolean;
  isNFTPurchase: boolean;
  isApprove: boolean;
  isTransfer: boolean;
  isAirdrop: boolean;
  isUnwrap: boolean;
  isFillOrder: boolean;
  isContractCall: boolean;
  method: string;
  type: TransactionType;
}

export interface SubnetHistoryItem {
  hash: string;
  status: number;
  gasPrice: number;
  gasUsed: number;
  timestamp: number;
  from: string;
  to: string;
  value: string;
  method: string;
  type: number;
  block: number;
  toContract?: {
    name: string;
    symbol: string;
    decimals: number;
  };
}
