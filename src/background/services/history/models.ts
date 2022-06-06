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
  token?: {
    decimal: string;
    name: string;
    symbol: string;
  };
  explorerLink: string;
  chainId: string; // chainId from ActiveNetwork used to fetch tx
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
