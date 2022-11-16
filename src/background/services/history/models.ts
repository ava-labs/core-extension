export interface TxHistoryItemToken {
  decimal?: string;
  name: string;
  symbol: string;
  amount?: string;
}
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
  token?: TxHistoryItemToken;
  explorerLink: string;
  chainId: string; // chainId from ActiveNetwork used to fetch tx
}

export enum TransactionType {
  BRIDGE = 'Bridge',
  SWAP = 'Swap',
  SEND = 'Send',
  RECEIVE = 'Receive',
  NFT_BUY = 'NFT Buy',
  APPROVE = 'Approve',
  TRANSFER = 'Transfer',
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
